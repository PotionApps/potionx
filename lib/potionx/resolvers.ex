defmodule Potionx.Resolvers do
  def resolve_computed(module, key) do
    fn entry, _, _ ->
      apply(module, key, [entry])
    end
  end
end
