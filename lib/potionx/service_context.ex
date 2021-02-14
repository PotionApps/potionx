defmodule Potionx.Context.Service do
  use TypedStruct
  @behaviour Access

  typedstruct do
    field :changes, map(), default: %{}
    field :file, Plug.Upload.t()
    field :filters, map(), default: %{}
    field :organization, struct()
    field :pagination, map(), default: %{}
    field :roles, [String.t()], default: []
    field :session_fingerprint, String.t()
    field :user, struct()
  end

  @spec fetch(map, any) :: {:ok, any}
  def fetch(ctx, key) do
    Map.fetch(ctx, key)
  end

  def get_and_update(data, key, func) do
    Map.get_and_update(data, key, func)
  end
  def pop(data, key), do: Map.pop(data, key)
end
