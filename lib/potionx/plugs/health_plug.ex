defmodule Potionx.Plug.Health do
  @behaviour Plug

  @path_startup   "/_k8s/startup"
  @path_liveness  "/_k8s/liveness"
  @path_readiness "/_k8s/readiness"

  @impl true
  def init(opts), do: opts

  @impl true
  def call(%Plug.Conn{} = conn, opts) do
    health_module = Keyword.fetch!(opts, :health_module)
    case conn.request_path do
      @path_startup   -> health_response(conn,  health_module.has_started?())
      @path_liveness  -> health_response(conn, health_module.is_alive?())
      @path_readiness -> health_response(conn,  health_module.is_ready?())
      _other          -> conn
    end
  end

  # Respond according to health checks
  defp health_response(conn, true) do
    conn
    |> Plug.Conn.send_resp(200, "OK")
    |> Plug.Conn.halt()
  end

  defp health_response(conn, false) do
    conn
    |> Plug.Conn.send_resp(503, "SERVICE UNAVAILABLE")
    |> Plug.Conn.halt()
  end

end
