defmodule PotionxTest.User do
  @derive Jason.Encoder
  use Ecto.Schema
  alias __MODULE__

  schema "users" do
    field :deleted_at, :utc_datetime
    field :email, :string
    field :name_first, :string
    field :name_last, :string
    field :roles, {:array, Ecto.Enum}, values: [:admin, :guest]

    timestamps()
  end

  defimpl Jason.Encoder, for: User do
    def encode(s, opts) do
      s
      |> Map.from_struct()
      |> Map.drop([:__meta__])
      |> Jason.Encode.map(opts)
    end
  end
end
