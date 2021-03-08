defmodule <%= appModule %>GraphQl.Schema.UserMutations do
  use Absinthe.Schema.Notation
  alias <%= appModule %>GraphQl.Resolver

  object :user_mutations do
    field :user_delete, type: :user_mutation_result do
      arg :filters, :user_filters_single
      middleware Potionx.Middleware.RolesAuthorization, [roles: [:admin]]
      resolve &Resolver.User.delete/2
    end

    field :user_mutation, type: :user_mutation_result do
      arg :changes, :user_input
      arg :filters, :user_filters_single
      middleware Potionx.Middleware.RolesAuthorization, [roles: [:admin]]
      resolve &Resolver.User.mutation/2
    end
  end
end