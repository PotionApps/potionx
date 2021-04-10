defmodule <%= appModule %>GraphQl.Schema.UserIdentityTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  node object :user_identity do
    field :inserted_at, :naive_datetime
    field :provider, :string
    field :uid, :string
    field :updated_at, :naive_datetime
    field :user_id, :id
  end
  connection node_type: :user_identity do
    field :count, non_null(:integer)
    field :count_before, non_null(:integer)
    edge do
    end
  end
  input_object :user_identity_filters do
    field :inserted_at, :naive_datetime
    field :provider, :string
    field :uid, :string
    field :updated_at, :naive_datetime
    field :user_id, :id
  end
  input_object :user_identity_input do
    field :inserted_at, :naive_datetime
    field :provider, :string
    field :uid, :string
    field :updated_at, :naive_datetime
    field :user_id, :id
  end
  input_object :user_identity_filters_single do
    field :id, non_null(:global_id)
  end
  object :user_identity_mutation_result do
    field :errors, list_of(:string)
    field :errors_fields, list_of(:error)
    field :node, :user_identity
    field :success_msg, :string
  end
end