ExUnit.start()

defmodule PotionxTest.Repo do
  use Ecto.Repo,
    otp_app: :potionx,
    adapter: Ecto.Adapters.Postgres
end

alias PotionxTest.Repo
# This cleans up the test database and loads the schema
Mix.Task.run("ecto.create", ["--quiet"])
Mix.Task.run("ecto.migrate", ["--quiet"])

{:ok, _} = Ecto.Adapters.Postgres.ensure_all_started(Repo, :temporary)


# Start a process ONLY for our test run.
{:ok, _pid} = Repo.start_link()
Ecto.Adapters.SQL.Sandbox.mode(Repo, :manual)
