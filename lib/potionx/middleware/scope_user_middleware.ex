defmodule Potionx.Middleware.ScopeUser do
  @behaviour Absinthe.Middleware

  def call(%{context: %Potionx.Context.Service{} = ctx} = res, _) do
    Potionx.Repo.put_user_id((ctx.user || %{}) |> Map.get(:id))
    res
  end
  def call(resolution, _), do: resolution
end
