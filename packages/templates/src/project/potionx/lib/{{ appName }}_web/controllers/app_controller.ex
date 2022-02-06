defmodule <%= webNamespace %>.AppController do
  use <%= webNamespace %>, :controller

  def add_default_meta(conn) do
    conn
    |> assign(:title, "<%= appModule %> | <%= appModule %>")
    |> assign(:meta_desc, "<%= appModule %>")
  end

  def index(conn, _params) do
    conn
    |> add_default_meta
    |> render("index.html")
  end
end
