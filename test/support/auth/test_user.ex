defmodule PotionxTest.User do
  import Ecto.Changeset
  use Ecto.Schema

  schema "users" do
    field :deleted_at, :utc_datetime
    field :email, :string
    field :name_first, :string
    field :name_last, :string
    field :roles, {:array, Ecto.Enum}, values: [:admin, :guest]

    timestamps()
  end
end
