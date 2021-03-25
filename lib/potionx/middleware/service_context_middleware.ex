defmodule Potionx.Middleware.ServiceContext do
  @behaviour Absinthe.Middleware

  def call(%{arguments: args, context: %Potionx.Context.Service{} = ctx} = res, _) do
    %{
      res |
        context: %{
          ctx |
            changes: Map.get(args, :changes, ctx.changes),
            filters: Map.get(args, :filters, ctx.filters),
            order: Map.get(args, :order),
            order_by: Map.get(args, :order_by),
            search: Map.get(args, :search),
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
