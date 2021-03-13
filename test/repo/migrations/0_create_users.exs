defmodule PotionxTest.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string, null: false
      add :deleted_at, :utc_datetime
      add :name_first, :string
      add :name_last, :string
      add :roles, {:array, :string}
      timestamps()
    end
    create unique_index(:users, [:email])
  end
end
