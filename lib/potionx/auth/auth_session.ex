defmodule Potionx.Auth.Session do
  def changeset(struct, params) do
    struct
    |> cast(params, [:data, :deleted_at, :expires_at, :ip, :ttl])
    |> validate_required([:expires_at, :ip, :ttl])
  end
end