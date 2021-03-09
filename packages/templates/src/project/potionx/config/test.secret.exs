import Config

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :<%= appName %>, <%= appModule %>.Repo,
  username: "<%= localDbUser %>",
  password: "<%= localDbPassword %>",
  database: "<%= appName %>_test#{System.get_env("MIX_TEST_PARTITION")}",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox
