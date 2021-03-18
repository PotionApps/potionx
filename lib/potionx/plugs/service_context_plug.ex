defmodule Potionx.Plug.ServiceContext do
  @behaviour Plug

  def init(opts), do: opts

  def call(conn, _) do
    conn
    |> Plug.Conn.assign(
      :context,
      build_context(conn)
    )
  end

  def build_context(conn) do

    ctx = %Potionx.Context.Service{
      changes: Map.get(conn.body_params, :changes, %{}),
      filters: Map.get(conn.body_params, :filters, %{}),
      # roles: Map.get((user || %{}), :roles, []),
      organization: nil,
      redirect_url: to_string(%URI{
        host: conn.host,
        scheme: to_string(conn.scheme)
      })
    }

    ctx
  end
end
