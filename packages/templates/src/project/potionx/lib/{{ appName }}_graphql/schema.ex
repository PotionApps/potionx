defmodule <%= appModule %>GraphQl.Schema do
  use Potionx.Schema

  node interface do
    resolve_type fn
      %<%= appModule %>.Users.User{}, _ ->
        :user
      %<%= appModule %>.UserIdentities.UserIdentity{}, _ ->
        :user_identity
      _, _ ->
        nil
    end
  end

  def context(ctx) do
    Map.put(ctx, :loader, dataloader())
  end

  def dataloader do
    Dataloader.new
    |> Dataloader.add_source(<%= appModule %>GraphQl.Resolver.User, <%= appModule %>GraphQl.Resolver.User.data())
  end

  query do
    import_fields :user_queries
  end

  mutation do
    import_fields :user_mutations
    import_fields :auth_mutations
  end

  import_types <%= appModule %>GraphQl.Schema.AuthMutations
  import_types <%= appModule %>GraphQl.Schema.UserIdentityTypes
  import_types <%= appModule %>GraphQl.Schema.UserMutations
  import_types <%= appModule %>GraphQl.Schema.UserQueries
  import_types <%= appModule %>GraphQl.Schema.UserTypes
end
