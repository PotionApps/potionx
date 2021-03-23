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
    |> maybe_allow(opts)
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
        login_path: "/login",
        public_hosts: [],
        session_optional: false,
        session_service: false,
        user_optional: false
      ],
      opts
    )
    |> Enum.into(%{})
  end

  def maybe_allow(%{halted: true} = conn, _), do: conn
  def maybe_allow(%{assigns: %{context: %{session: %{user: %{id: id}}}}} = conn, opts) when not is_nil(id) do
    cond do
      conn.request_path === opts.login_path ->
        Phoenix.Controller.redirect(conn, to: "/")
        |> Plug.Conn.halt
      true ->
        conn
    end
  end
  def maybe_allow(%{assigns: %{context: %{session: %{id: id}}}} = conn, %{user_optional: true}) when not is_nil(id) do
    conn
  end

  def maybe_allow(%Plug.Conn{host: host, method: method, request_path: path} = conn, opts) do
    cond do
      Enum.member?(opts.public_hosts, host) ->
        conn
      path === opts.login_path ->
        conn
      opts.session_optional and opts.user_optional ->
        conn
      method === "GET" ->
        Phoenix.Controller.redirect(conn, to: opts.login_path)
        |> Plug.Conn.halt
      true ->
        conn
        |> Plug.Conn.put_status(401)
        |> Plug.Conn.halt
    end
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
      _err ->
        conn
        |> Plug.Conn.assign(:potionx_auth_error, "session_renew_error")
        |> Plug.Conn.put_status(401)
        |> Plug.Conn.halt
     end
  end
end
