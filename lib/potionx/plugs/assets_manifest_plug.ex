defmodule Potionx.Plug.AssetsManifest do
  alias Plug.Conn

  def call(conn, _) do
    conn
    |> Conn.assign(
      :scripts,
      []
    )
    |> Conn.assign(
      :stylesheets,
      []
    )
  end
end
