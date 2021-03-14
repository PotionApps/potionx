defmodule Potionx.Auth.Identity do
  import Ecto.Changeset

  def changeset(struct, params) do
    struct
    |> cast(
      params, [
        :provider,
        :uid,
        :user_id,
      ]
    )
    |> assoc_constraint(:user)
    |> validate_required([
      :provider,
      :uid,
      :user_id
    ])
  end
end
