defmodule Potionx.Utils.URI do
  @doc """
  Return the subdomain from a Plug.Conn if it exists
  """
  @spec subdomain(Plug.Conn.t()) :: String.t() | nil
  def subdomain(%Plug.Conn{} = conn) do
    host =
      Plug.Conn.request_url(conn)
      |> URI.parse()
      |> Map.get(:host) || ""
    host
    |> String.split(".")
    |> case do
      [subdomain, _, _] -> subdomain
      _ -> nil
    end
  end
end
