defmodule Potionx.Auth.Assent do
  @assent Application.get_env(:potionx, :assent)
  alias Potionx.Context.Service

  # renewal
  # test expiry
  # test redis
  # test multi provider?

  @spec before_send(Plug.Conn.t(), Absinthe.Blueprint.t()) :: any
  def before_send(
    conn,
    %Absinthe.Blueprint{
      execution: %{
        context: %{
          assigns: %{
            tokens_to_cookies: true
          },
          session: s
        }
      }
    }
  ) when not is_nil(s) do
    conn
    |> Potionx.Auth.set_cookie(%{
      name: Potionx.Auth.token_config().sign_in_token.name,
      token: s.uuid_access,
      ttl_seconds: s.ttl_access_seconds
    })
  end
  def before_send(conn, bp) do
    conn
  end

  def callback(conn, opts) do
    session_service = Keyword.fetch!(opts, :session_service)
    cookie_name = Potionx.Auth.token_config().sign_in_token.name
    conn
    |> Plug.Conn.fetch_cookies(
      signed: Enum.map(Map.values(Potionx.Auth.token_config()), &(&1.name))
    )
    |> fetch_session_from_conn(cookie_name, session_service)
    |> process_callback(conn, opts)
    |> create_user_session(session, session_service)
    # |> handle_user_session_cookies(conn)
    |> case do
      {:ok, conn} ->
        conn   
        |> Plug.Conn.send_resp(200, "hello")
      _ ->
        conn
        |> Plug.Conn.put_status(401)
        |> Plug.Conn.halt
    end
  end

  def create_user_session({:ok, user_identity_params, user_params}, %{id: _} = previous_session, session_service) do
    # create user
    session_service.mutation(
      %Service{
        changes: %{
          identity: user_identity_params,
          session: %{
            sign_in_provider: previous_session.provider,
            ttl_access_seconds: Potionx.Auth.token_config().access_token.ttl_seconds,
            uuid_access: Ecto.UUID.generate(),
            uuid_renewal: Ecto.UUID.generate(),
            ttl_renewal_seconds: Potionx.Auth.token_config().renewal_token.ttl_seconds
          },
          user: user_params
        }
      }
    )
  end
  def create_user_session(err, _, _), do: err

  def fetch_session_from_conn(conn, cookie_name, session_service) do
    conn
    |> case do
      %{req_cookies: %{^cookie_name => token}} ->
        session_service.one(
          %Service{
            filters: %{
              uuid_access: token
            }
          }
        )
      _ ->
        {:error, "no_cookie"}
    end
  end
  
  defp handle_user_identity_params({user_identity_params, user_params}, other_params, provider) do
    user_identity_params = Map.put(user_identity_params, "provider", provider)
    other_params         = for {key, value} <- other_params, into: %{}, do: {Atom.to_string(key), value}

    user_identity_params =
      user_identity_params
      |> Map.put("provider", provider)
      |> Map.merge(other_params)

    {:ok, user_identity_params, user_params}
  end

  def handle_user_session_cookies(%{id: _} = session, conn) do
    conn
    |> Potionx.Auth.Session.set_cookie(%{
      name: Potionx.Auth.token_config().access_token.name,
      token: session.uuid_access,
      ttl: session.ttl_access_seconds
    })
    |> Potionx.Auth.Session.set_cookie(%{
      name: Potionx.Auth.token_config().renewal_token.name,
      token: session.uuid_renewal,
      ttl: session.ttl_renewal_seconds
    })
  end

  def middleware_sign_in(%{context: ctx, value: value} = res, _) when is_map(value) do
    %{
      res |
        context: %{
          ctx |
            assigns: %{tokens_to_cookies: true},
            session: Map.get(value, :session)
        },
        value: Map.delete(value, :session)
    }
  end
  def middleware(res, _), do: res

  defp normalize_username(%{"preferred_username" => username} = params) do
    params
    |> Map.delete("preferred_username")
    |> Map.put("username", username)
  end
  defp normalize_username(params), do: params

  defp parse_callback_response({:ok, %{user: user} = response}, provider) do
    other_params =
      response
      |> Map.delete(:user)
      |> Map.put(:userinfo, user)

    user
    |> normalize_username()
    |> split_user_identity_params()
    |> handle_user_identity_params(other_params, provider)
  end
  defp parse_callback_response({:error, error}, _provider), do: {:error, error}

  def process_callback(session, conn), do: process_callback(session, conn, [])
  def process_callback(%{data: data}, %{path_params: %{"provider" => provider}}, opts) do
    strategies = Keyword.get(opts, :strategies) || @assent[:strategies]
    strategy_config = Keyword.fetch!(strategies, String.to_existing_atom(provider))

    Keyword.fetch!(strategy_config, :strategy).callback(
      strategy_config,
      data
    )
    |> parse_callback_response(provider)
  end
  def process_callback(err, _conn, _opts) do
    err
  end

  def renew do
    # get renewal
    # delete access and renewal
    # generate new access and new renewal
  end

  def resolve_sign_in(opts \\ []) do
    session_service = Keyword.get(opts, :session_service)
    if !session_service do
      raise "Potionx.Auth.Assent resolve function requires a session_service"
    end

    fn _parent, %{provider: provider}, %{context: %Service{redirect_uri: redirect_uri}} ->
      redirect_uri = redirect_uri || Keyword.fetch!(@assent || [], :redirect_uri)
      strategies = Keyword.get(opts, :strategies) || @assent[:strategies]

      strategies
      |> Keyword.fetch(String.to_existing_atom(provider))
      |> case do
        {:ok, config} ->
          strategy = Keyword.fetch!(config, :strategy)
          config
          |> Keyword.delete(:strategy)
          |> Keyword.put(:redirect_uri, redirect_uri)
          |> strategy.authorize_url()
          |> case do
            {:ok, %{session_params: params, url: url}} ->
              session_service.mutation(
                %Service{
                  changes: %{
                    data: params,
                    sign_in_provider: provider,
                    ttl_access_seconds: Potionx.Auth.token_config().sign_in_token.ttl_seconds,
                    uuid_access: Ecto.UUID.generate()
                  }
                }
              )
              |> case do
                {:ok, %{session: session}} ->
                  {:ok, %{session: session, url: url}}
                err -> err
              end
            err -> err
          end
        _ ->
          {:ok, %{error: "Missing Provider"}}
      end
    end
  end

  defp split_user_identity_params(%{"sub" => uid} = params) do
    user_params = Map.delete(params, "sub")

    {%{"uid" => uid}, user_params}
  end
end
