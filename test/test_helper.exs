ExUnit.start()

alias PotionxTest.Repo
# This cleans up the test database and loads the schema
Mix.Task.run("ecto.create", ["--quiet"])
Mix.Task.run("ecto.migrate", ["--quiet"])

{:ok, _} = Ecto.Adapters.Postgres.ensure_all_started(Repo, :temporary)

redis_url = System.get_env("REDIS_URL")
if (redis_url) do
  {:ok, _conn} = Redix.start_link(redis_url, name: :redix)
end

# Start a process ONLY for our test run.
{:ok, _pid} = Repo.start_link()
Ecto.Adapters.SQL.Sandbox.mode(Repo, :manual)
