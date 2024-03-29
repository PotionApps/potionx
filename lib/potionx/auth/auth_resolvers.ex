defmodule Potionx.Auth.Resolvers do
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
          },
          session: session
        }
      }
    }
  ) when not is_nil(session) do
    Potionx.Auth.handle_user_session_cookies(session, conn)
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
    |> Potionx.Auth.delete_cookie(%{
      name: Potionx.Auth.token_config().frontend.name,
      ttl_seconds: session.ttl_access_seconds
    })
  end
  def before_send(conn, _) do
    conn
  end

  def call(conn, opts) do
    callback(conn, opts)
  end

  def callback(%{assigns: %{context: %Service{session: %{id: _} = session} = ctx}} = conn, opts) do
    after_login_path = Keyword.get(opts, :after_login_path) || "/"
    redirect_path = Keyword.get(opts, :redirect_path) || "/login"
    scheme = Keyword.get(opts, :scheme) || "https"
    session_service = Keyword.fetch!(opts, :session_service)
    redirect_url = get_redirect_url(conn, Map.get(session.data, "redirect_url") || after_login_path, scheme)

    conn
    |> verify_providers_match(session)
    |> process_callback(conn, opts)
    |> parse_callback_response(session.sign_in_provider)
    |> create_user_session(session, session_service, %{ctx | changes: Map.put(ctx.changes, :redirect_url, redirect_url)})
    |> Potionx.Auth.handle_user_session_cookies(conn)
    |> case do
      %Plug.Conn{} = conn ->
        conn
        |> Plug.Conn.put_resp_content_type("text/html")
        |> Plug.Conn.send_resp(
          200,
          """
          <html>
            <head><meta http-equiv="refresh" content="0;URL='#{redirect_url}'"/></head>
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
        url = Enum.join([redirect_path, "?msg=", msg], "")
        conn
        |> Plug.Conn.put_resp_content_type("text/html")
        |> Plug.Conn.assign(:potionx_auth_error, msg)
        |> Plug.Conn.send_resp(
          401,
          """
          <html>
            <head><meta http-equiv="refresh" content="0;URL='#{url}'"/></head>
            <body></body>
          </html>
          """
        )
      res -> res
    end
  end
  def callback(conn, opts) do
    redirect_path = Keyword.get(opts, :redirect_path, "/login")
    url = Enum.join([redirect_path, "?msg=missing_session"], "")
    conn
    |> Plug.Conn.assign(:potionx_auth_error, "missing_session")
    |> Plug.Conn.send_resp(
      401,
      """
      <html>
        <head><meta http-equiv="refresh" content="1;URL='#{url}'"/></head>
        <body></body>
      </html>
      """
    )
  end

  def create_user_session(
    {:ok, user_identity_params, user_params},
    previous_session,
    session_service,
    %Service{changes: %{redirect_url: redirect_url}, ip: ip}
  ) do
    session_service.create(
      %Service{
        changes: %{
          identity: %{user_identity_params | "uid" => to_string(user_identity_params["uid"])},
          session: %{
            ip: ip,
            sign_in_provider: previous_session.sign_in_provider,
            ttl_access_seconds: Potionx.Auth.token_config().access_token.ttl_seconds,
            uuid_access: Ecto.UUID.generate(),
            uuid_renewal: Ecto.UUID.generate(),
            ttl_renewal_seconds: Potionx.Auth.token_config().renewal_token.ttl_seconds
          },
          user: %{
            email: user_params["email"],
            email_verified: user_params["email_verified"],
            file_url: user_params["picture"],
            name_first: user_params["given_name"],
            name_last: user_params["family_name"],
            locale: user_params["locale"],
            name: user_params["name"],
            redirect_url: redirect_url
          }
        }
      },
      previous_session
    )
    |> case do
      {:ok, %{session: session}} -> session
      err -> err
    end
  end
  def create_user_session(err, _, _, _), do: err

  @doc """
  Prepare redirect_url, ensure redirect can only lead back to log in domain
  """
  def get_redirect_url(conn, redirect_url, scheme) do
    redirect_uri = URI.parse(redirect_url)
    URI.parse(Plug.Conn.request_url(conn))
    |> Map.put(:query, redirect_uri.query)
    |> Map.put(:path, redirect_uri.path)
    |> Map.put(:port, scheme === "https" && 443 || conn.port)
    |> Map.put(:scheme, scheme)
    |> to_string
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

  def init(opts), do: opts

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
            assigns: %{tokens_to_cookies: true},
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
      |> case do
        %{host: "localhost"} = url -> url
        url -> %{url | port: 443, scheme: "https"}
      end

    Keyword.fetch!(strategy_config, :strategy).callback(
      Keyword.put(
        strategy_config,
        :session_params,
        data
      )
      |> Keyword.put(
        :http_adapter,
        Assent.HTTPAdapter.Mint
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
      raise "Potionx.Auth.Resolvers requires a session_service"
    end

    fn
      _parent, _, %{context: %Service{session: %{id: id}}} ->
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
      _parent, _, _ ->
        {:ok, %{error: "missing_session"}}
    end
  end

  def resolve_sign_in(opts \\ []) do
    session_service = Keyword.get(opts, :session_service)
    if !session_service do
      raise "Potionx.Auth.Resolvers requires a session_service"
    end

    fn _parent, %{provider: provider} = args, %{context: %Service{request_url: url} = ctx} ->
      strategies = Keyword.get(opts, :strategies) || auth_config()[:strategies]

      redirect_uri =
        URI.parse(url)
        |> Map.replace!(:path, "/api/v1/auth/#{provider}/callback")
        |> Map.replace!(:fragment, nil)
        |> Map.replace!(:query, nil)
        |> case do
          %{host: "localhost"} = url -> url
          url -> %{url | port: 443, scheme: "https"}
        end

      strategies
      |> Keyword.fetch(String.to_existing_atom(provider))
      |> case do
        {:ok, config} ->
          strategy = Keyword.fetch!(config, :strategy)
          config
          |> Keyword.delete(:strategy)
          |> Keyword.put(:redirect_uri, redirect_uri)
          |> Keyword.put(
            :http_adapter,
            Assent.HTTPAdapter.Mint
          )
          |> strategy.authorize_url()
          |> case do
            {:ok, %{session_params: params, url: url}} ->
              session_service.create(
                %Service{
                  changes: %{
                    data: Map.merge(args, params),
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
