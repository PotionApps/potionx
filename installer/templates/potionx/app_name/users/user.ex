defmodule <%= @app_module %>.Users.User do
  import Ecto.Changeset
  use Ecto.Schema
  use Pow.Ecto.Schema
  use PowAssent.Ecto.Schema
  use Potionx.Users.User

  schema "users" do
    field :deleted_at, :utc_datetime
    field :email, :string
    field :name, :string
    field :surname, :string
    field :roles, {:array, Ecto.Enum}, values: [:admin, :guest]

    has_many :user_identities, <%= @app_module %>.UserIdentities.UserIdentity
    timestamps()
  end

  def changeset(user_or_changeset, attrs) do
    user_or_changeset
    |> cast(attrs, [:name, :surname, :roles])
    |> Pow.Ecto.Schema.Changeset.user_id_field_changeset(attrs, [])
    |> validate_subset(
      :roles,
      Ecto.Enum.values(__MODULE__, :roles)
    )
  end
end
