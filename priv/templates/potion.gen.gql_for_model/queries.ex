defmodule <%= module_name_graphql %>.Schema.<%= model_name %>Queries do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  object :<%= model_name_snakecase %>_queries do
    connection field :<%= model_name_snakecase %>_collection, node_type: :<%= model_name_snakecase %> do
      arg :filters, :<%= model_name_snakecase %>_filters
      arg :order, type: :sort_order, default_value: :asc
      middleware Potionx.Middleware.RolesAuthorization, [roles: [:admin]]
      resolve &<%= module_name_graphql %>.Resolver.<%= model_name %>.collection/2
    end

    field :<%= model_name_snakecase %>_single, type: :<%= model_name_snakecase %> do
      arg :filters, :<%= model_name_snakecase %>_filters_single
      middleware Potionx.Middleware.RolesAuthorization, [roles: [:admin]]
      resolve &<%= module_name_graphql %>.Resolver.<%= model_name %>.one/2
    end
  end
end
