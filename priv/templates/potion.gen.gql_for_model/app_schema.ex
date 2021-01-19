defmodule <%= module_name_graphql %>.Schema do
  use Absinthe.Schema
  use Absinthe.Relay.Schema, :modern
  import_types Absinthe.Type.Custom
  import_types Potionx.Types

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
