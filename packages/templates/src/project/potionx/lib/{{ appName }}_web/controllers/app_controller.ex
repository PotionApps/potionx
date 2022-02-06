defmodule <%= webNamespace %>.AppController do
  use <%= webNamespace %>, :controller

  def add_default_meta(conn) do
    conn
    |> assign(:title, "<%= appModule %> | <%= appModule %>")
    |> assign(:meta_desc, "<%= appModule %>")
  end

  def add_subdomain(%Plug.Conn{} = conn) do
    conn
    |> assign(:subdomain, Potionx.Utils.URI.subdomain(conn))
  end

  def index(conn, _params) do
    conn
    |> add_default_meta
    |> add_subdomain
    |> render("index.html")
  end
end
