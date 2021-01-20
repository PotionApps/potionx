defmodule Potionx.Users.User do
  defmacro __using__(_) do
    quote do
      def pow_user_id_field, do: :email
      def user_identity_changeset(user_or_changeset, user_identity, attrs, user_id_attrs) do
        attrs = Potionx.Users.User.pow_attrs_to_changes(attrs)
        user_or_changeset
        |> Ecto.Changeset.cast(attrs, [:name, :surname])
        |> PowAssent.Ecto.Schema.changeset(user_identity, attrs, user_id_attrs, nil)
      end
    end
  end

  def pow_attrs_to_changes(attrs) do
    [
      {"family_name", :surname},
      {"given_name", :name},
      {"locale", :locale},
      {"name", :name}
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
end
