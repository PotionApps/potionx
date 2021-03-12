import Config

config :potionx,
  ecto_repos: [PotionxTest.Repo]

config :potionx, PotionxTest.Repo,
  priv: "packages/templates/src/project/potionx/priv/repo"

if System.get_env("DATABASE_URL") === nil do
  import_config "test.secret.exs"
end
