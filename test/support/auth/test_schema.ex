defmodule PotionxTest.Schema do
  use Potionx.Schema, [
    user_required_exceptions: [:session_renew, :sign_in_provider, :changeset_middleware]
  ]

  import_types Potionx.Types

  object :tx_mutation_result do
    field :errors, list_of(:string)
    field :errors_fields, list_of(:error)
  end

  query do
  end

  mutation do
    field :changeset_middleware, type: :tx_mutation_result do
      resolve fn _, _, _ ->
        {
          :error,
          Ecto.Changeset.cast(%PotionxTest.User{}, %{}, [])
          |> Ecto.Changeset.validate_required([:name_first, :email])
        }
      end
    end
    import_fields :auth_mutations
  end
  import_types PotionxTest.Mutations
end
