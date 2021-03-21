defmodule PotionxTest.User do
  @derive Jason.Encoder
  use Ecto.Schema
  alias __MODULE__
  @behavior Potionx.Auth.User

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

  def from_json(%{id: _} = user) do
    user
  end
  def from_json(%{"roles" => roles} = user) do
    params =
      Map.new(user, fn
        {k, v} ->
          {String.to_existing_atom(k), v}
      end)
      |> Map.put(:roles, Enum.map((roles || []), &(String.to_existing_atom(&1))))
    struct(User, params)
  end
end
