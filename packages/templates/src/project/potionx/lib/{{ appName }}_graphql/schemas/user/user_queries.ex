defmodule <%= appModule %>GraphQl.Schema.UserQueries do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  object :user_queries do
    connection field :user_collection, node_type: :user do
      arg :filters, :user_filters
      arg :order, type: :sort_order, default_value: :asc
      arg :search, :string
      middleware Potionx.Middleware.RolesAuthorization, [roles: [:admin]]
      resolve &<%= appModule %>GraphQl.Resolver.User.collection/2
    end

    field :user_single, type: :user do
      arg :filters, :user_filters_single
      middleware Potionx.Middleware.RolesAuthorization, [roles: [:admin]]
      resolve &<%= appModule %>GraphQl.Resolver.User.one/2
    end

    field :me, type: :user do
      resolve &<%= appModule %>GraphQl.Resolver.User.me/2
    end
  end
end
