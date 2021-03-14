defmodule Potionx.Plug.Absinthe do
  @behaviour Plug

  def init(opts), do: opts

  def call(%{assigns: %{context: ctx}} = conn, _) do
    Absinthe.Plug.put_options(
      conn,
      context: ctx
    )
  end
end
