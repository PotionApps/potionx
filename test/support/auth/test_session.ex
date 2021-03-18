defmodule PotionxTest.Session do
  @derive Jason.Encoder
  use Ecto.Schema
  alias __MODULE__

  schema "sessions" do
    field :data, :map
    field :deleted_at, :utc_datetime
    field :expires_at, :utc_datetime
    field :ip, EctoNetwork.INET
    field :sign_in_provider, :string
    field :ttl_access_seconds, :integer
    field :ttl_renewal_seconds, :integer
    field :uuid_access, Ecto.UUID
    field :uuid_renewal, Ecto.UUID
    belongs_to :user, PotionxTest.User

    timestamps()
  end

  defimpl Jason.Encoder, for: Session do
    def encode(s, opts) do
      s
      |> Map.from_struct()
      |> Map.drop([:__meta__])
      |> Map.put(:ip, to_string(s.ip))
      |> Jason.Encode.map(opts)
    end
  end

  def changeset(struct, params) do
    Potionx.Auth.Session.changeset(struct, params)
  end
end
