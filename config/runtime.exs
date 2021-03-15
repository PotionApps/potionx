import Config

if config_env() == :test and System.get_env("DATABASE_URL") !== nil do
  config :potionx, PotionxTest.Repo,
    pool: Ecto.Adapters.SQL.Sandbox,
    url: System.get_env("DATABASE_URL")
end