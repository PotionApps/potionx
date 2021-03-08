defmodule <%= appModule %>.Users.User do
  import Ecto.Changeset
  use Ecto.Schema
  use Potionx.Users.User

  schema "users" do
    field :deleted_at, :utc_datetime
    field :email, :string
    field :name_first, :string
    field :name_last, :string
    field :roles, {:array, Ecto.Enum}, values: [:admin, :guest]

    has_many :user_identities, <%= appModule %>.UserIdentities.UserIdentity
    timestamps()
  end

  def changeset(user_or_changeset, attrs) do
    user_or_changeset
    |> cast(attrs, [:name_first, :name_last, :roles])
    |> Pow.Ecto.Schema.Changeset.user_id_field_changeset(attrs, [])
    |> validate_subset(
      :roles,
      Ecto.Enum.values(__MODULE__, :roles)
    )
  end
end
