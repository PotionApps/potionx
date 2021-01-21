defmodule Potionx.Middleware.Mutation do
  @behaviour Absinthe.Middleware

  def call(res, _) do
    cond do
      is_map(res.value) && Map.has_key?(res.value, :__struct__) ->
        %{res | value: %{node: res.value}}
      true ->
        %{res | value: res.value || %{}}
    end
  end
end
