defmodule <%= appModule %>.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    execute "CREATE EXTENSION IF NOT EXISTS citext",  "DROP EXTENSION IF EXISTS citext"
    create table(:users) do
      add :email, :citext, null: false
      add :deleted_at, :utc_datetime
      add :name_first, :string
      add :name_last, :string
      add :roles, {:array, :string}
      timestamps()
    end
    create unique_index(:users, [:email])
  end
end
