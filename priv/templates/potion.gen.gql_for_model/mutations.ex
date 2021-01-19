defmodule <%= module_name_graphql %>.Schema.<%= model_name %>Mutations do
  use Absinthe.Schema.Notation
  alias <%= module_name_graphql %>.Resolver

  object :<%= model_name_snakecase %>_mutations do
    field :<%= model_name_snakecase %>_delete, type: :<%= model_name_snakecase %>_mutation_result do
      arg :filters, :<%= model_name_snakecase %>_filters
      resolve &Resolver.<%= model_name %>.delete/2
    end

    field :<%= model_name_snakecase %>_mutation, type: :<%= model_name_snakecase %>_mutation_result do
      arg :changes, :<%= model_name_snakecase %>_input
      arg :filters, :<%= model_name_snakecase %>_filters_single
      resolve &Resolver.<%= model_name %>.mutation/2
    end
  end
end
