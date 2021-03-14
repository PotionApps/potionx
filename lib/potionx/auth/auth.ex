defmodule Potionx.Auth do
  use TypedStruct

  def cookie_options(%Plug.Conn{} = conn, config, max_age) do
    [
      http_only: true,
      domain: conn.host,
      max_age: max_age,
      secure: conn.scheme === :https,
      same_site: "strict"
    ] ++ (config || [])
  end

  def delete_cookie(conn, %{name: name, ttl_seconds: ttl_seconds}) do
    conn
    |> Plug.Conn.delete_resp_cookie(
      name,
      Potionx.Auth.cookie_options(
        conn, 
        [sign: true],
        ttl_seconds
      )
    )
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
          ttl_key: :ttl_access_seconds,
          ttl_seconds: 60 * 30, # 30 minutes,
          uuid_key: :uuid_access
        },
        frontend: %{
          name: "frontend",
          ttl_key: nil,
          ttl_seconds: 60 * 30, # 30 minutes
          uuid_key: nil
        },
        renewal_token: %{
          name: "r_app",
          ttl_key: :ttl_renewal_seconds,
          ttl_seconds: 60 * 60 * 24 * 30, # 30 days
          uuid_key: :uuid_renewal
        },
        sign_in_token: %{
          name: "a_app",
          ttl_key: :ttl_access_seconds,
          ttl_seconds: 60 * 5, # 5 minutes
          uuid_key: :uuid_access
        }
      },
      Keyword.get(config, :token_config, %{})
    )
  end
end
