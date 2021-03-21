defmodule Potionx.Auth.Assent do
  alias Potionx.Context.Service

  def auth_config() do
    Application.get_env(:potionx, :auth)
  end

  @spec before_send(Plug.Conn.t(), Absinthe.Blueprint.t()) :: any
  def before_send(
    conn,
    %Absinthe.Blueprint{
      execution: %{
        context: %{
          assigns: %{
            tokens_to_cookies: true
          } = assigns,
          session: session
        }
      }
    }
  ) when not is_nil(session) do
    [:access_token, :renewal_token]
    |> Enum.reduce(conn, fn key, acc ->
      config = Potionx.Auth.token_config()[key]
      if (Map.get(session, config.uuid_key)) do
        Potionx.Auth.set_cookie(acc, %{
          same_site: Map.get(assigns, :same_site, "strict"),
          name: config.name,
          token: Map.get(session, config.uuid_key),
          ttl_seconds: Map.get(session, config.ttl_key)
        })
      else
        acc
      end
    end)
  end
  def before_send(
    conn,
    %Absinthe.Blueprint{
      execution: %{
        context: %{
          assigns: %{
            sign_out: true
          },
          session: session
        }
      }
    }
  ) when not is_nil(session) do
    conn
    |> Potionx.Auth.delete_cookie(%{
      name: Potionx.Auth.token_config().access_token.name,
      ttl_seconds: session.ttl_access_seconds
    })
    |> Potionx.Auth.delete_cookie(%{
      name: Potionx.Auth.token_config().renewal_token.name,
      ttl_seconds: session.ttl_renewal_seconds
    })
  end
  def before_send(conn, _) do
    conn
  end

  def call(conn, opts) do
    callback(conn, opts)
  end

  def callback(%{assigns: %{context: %Service{session: %{id: _} = session}}} = conn, opts) do
    session_service = Keyword.fetch!(opts, :session_service)

    conn
    |> verify_providers_match(session)
    |> process_callback(conn, opts)
    |> parse_callback_response(session.sign_in_provider)
    |> create_user_session(session, session_service)
    |> handle_user_session_cookies(conn)
    |> case do
      %Plug.Conn{} = conn ->
        url =
          URI.parse(Plug.Conn.request_url(conn))
          |> Map.put(:query, nil)
          |> Map.put(:path, "/")
          |> to_string
        conn
        |> Plug.Conn.put_resp_content_type("text/html")
        |> Plug.Conn.send_resp(
          200,
          """
          <html>
            <head><meta http-equiv="refresh" content="0;URL='#{url}'"/></head>
            <body></body>
          </html>
          """
        )

      {:error, _, msg, _} ->
        {:error, msg}
      err -> err
    end
    |> case do
      {:error, msg} ->
        IO.inspect(msg, label: "SIGN IN ERROR")
        conn
        |> Plug.Conn.put_resp_content_type("text/html")
        |> Plug.Conn.put_status(401)
        |> Plug.Conn.assign(:potionx_auth_error, msg)
        |> Plug.Conn.send_resp("Callback error")
      res -> res
    end
  end
  def callback(conn, _) do
    IO.inspect("MISSING SESSION")
    conn
    |> Plug.Conn.put_status(401)
    |> Plug.Conn.assign(:potionx_auth_error, "missing_session")
    |> Plug.Conn.send_resp("Sign in error")
  end

  def create_user_session({:ok, user_identity_params, user_params}, previous_session, session_service) do
    session_service.create(
      %Service{
        changes: %{
          identity: %{user_identity_params | "uid" => to_string(user_identity_params["uid"])},
          session: %{
            sign_in_provider: previous_session.sign_in_provider,
            ttl_access_seconds: Potionx.Auth.token_config().access_token.ttl_seconds,
            uuid_access: Ecto.UUID.generate(),
            uuid_renewal: Ecto.UUID.generate(),
            ttl_renewal_seconds: Potionx.Auth.token_config().renewal_token.ttl_seconds
          },
          user: user_params
        }
      },
      previous_session
    )
  end
  def create_user_session(err, _, _), do: err

  def init(opts), do: opts

  defp handle_user_identity_params({user_identity_params, user_params}, other_params, provider) do
    user_identity_params = Map.put(user_identity_params, "provider", provider)
    other_params         = for {key, value} <- other_params, into: %{}, do: {Atom.to_string(key), value}

    user_identity_params =
      user_identity_params
      |> Map.put("provider", provider)
      |> Map.merge(other_params)

    {:ok, user_identity_params, user_params}
  end

  def handle_user_session_cookies({:ok, %{session: session}}, conn) do
    conn
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

  def middleware_renew(%{context: ctx, value: value} = res, _) when is_map(value) do
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
  def middleware_renew(res, _), do: res

  def middleware_sign_in(%{context: ctx, value: value} = res, _) when is_map(value) do
    %{
      res |
        context: %{
          ctx |
            assigns: %{tokens_to_cookies: true, same_site: "lax"},
            session: Map.get(value, :session)
        },
        value: Map.delete(value, :session)
    }
  end
  def middleware_sign_in(res, _), do: res

  def middleware_sign_out(%{context: ctx, value: value} = res, _) when is_map(value) do
    %{
      res |
        context: %{
          ctx |
            assigns: %{sign_out: true}
        }
    }
  end
  def middleware_sign_out(res, _), do: res

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
  def process_callback(%{data: data, sign_in_provider: provider}, conn, opts) do
    strategies = Keyword.get(opts, :strategies) || auth_config()[:strategies]
    strategy_config = Keyword.fetch!(strategies, String.to_existing_atom(provider))
    redirect_uri =
      URI.parse(Plug.Conn.request_url(conn))
      |> Map.replace!(:fragment, nil)
      |> Map.replace!(:query, nil)

    Keyword.fetch!(strategy_config, :strategy).callback(
      Keyword.put(
        strategy_config,
        :session_params,
        data
      )
      |> Keyword.put(
        :redirect_uri,
        redirect_uri
      ),
      conn.params
    )
  end
  def process_callback(err, _conn, _opts) do
    err
  end

  def resolve_renew(opts) do
    session_service = Keyword.get(opts, :session_service)
    if !session_service do
      raise "Potionx.Auth.Assent resolve function requires a session_service"
    end

    fn _parent, _, %{context: %Service{session: %{id: id}}} ->
      session_service.patch(
        %Service{
          changes: %{
            ttl_access_seconds: Potionx.Auth.token_config().access_token.ttl_seconds,
            uuid_access: Ecto.UUID.generate(),
            uuid_renewal: Ecto.UUID.generate(),
            ttl_renewal_seconds: Potionx.Auth.token_config().renewal_token.ttl_seconds
          },
          filters: %{
            id: id
          }
        }
      )
      |> case do
        {:ok, %{session_patch: session}} ->
          {:ok, %{session: session}}
        err -> err
       end
    end
  end

  def resolve_sign_in(opts \\ []) do
    session_service = Keyword.get(opts, :session_service)
    if !session_service do
      raise "Potionx.Auth.Assent resolve function requires a session_service"
    end

    fn _parent, %{provider: provider}, %{context: %Service{request_url: url} = ctx} ->
      strategies = Keyword.get(opts, :strategies) || auth_config()[:strategies]

      redirect_uri =
        URI.parse(url)
        |> Map.replace!(:path, "/api/v1/auth/#{provider}/callback")
        |> Map.replace!(:fragment, nil)
        |> Map.replace!(:query, nil)

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
              session_service.create(
                %Service{
                  changes: %{
                    data: params,
                    ip: ctx.ip,
                    sign_in_provider: provider,
                    ttl_access_seconds: Potionx.Auth.token_config().sign_in_token.ttl_seconds,
                    uuid_access: Ecto.UUID.generate()
                  }
                },
                nil
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
  def resolve_sign_out(opts \\ []) do
    session_service = Keyword.get(opts, :session_service)
    if !session_service do
      raise "Potionx.Auth.Assent resolve function requires a session_service"
    end

    fn
      _parent, _, %{context: %{session: nil}} ->
        {:ok, %{error: "not_signed_in"}}
      _parent, _, %{context: %{session: session}} ->
      session_service.delete(%Service{filters: %{id: session.id}})
      |> case do
        {:ok, _} -> {:ok, %{}}
        err -> err
      end
    end
  end

  defp split_user_identity_params(%{"sub" => uid} = params) do
    user_params = Map.delete(params, "sub")

    {%{"uid" => uid}, user_params}
  end

  def verify_providers_match(%{path_params: %{"provider" => provider2}}, %{sign_in_provider: provider} = session) do
    if provider === provider2 do
      session
    else
      {:error, "provider_mismatch"}
    end
  end
end
