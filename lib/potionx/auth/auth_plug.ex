defmodule Potionx.Plug.Auth do
  @behaviour Plug
  alias Potionx.Context.Service

  def call(%{assigns: %{context: %Service{} = ctx}} = conn, opts) do
    conn
    |> Plug.Conn.fetch_cookies(
      signed: Enum.map(Map.values(Potionx.Auth.token_config()), &(&1.name))
    )
    |> fetch_session_from_conn(opts)
    |> case do
      %{id: _} = session ->
        conn
        |> Plug.Conn.assign(:context, %{ctx | session: session})
      _ ->
        if (opts.auth_optional) do
          conn
        else 
          conn
          |> Plug.Conn.put_status(401)
          |> Plug.Conn.halt
        end
    end
  end

  def fetch_session_from_conn(conn, %{session_service: session_service, uuid_key: key}) do
    %{name: cookie_name} =
      Enum.find(
        Map.values(Potionx.Auth.token_config()),
        fn s -> s.uuid_key === key end
      )
    conn
    |> case do
      %{cookies: %{^cookie_name => token}} ->
        session_service.one_from_cache(
          %Service{
            filters: Map.put(%{}, key, token)
          }
        )
      _ ->
        {:error, "no_cookie"}
    end
  end

  def init(opts) do
    if !Keyword.get(opts, :session_service) do
      raise "Potionx.Auth.Plug requires a session service"
    end
    Keyword.merge(
      [auth_optional: false, uuid_key: :uuid_access],
      opts
    )
    |> Enum.into(%{})
  end
end