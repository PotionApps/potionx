defmodule Potionx.Middleware.RolesAuthorization do

  def call(%{context: %Potionx.Context.Service{} = ctx} = res, opts) do
    opts[:roles]
    |> Enum.any?(fn role ->
      Enum.member?(ctx.roles, role)
    end)
    |> if do
      res
    else
      res
      |> Absinthe.Resolution.put_result({:error, "unauthorized"})
    end
  end
  def call(res, _) do
    IO.inspect(res.context)
    res
  end
end
