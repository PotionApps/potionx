import Config

if config_env() == :test and System.get_env("DATABASE_URL") !== nil do
  config :<%= appName %>, <%= appModule %>.Repo,
    pool: Ecto.Adapters.SQL.Sandbox,
    url: System.get_env("DATABASE_URL")
end
# config/runtime.exs is executed for all environments, including
# during releases. It is executed after compilation and before the
# system starts, so it typically used load production configuration
# and secrets from environment variables or elsewhere. Do not define
# any compile-time configuration in here, as it won't be applied.
# The block below contains prod specific runtime configuration.
if config_env() == :prod do
  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise """
      environment variable SECRET_KEY_BASE is missing.
      You can generate one by calling: mix phx.gen.secret
      """

  config :potionx,
    auth: [
      strategies: [
        azure_ad: [
          client_id: System.get_env("ASSENT_AZURE_CLIENT_ID"),
          client_secret: System.get_env("ASSENT_AZURE_CLIENT_SECRET"),
          id_token_signed_response_alg: "RS256",
          strategy: Assent.Strategy.AzureAD,
          tenant_id: System.get_env("ASSENT_AZURE_TENANT_ID")
        ],
        google: [
          strategy: Assent.Strategy.Google,
          client_id: System.get_env("ASSENT_GOOGLE_CLIENT_ID"),
          client_secret: System.get_env("ASSENT_GOOGLE_CLIENT_SECRET"),
          authorization_params: [
            access_type: "offline",
            scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
          ]
        ]
      ]
    ]

  database_url =
    System.get_env("DATABASE_URL") ||
      raise """
      environment variable DATABASE_URL is missing.
      For example: ecto://USER:PASS@HOST/DATABASE
      """

  config :<%= appName %>, <%= appModule %>.Repo,
    url: database_url,
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")

  config :<%= appName %>, <%= endpointModule %>,
    http: [
      :inet6,
      port: String.to_integer(System.get_env("PORT") || "4000"),
    ],
    # https: [
    #   # Enable IPv6 and bind on all interfaces.
    #   # Set it to  {0, 0, 0, 0, 0, 0, 0, 1} for local network only access.
    #   ip: {0, 0, 0, 0, 0, 0, 0, 0},
    #   port: String.to_integer(System.get_env("PORT") || "443"),
    #   cipher_suite: :strong,
    #   otp_app: :<%= appName %>,
    #   keyfile: keyfile,
    #   certfile: certfile
    # ],
    secret_key_base: secret_key_base

  # ## Using releases
  #
  # If you are doing OTP releases, you need to instruct Phoenix
  # to start each relevant endpoint:
  #

  config :<%= webAppName %>, <%= endpointModule %>, server: true

  redis_url = System.get_env("REDIS_URL") ||
    raise """
    REDIS_URL environment variable is missing.
    """
  config :redix,
    url: redis_url

  #
  # Then you can assemble a release by calling `mix release`.
  # See `mix help release` for more information.
end
