defmodule Potionx.Middleware.ServiceContext do
  def call(%{arguments: args, context: %Potionx.Context.Service{} = ctx} = res, _) do
    %{
      res |
        context: %{
          ctx |
            changes: Map.get(args, :changes, ctx.changes),
            filters: Map.get(args, :filters, ctx.filters)
        }
    }
  end
  def call(resolution, _), do: resolution
end
