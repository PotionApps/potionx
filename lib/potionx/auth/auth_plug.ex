defmodule Potionx.Plug.Auth do
  @behaviour Plug
  alias Potionx.Context.Service

  def call(%{assigns: %{context: %Service{}}} = conn, opts) do
    conn
    |> Plug.Conn.fetch_cookies(
      signed: Enum.map(Map.values(Potionx.Auth.token_config()), &(&1.name))
    )
    |> maybe_renew(opts)
    |> fetch_session_from_conn(opts)
  end

  def fetch_session_from_conn(%{halted: true} = conn, _), do: conn
  def fetch_session_from_conn(%{assigns: %{context: ctx}} = conn, %{session_service: session_service}) do
    cookie_name = Potionx.Auth.token_config.access_token.name
    conn
    |> case do
      %{cookies: %{^cookie_name => token}} ->
        session_service.one_from_cache(
          %Service{
            filters: Map.put(%{}, :uuid_access, token)
          }
        )
      _ ->
        {:error, "no_cookie"}
    end
    |> case do
      %{id: _} = session ->
        conn
        |> Plug.Conn.assign(
          :context, %{
            ctx |
              roles: (Map.get(session, :user) || %{roles: nil}).roles,
              session: session,
              user: session.user
          }
        )
      _ ->
        conn
    end
  end

  def init(opts) do
    if !Keyword.get(opts, :session_service) do
      raise "Potionx.Auth.Plug requires a session service"
    end
    Keyword.merge(
      [
        session_service: false
      ],
      opts
    )
    |> Enum.into(%{})
  end


  def maybe_renew(conn, opts) do
    cookie_name_access = Potionx.Auth.token_config.access_token.name
    cookie_name_renewal = Potionx.Auth.token_config.renewal_token.name

    conn
    |> case do
      %{cookies: %{^cookie_name_access => _}} ->
        conn
      %{cookies: %{^cookie_name_renewal => token}} ->
        renew_or_halt(conn, token, opts)
      _ ->
        conn
    end
  end
  def renew_or_halt(conn, token, %{session_service: session_service}) do
    session_service.patch(
      %Service{
        changes: %{
          ttl_access_seconds: Potionx.Auth.token_config().access_token.ttl_seconds,
          uuid_access: Ecto.UUID.generate(),
          uuid_renewal: Ecto.UUID.generate(),
          ttl_renewal_seconds: Potionx.Auth.token_config().renewal_token.ttl_seconds
        },
        filters: %{
          uuid_renewal: token
        }
      }
    )
    |> case do
      {:ok, %{session_patch: session}} ->
        Potionx.Auth.handle_user_session_cookies(
          session,
          conn
        )
      {:error, :session_old, "missing_session", _} ->
        conn
        |> Potionx.Auth.delete_cookie(%{
          name: Potionx.Auth.token_config().renewal_token.name,
          ttl_seconds: Potionx.Auth.token_config().renewal_token.ttl_seconds
        })
     end
  end
end
