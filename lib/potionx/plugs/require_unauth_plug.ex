defmodule Potionx.Plug.RequireUnauth do
  @behaviour Plug
  alias Potionx.Context.Service

  def call(%{assigns: %{context: %Service{}}} = conn, opts) do
    conn
    |> maybe_redirect(opts)
  end

  def init(opts) do
    Keyword.merge(
      [],
      opts
    )
    |> Enum.into(%{})
  end

  def maybe_redirect(%{halted: true} = conn, _), do: conn
  def maybe_redirect(%{assigns: %{context: %{session: %{user: %{id: id}}}}} = conn, _opts) when not is_nil(id) do
    Phoenix.Controller.redirect(conn, to: "/")
    |> Plug.Conn.halt
  end
  def maybe_redirect(conn, _) do
    conn
  end
end
