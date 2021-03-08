import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :<%= appName %>, <%= endpointModule %>,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

if System.get_env("DATABASE_URL") === nil do
  import_config "test.secret.exs"
end
