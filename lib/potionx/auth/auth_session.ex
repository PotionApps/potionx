defmodule Potionx.Auth.Session do
  import Ecto.Changeset

  def changeset(struct, params) do
    struct
    |> cast(
      params, [
        :data,
        :deleted_at,
        :expires_at,
        :ip,
        :ttl,
        :uuid_access,
        :uuid_renewal
      ]
    )
    |> validate_required([
      :expires_at,
      :ip,
      :ttl,
      :uuid_access
    ])
  end
end
