import Config

config :potionx,
  ecto_repos: [PotionxTest.Repo]

config :potionx, PotionxTest.Repo,
  priv: "test/support/repo"

if System.get_env("DATABASE_URL") === nil do
  import_config "test.secret.exs"
end
