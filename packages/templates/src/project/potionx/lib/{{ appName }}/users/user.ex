defmodule <%= appModule %>.Users.User do
  import Ecto.Changeset
  use Ecto.Schema
  alias __MODULE__

  schema "users" do
    field :deleted_at, :utc_datetime
    field :email, :string
    field :name_first, :string
    field :name_last, :string
    field :roles, {:array, Ecto.Enum}, values: [:admin, :guest]

    has_many :user_identities, <%= appModule %>.UserIdentities.UserIdentity
    timestamps()
  end

  defimpl Jason.Encoder, for: User do
    def encode(s, opts) do
      s
      |> Map.from_struct()
      |> Map.drop([:__meta__, :user_identities])
      |> Jason.Encode.map(opts)
    end
  end

  def assent_attrs_to_changes(attrs) do
    [
      {"family_name", :name_last},
      {"given_name", :name_first},
      {"locale", :locale},
      {"name", :name_first}
    ]
    |> Enum.reduce(attrs, fn {key_from, key_to}, acc ->
      if Map.has_key?(acc, key_from) do
        Map.put(
          acc,
          to_string(key_to),
          Map.get(acc, key_from)
        )
      else
        acc
      end
    end)
  end

  def changeset(user_or_changeset, attrs) do
    attrs = assent_attrs_to_changes(attrs)
    user_or_changeset
    |> cast(attrs, [
      :email,
      :name_first,
      :name_last,
      :roles
    ])
    |> validate_subset(
      :roles,
      Ecto.Enum.values(__MODULE__, :roles)
    )
    |> validate_required([:email])
  end

  def title(entry) do
    [entry.name_first, entry.name_last]
    |> Enum.filter(fn e -> e end)
    |> Enum.join(" ")
  end
end
