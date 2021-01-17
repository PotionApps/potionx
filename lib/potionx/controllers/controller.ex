defmodule Potionx.Controller do
  @spec json(Plug.Conn.t, term) :: Plug.Conn.t
  def json(conn, data) do
    response = Jason.encode_to_iodata!(data)
    send_resp(conn, conn.status || 200, "application/json", response)
  end

  defp send_resp(conn, default_status, default_content_type, body) do
    conn
    |> ensure_resp_content_type(default_content_type)
    |> Plug.Conn.send_resp(conn.status || default_status, body)
  end

  defp ensure_resp_content_type(%Plug.Conn{resp_headers: resp_headers} = conn, content_type) do
    if List.keyfind(resp_headers, "content-type", 0) do
      conn
    else
      content_type = content_type <> "; charset=utf-8"
      %Plug.Conn{conn | resp_headers: [{"content-type", content_type}|resp_headers]}
    end
  end
end
