defmodule Potionx.Plug.ApiAuthErrorHandler do
  alias Plug.Conn

  @spec call(Conn.t(), :not_authenticated) :: Conn.t()
  def call(conn, :not_authenticated) do
    conn
    |> Plug.Conn.put_resp_header("content-type", "application/json")
    |> Conn.send_resp(
      401,
      Jason.encode_to_iodata!(%{error: %{code: 401, message: "Not authenticated"}})
    )
  end
end
