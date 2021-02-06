defmodule Potionx.Plug.ApiAuth do
  @moduledoc false
  use Pow.Plug.Base

  alias Plug.Conn
  alias Pow.{Config, Plug, Store.CredentialsCache}
  alias PowPersistentSession.Store.PersistentSessionCache

  @doc """
  Creates an access and renewal token for the user.

  The tokens are added to the `conn.private` as `:api_access_token` and
  `:api_renewal_token`. The renewal token is stored in the access token
  metadata and vice versa.
  """
  @impl true
  @spec create(Conn.t(), map(), Config.t()) :: {Conn.t(), map()}
  def create(conn, user, config) do
    store_config  = store_config(config)
    access_token  = Pow.UUID.generate()
    fingerprint   = conn.private[:pow_api_session_fingerprint] || Po
    renewal_token = Pow.UUID.generate()
    expiry =
      DateTime.utc_now()
      |> DateTime.add(60 * 30, :second) # 30 minutes
      |> DateTime.to_unix
    conn =
      conn
      |> Conn.put_private(:api_access_token, sign_token(conn, access_token, config))
      |> Conn.put_private(:api_renewal_token, sign_token(conn, renewal_token, config))
      |> Conn.put_private(:api_access_expiry, expiry)

    # The store caches will use their default `:ttl` settting which is 30minutes for access and 30 days for renewal. To change the
    # `:ttl`, `Keyword.put(store_config, :ttl, :timer.minutes(10))` can be
    # passed in as the first argument instead of `store_config`.
    CredentialsCache.put(store_config, access_token, {user, [renewal_token: renewal_token, expiry: expiry, fingerprint: fingerprint]})
    PersistentSessionCache.put(store_config, renewal_token, {user, [access_token: access_token, fingerprint: fingerprint]})

    {conn, user}
  end

  def cookie_names(config) do
    Map.merge(
      %{
        access_token: "a_app",
        frontend: "frontend",
        renewal_token: "r_app"
      },
      Keyword.get(config, :cookie_names, %{})
    )
  end

  def cookie_options(%Conn{} = conn, config, max_age \\ nil) do
    max_age = max_age || 30 * 60 # default to 30 minutes
    [
      http_only: true,
      domain: conn.host,
      max_age: max_age,
      secure: conn.scheme === :https,
      same_site: "strict"
    ] ++ (config[:cookie_options] || [])
  end

  @doc """
  Delete the access token from the cache.

  The renewal token is deleted by fetching it from the access token metadata.
  """
  @impl true
  @spec delete(Conn.t(), Config.t()) :: Conn.t()
  def delete(conn, config) do
    store_config = store_config(config)

    with {:ok, signed_token} <- fetch_token(conn, config),
          {:ok, token}        <- verify_token(conn, signed_token, config),
          {_user, metadata}   <- CredentialsCache.get(store_config, token) do

      PersistentSessionCache.delete(store_config, metadata[:renewal_token])
      CredentialsCache.delete(store_config, token)

      conn
      |> Conn.put_private(:session_fingerprint, metadata[:fingerprint])
    else
      _any -> conn
    end
  end

  @doc """
  Fetches the user from access token.
  """
  @impl true
  @spec fetch(Conn.t(), Config.t()) :: {Conn.t(), map() | nil}
  def fetch(conn, config) do
    with {:ok, signed_token} <- fetch_token(conn, config),
         {user, _metadata}   <- get_credentials(conn, signed_token, config) do
      {conn, user}
    else
      _any -> {conn, nil}
    end
  end

  defp fetch_token(conn, config, token_name \\ :access_token) do
    conn = Conn.fetch_cookies(conn)
    auth_headers = Conn.get_req_header(conn, "authorization")

    case auth_headers do
      ["Bearer " <> token] ->
        {:ok, token}
      _ ->
        Map.get(conn.cookies, cookie_names(config) |> Map.get(token_name))
        |> case do
          nil -> :error
          val -> {:ok, val}
        end
    end
  end

  def get_credentials(conn, signed_token, config) do
    with {:ok, token}     <- verify_token(conn, signed_token, config),
         {user, metadata} <- CredentialsCache.get(store_config(config), token) do
      {user, metadata}
    else
      _any -> nil
    end
  end

  def handle_cookies(
    conn,
    %{access_token: a_t, renewal_token: r_t},
    config
  ) do
    store_config = store_config(config)
    opts_access_token = CredentialsCache.backend_config(store_config)
    opts_renewal_token = PersistentSessionCache.backend_config(store_config)

    conn
    |> Conn.put_resp_cookie(
      cookie_names(config)[:access_token],
      a_t,
      cookie_options(conn, config, opts_access_token[:ttl])
    )
    |> Conn.put_resp_cookie(
      cookie_names(config)[:renewal_token],
      r_t,
      cookie_options(conn, config, opts_renewal_token[:ttl])
    )
    |> Conn.put_resp_cookie(
      cookie_names(config)[:frontend],
      "1",
      cookie_options(conn, config, opts_access_token[:ttl])
      |> Keyword.merge([http_only: false])
    )
  end

  @doc """
  Creates new tokens using the renewal token.

  The access token, if any, will be deleted by fetching it from the renewal
  token metadata. The renewal token will be deleted from the store after the
  it has been fetched.
  """
  @spec renew(Conn.t(), Config.t()) :: {Conn.t(), map() | nil}
  def renew(conn, config) do
    store_config = store_config(config)

    with {:ok, signed_token} <- fetch_token(conn, config, :renewal_token),
          {:ok, token}        <- verify_token(conn, signed_token, config),
          {user, metadata}    <- PersistentSessionCache.get(store_config, token) do

      CredentialsCache.delete(store_config, metadata[:access_token])
      PersistentSessionCache.delete(store_config, token)

      conn
      |> Conn.put_private(:pow_api_session_fingerprint, metadata[:fingerprint])
      |> create(user, config)
    else
      _any -> {conn, nil}
    end
  end

  defp sign_token(conn, token, config) do
    Plug.sign_token(conn, signing_salt(), token, config)
  end
  defp signing_salt(), do: Atom.to_string(__MODULE__)

  defp store_config(config) do
    backend = Config.get(config, :cache_store_backend, Pow.Store.Backend.EtsCache)

    [backend: backend, pow_config: config]
  end

  defp verify_token(conn, token, config),
    do: Plug.verify_token(conn, signing_salt(), token, config)
end
