defmodule Potionx.Middleware.ServiceContext do
  @behaviour Absinthe.Middleware

  def call(%{arguments: args, context: %Potionx.Context.Service{} = ctx} = res, _) do
    %{
      res |
        context: %{
          ctx |
            changes: Map.get(args, :changes, ctx.changes),
            filters: Map.get(args, :filters, ctx.filters),
            pagination: %Potionx.Repo.Pagination{
              after: Map.get(args, :after),
              before: Map.get(args, :before),
              first: Map.get(args, :first),
              last: Map.get(args, :last)
            }
        }
    }
  end
  def call(resolution, _), do: resolution
end
