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
    pow_config = Pow.Plug.fetch_config(conn)

    conn
    |> Potionx.Plug.ApiAuth.renew(pow_config)
    |> case do
      {conn, nil} ->
        cond do
          Enum.member?(config.public_urls, conn.host) ->
            conn
          Enum.at(conn.path_info, 0) === "login" ->
            conn
          true ->
            Phoenix.Controller.redirect(conn, to: config.login_path)
            |> Conn.halt
        end
      {conn, _user} ->
        conn
        |> Potionx.Plug.ApiAuth.handle_cookies(
          %{
            access_token: conn.private[:api_access_token],
            renewal_token: conn.private[:api_renewal_token]
          },
          pow_config
        )
        |> (fn conn ->
          if Enum.at(conn.path_info, 0) === "login" do
            Phoenix.Controller.redirect(conn, to: "/")
            |> Conn.halt
          else
            conn
          end
        end).()
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
