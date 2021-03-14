defmodule Potionx.Auth do
  use TypedStruct

  def cookie_options(%Plug.Conn{} = conn, config, max_age) do
    [
      http_only: true,
      domain: conn.host,
      max_age: max_age,
      secure: conn.scheme === :https,
      same_site: "strict"
    ] ++ (config[:cookie_options] || [])
  end

  @spec set_cookie(Plug.Conn.t(), %{id: String.t(), ttl_ms: integer}) :: Plug.Conn.t()
  def set_cookie(conn, %{name: name, token: token, ttl_seconds: ttl_seconds}) do
    conn
    |> Plug.Conn.put_resp_cookie(
      name,
      token,
      Potionx.Auth.cookie_options(
        conn, 
        [sign: true],
        ttl_seconds
      )
    )
  end

  def token_config(config \\ []) do
    Map.merge(
      %{
        access_token: %{
          name: "a_app",
          ttl_seconds: 60 * 30 # 30 minutes
        },
        frontend: %{
          name: "frontend",
          ttl_seconds: 60 * 30 # 30 minutes
        },
        renewal_token: %{
          name: "r_app",
          ttl_seconds: 60 * 60 * 24 * 30 # 30 days
        },
        sign_in_token: %{
          name: "a_app",
          ttl_seconds: 60 * 5 # 5 minutes
        }
      },
      Keyword.get(config, :token_config, %{})
    )
  end
end
