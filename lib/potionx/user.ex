defmodule Potionx.Users.User do
  defmacro __using__(_) do
    quote do
      def pow_user_id_field, do: :email
      def title(entry) do
        [entry.name_first, entry.name_last]
        |> Enum.filter(fn e -> e end)
        |> Enum.join(" ")
      end
      def user_identity_changeset(user_or_changeset, user_identity, attrs, user_id_attrs) do
        attrs = Potionx.Users.User.pow_attrs_to_changes(attrs)
        user_or_changeset
        |> Ecto.Changeset.cast(attrs, [:name_first, :name_last])
        |> PowAssent.Ecto.Schema.changeset(user_identity, attrs, user_id_attrs, nil)
      end
    end
  end

  def pow_attrs_to_changes(attrs) do
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
end
