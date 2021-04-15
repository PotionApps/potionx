defmodule Potionx.Plug.RequireAuth do
  @behaviour Plug
  alias Potionx.Context.Service

  def call(%{assigns: %{context: %Service{}}} = conn, opts) do
    conn
    |> maybe_allow(opts)
  end

  def init(opts) do
    Keyword.merge(
      [
        login_path: "/login"
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

  def maybe_allow(%Plug.Conn{method: method, request_path: path} = conn, opts) do
    cond do
      path === opts.login_path ->
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
