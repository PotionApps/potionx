defmodule Potionx.Context.Service do
  use TypedStruct
  @behaviour Access

  typedstruct do
    field :__absinthe_plug__, map()
    field :arguments, map()
    field :assigns, map(), default: %{}
    field :changes, map(), default: %{}
    field :files, [Plug.Upload.t()]
    field :filters, map(), default: %{}
    field :ip, String.t()
    field :locale, atom()
    field :locale_default, atom()
    field :order, atom()
    field :order_by, String.t()
    field :organization, struct()
    field :pagination, Potionx.Repo.Pagination.t(), default: %Potionx.Repo.Pagination{}
    field :request_url, String.t()
    field :roles, [String.t()], default: []
    field :search, String.t()
    field :session, struct()
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
