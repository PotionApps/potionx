defmodule Potionx.Plug.MaybeRequireAuth do
  @behaviour Plug
  @moduledoc false
  alias Plug.Conn

  @doc false
  @spec init(Config.t()) :: atom()
  def init(config) do
    Enum.into(config, %{
      login_path: "/login",
      public_urls: []
    })
  end

  @doc false
  @spec call(Conn.t(), atom()) :: Conn.t()
  def call(conn, config) do
    conn
    |> Pow.Plug.current_user()
    |> maybe_redirect(conn, config)
  end

  defp maybe_redirect(nil, conn, config) do
    cond do
      Enum.member?(config.public_urls, conn.host) ->
        conn
      Enum.at(conn.path_info, 0) === "login" ->
        conn
      true ->
        IO.inspect(conn)
        Phoenix.Controller.redirect(conn, to: config.login_path)
        |> Conn.halt
    end
  end
  defp maybe_redirect(_user, conn, _handler) do
    if Enum.at(conn.path_info, 0) === "login" do
      Phoenix.Controller.redirect(conn, to: "/")
      |> Conn.halt
    else
      conn
    end
  end
end
