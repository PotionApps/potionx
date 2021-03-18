defmodule <%= appModule %>.Repo.Migrations.CreateSession do
  use Ecto.Migration

  def change do
    create table(:sessions) do
      add :data, :map
      add :deleted_at, :utc_datetime
      add :expires_at, :utc_datetime
      add :ip, :inet
      add :sign_in_provider, :string
      add :ttl_access_seconds, :integer
      add :ttl_renewal_seconds, :integer
      add :uuid_access, :uuid
      add :uuid_renewal, :uuid
      add :user_id, references("users")

      timestamps()
    end
    create unique_index(:sessions, [:uuid_access])
    create unique_index(:sessions, [:uuid_renewal])
  end
end
