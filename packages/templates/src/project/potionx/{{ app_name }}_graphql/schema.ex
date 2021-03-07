defmodule <%= graphql_namespace %>.Schema do
  use Potionx.Schema

  node interface do
    resolve_type fn
      _, _ ->
        nil
    end
  end

  def context(ctx) do
    Map.put(ctx, :loader, dataloader())
  end

  def dataloader do
    Dataloader.new
  end

  query do

  end
  mutation do

  end
  subscription do

  end
end
