defmodule <%= webNamespace %>.AppController do
  use <%= webNamespace %>, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
