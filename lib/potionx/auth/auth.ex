defmodule Potionx.Auth do
  use TypedStruct

  def cookie_options(%Plug.Conn{} = conn, config, max_age) do
    Keyword.merge(
      [
        http_only: true,
        max_age: max_age,
        secure: true
      ],
      (config || [])
    )
    |> then(fn config ->
      if conn.host === "localhost" do
        Keyword.put(config, :domain, conn.host)
      else
        config
      end
    end)
  end

  def delete_cookie(conn, %{name: name, ttl_seconds: ttl_seconds}) do
    conn
    |> Plug.Conn.delete_resp_cookie(
      name,
      cookie_options(
        conn,
        [sign: true],
        ttl_seconds
      )
    )
  end

  @doc """
  Handles setting sign up cookies used only during social login and general setting cookies.
  """
  @spec handle_user_session_cookies(struct(), Plug.Conn.t()) :: any
  def handle_user_session_cookies(%{uuid_renewal: nil, uuid_access: uuid_access} = session, conn) when not is_nil(uuid_access) do
    conn
    |> Potionx.Auth.set_cookie(%{
      name: Potionx.Auth.token_config().access_token.name,
      same_site: "none",
      token: uuid_access,
      ttl_seconds: session.ttl_access_seconds
    })
  end
  def handle_user_session_cookies(%{uuid_renewal: renewal} = session, conn) when not is_nil(renewal) do
    conn
    |> Potionx.Auth.set_cookie(%{
      http_only: false,
      name: Potionx.Auth.token_config().frontend.name,
      token: "1",
      ttl_seconds: session.ttl_access_seconds
    })
    |> Potionx.Auth.set_cookie(%{
      name: Potionx.Auth.token_config().access_token.name,
      token: session.uuid_access,
      ttl_seconds: session.ttl_access_seconds
    })
    |> Potionx.Auth.set_cookie(%{
      name: Potionx.Auth.token_config().renewal_token.name,
      token: session.uuid_renewal,
      ttl_seconds: session.ttl_renewal_seconds
    })
  end
  def handle_user_session_cookies(err, _conn), do: err

  def set_cookie(conn, %{name: name, token: token, ttl_seconds: ttl_seconds} = config) do
    conn
    |> Plug.Conn.put_resp_cookie(
      name,
      token,
      cookie_options(
        conn,
        [
          http_only:  Map.get(config, :http_only, true),
          same_site: Map.get(config, :same_site) || "strict",
          sign: true
        ],
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
