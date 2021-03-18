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
      ip: get_ip(conn),
      organization: nil,
      redirect_url: to_string(%URI{
        host: conn.host,
        scheme: to_string(conn.scheme),
        port: conn.port
      })
    }

    ctx
  end

  def get_ip(conn) do
    forwarded_for = List.first(Plug.Conn.get_req_header(conn, "x-forwarded-for"))
    cloudflare_ip = Enum.at(Plug.Conn.get_req_header(conn, "cf-connecting-ip"), 0)

    cond do
      forwarded_for ->
        String.split(forwarded_for, ",")
        |> Enum.map(&String.trim/1)
        |> List.first()
      cloudflare_ip -> cloudflare_ip
      true ->
        conn.remote_ip
        |> :inet.ntoa
        |> to_string
    end
  end
end
