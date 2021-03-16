defmodule Potionx.Middleware.UserRequired do
  @behaviour Absinthe.Middleware

  def call(%{context: %Potionx.Context.Service{session: %{user: %{id: _}}}} = res, _opts) do
    res
  end
  def call(res, opts) do
    opts = opts || %{exceptions: []}
    Enum.member?(
      opts.exceptions,
      Absinthe.Resolution.path(res)
      |> Enum.at(0)
      |> Absinthe.Adapter.LanguageConventions.to_internal_name(nil)
      |> String.to_existing_atom
    )
    |> if do
      res
    else
      res
      |> Absinthe.Resolution.put_result({:error, "unauthorized"})
    end
  end
end
