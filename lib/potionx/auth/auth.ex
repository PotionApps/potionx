defmodule Potionx.Auth do
  use TypedStruct
  @cookie_name "auth_session_token"
  @salt "user_session"

  def cookie_options(%Plug.Conn{} = conn, config, max_age) do
    [
      http_only: true,
      domain: conn.host,
      max_age: max_age,
      secure: conn.scheme === :https,
      same_site: "strict"
    ] ++ (config[:cookie_options] || [])
  end

  @spec set_cookie(Plug.Conn.t())
  def set_cookie(conn, %{id: id, ttl_ms: ttl_ms}) do
    conn
    |> Plug.Conn.put_resp_cookie(
      Potionx.Auth.sign(
        conn,
        Jason.encode!(%{
          id: id
        })
      ),
      Potionx.Auth.cookie_options(conn, [], ttl_ms * 1000)
    )
  end

  @spec sign(Plug.Conn.t() | Phoenix.Socket.t(), String.t | integer) :: binary()
  def sign(conn, id) do
    Phoenix.Token.sign(conn, @salt, id)
  end

  def token_config(config \\ []) do
    Map.merge(
      %{
        access_token: %{
          name: "a_app",
          ttl_ms: 60_000 * 30 # 30 minutes
        },
        frontend: %{
          name: "frontend",
          ttl_ms: 60_000 * 30
        },
        renewal_token: %{
          renewal_token: "r_app",
          ttl_ms: 60_000 * 24 * 30 # 30 days
        },
        signin_token: ${
          name: "s_app",
          ttl_ms: 60_000 * 5 # 5 minutes
        }
      },
      Keyword.get(config, :token_config, %{})
    )
  end

  @spec verify(Plug.Conn.t() | Phoenix.Socket.t(), String.t) :: {:error, } | {:ok, String.t}
  def verify(conn, token, ttl_ms) do
    Phoenix.Token.verify(conn, @salt, token, max_age: ttl_ms * 1000)
  end
end
