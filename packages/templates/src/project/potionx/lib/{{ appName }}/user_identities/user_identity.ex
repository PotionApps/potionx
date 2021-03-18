defmodule <%= appModule %>.UserIdentities.UserIdentity do
  use Ecto.Schema
  schema "user_identities" do
    field :provider, :string
    field :uid, :string
    belongs_to :user, <%= appModule %>.Users.User

    timestamps()
  end

  def changeset(struct, params) do
    Potionx.Auth.Identity.changeset(struct, params)
  end
end
