import Config

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

  host =
    System.get_env("HOST") ||
      System.get_env("RENDER_EXTERNAL_HOSTNAME") ||
      raise """
      environment variable URL is missing.
      """

 certfile =
    System.get_env("SSL_CERT_PATH") ||
      raise """
      environment variable SSL_CERT_PATH is missing.
      """

 keyfile =
    System.get_env("SSL_KEY_PATH") ||
      raise """
      environment variable SSL_KEY_PATH is missing.
      """

  config :<%= @app_name %>, <%= @endpoint_module %>,
    http: [
      :inet6,
      port: String.to_integer(System.get_env("PORT") || "80"),
    ],
    # https: [
    #   # Enable IPv6 and bind on all interfaces.
    #   # Set it to  {0, 0, 0, 0, 0, 0, 0, 1} for local network only access.
    #   ip: {0, 0, 0, 0, 0, 0, 0, 0},
    #   port: String.to_integer(System.get_env("PORT") || "443"),
    #   cipher_suite: :strong,
    #   otp_app: :<%= @app_name %>,
    #   keyfile: keyfile,
    #   certfile: certfile
    # ],
    url: [host: host],
    secret_key_base: secret_key_base

  # ## Using releases
  #
  # If you are doing OTP releases, you need to instruct Phoenix
  # to start each relevant endpoint:
  #

  config :<%= @web_app_name %>, <%= @endpoint_module %>, server: true
  #
  # Then you can assemble a release by calling `mix release`.
  # See `mix help release` for more information.
end
