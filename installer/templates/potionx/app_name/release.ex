defmodule <%= @app_module %>.Release do
  @app :<%= @app_name %>
  alias <%= @app_module %>.Repo
  alias <%= @app_module %>.Users.User

  def migrate do
    load_app()

    for repo <- repos() do
      {:ok, _, _} = Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :up, all: true))
    end
  end

  def rollback(repo, version) do
    load_app()
    {:ok, _, _} = Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :down, to: version))
  end

  defp repos do
    Application.fetch_env!(@app, :ecto_repos)
  end

  def seed do
    Repo.get_by(User, [email: <%= @email %>])
    |> case do
      nil ->
        Repo.insert! %User{
          email: <%= @email %>,
          roles: [:admin]
        }
      _ -> :ok
    end
  end

  defp load_app do
    Application.load(@app)
  end
end
