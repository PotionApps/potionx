defmodule Potionx.Middleware.Me do
  @behaviour Absinthe.Middleware

  def call(%{context: %Potionx.Context.Service{user: %{id: id}} = ctx} = res, _) do
    %{
      res | context: %{ctx | filters: %{id: id}}
    }
  end
  def call(res, _) do
    res
    |> Absinthe.Resolution.put_result({:error, "unauthorized"})
  end
end
