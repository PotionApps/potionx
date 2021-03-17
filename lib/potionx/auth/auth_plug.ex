defmodule Potionx.Plug.Auth do
  @behaviour Plug
  alias Potionx.Context.Service

  def call(%{assigns: %{context: %Service{}}} = conn, opts) do
    conn
    |> Plug.Conn.fetch_cookies(
      signed: Enum.map(Map.values(Potionx.Auth.token_config()), &(&1.name))
    )
    |> fetch_session_from_conn(opts)
    |> maybe_allow(opts)
  end

  def fetch_session_from_conn(%{assigns: %{context: ctx}} = conn, %{session_service: session_service, uuid_key: key}) do
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
        uuid_key: :uuid_access,
        user_optional: false
      ],
      opts
    )
    |> Enum.into(%{})
  end

  def maybe_allow(%{assigns: %{context: %{session: %{user: %{id: id}}}}} = conn, opts) when not is_nil(id) do
    cond do
      conn.request_path === opts.login_path ->
        Phoenix.Controller.redirect(conn, to: "/")
        |> Plug.Conn.halt  
      true -> 
        conn
    end
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

end
