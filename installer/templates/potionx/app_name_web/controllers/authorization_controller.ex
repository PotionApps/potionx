defmodule <%= @web_namespace %>.AuthorizationController do
  use <%= @web_namespace %>, :controller
  use Potionx.AuthorizationController, [endpoint: <%= @web_namespace %>.Endpoint]

  defp redirect_uri(conn) do
    "https://client.example.com/auth/#{conn.params["provider"]}/callback"
  end
end
