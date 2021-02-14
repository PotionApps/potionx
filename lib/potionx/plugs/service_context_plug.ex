defmodule Potionx.Plug.ServiceContext do
  @behaviour Plug

  def init(opts), do: opts

  def call(conn, _) do
    Absinthe.Plug.put_options(
      conn,
      context: build_context(conn)
    )
  end

  def build_context(conn) do
    user = Pow.Plug.current_user(conn)

    ctx = %Potionx.Context.Service{
      changes: Map.get(conn.body_params, :changes, %{}),
      filters: Map.get(conn.body_params, :filters, %{}),
      roles: Map.get((user || %{}), :roles, []),
      organization: nil,
      user: user
    }

    ctx
  end
end
