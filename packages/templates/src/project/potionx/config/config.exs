# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :<%= appName %>, env: config_env()

config :<%= appName %>,
  ecto_repos: [<%= appModule %>.Repo]

# Configures the endpoint
config :<%= appName %>, <%= endpointModule %>,
  url: [host: "localhost"],
  secret_key_base: "<%= secretKeyBase %>",
  render_errors: [view: <%= webNamespace %>.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: <%= appModule %>.PubSub,
  live_view: [signing_salt: "<%= lvSigningSalt %>"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason


# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
