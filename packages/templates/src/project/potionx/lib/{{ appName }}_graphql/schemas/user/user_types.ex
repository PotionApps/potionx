defmodule <%= appModule %>GraphQl.Schema.UserTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern
  import Absinthe.Resolution.Helpers

  node object :user do
    field :deleted_at, :datetime
    field :email, :string
    field :inserted_at, :naive_datetime
    field :name_first, :string
    field :name_last, :string
    field :roles, list_of(:string)
    field :updated_at, :naive_datetime
    field :user_identities, list_of(:user_identity), resolve: dataloader(<%= appModule %>GraphQl.Resolver.User)
    field :title, :string, resolve: Potionx.Resolvers.resolve_computed(<%= appModule %>.Users.User, :title)
  end
  connection node_type: :user do
    field :count, non_null(:integer)
    field :count_before, non_null(:integer)
    edge do
    end
  end
  input_object :user_filters do
    field :deleted_at, :datetime
    field :email, :string
    field :inserted_at, :naive_datetime
    field :name_first, :string
    field :name_last, :string
    field :roles, list_of(:string)
    field :updated_at, :naive_datetime
  end
  input_object :user_input do
    field :deleted_at, :datetime
    field :email, :string
    field :inserted_at, :naive_datetime
    field :name_first, :string
    field :name_last, :string
    field :roles, list_of(:string)
    field :updated_at, :naive_datetime
  end
  input_object :user_filters_single do
    field :id, non_null(:global_id)
  end
  object :user_mutation_result do
    field :errors, list_of(:string)
    field :errors_fields, list_of(:error)
    field :node, :user
    field :success_msg, :string
  end
end