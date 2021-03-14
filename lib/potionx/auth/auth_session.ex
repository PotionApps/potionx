defmodule Potionx.Auth.Session do
  import Ecto.Changeset

  def changeset(struct, params) do
    struct
    |> cast(
      params, [
        :data,
        :deleted_at,
        :ip,
        :sign_in_provider,
        :ttl_access_seconds,
        :ttl_renewal_seconds,
        :user_id,
        :uuid_access,
        :uuid_renewal
      ]
    )
    |> assoc_constraint(:user)
    |> validate_required([
      :ttl_access_seconds,
      :uuid_access
    ])
  end
end
