defmodule Potionx.Middleware.Scope do
  @behaviour Absinthe.Middleware

  def call(%{context: %Potionx.Context.Service{} = ctx} = res, _) do
    Potionx.Repo.put_org_id((ctx.organization || %{}) |> Map.get(:id))
    Potionx.Repo.put_user_id((ctx.user || %{}) |> Map.get(:id))
    res
  end
  def call(resolution, _), do: resolution
end
