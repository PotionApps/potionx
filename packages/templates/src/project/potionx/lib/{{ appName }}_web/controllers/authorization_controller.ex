defmodule <%= webNamespace %>.AuthorizationController do
  use <%= webNamespace %>, :controller
  use Potionx.AuthorizationController, [endpoint: <%= webNamespace %>.Endpoint]

  defp redirect_uri(conn) do
    "#{Application.get_env(:<%= appName %>, :pow_assent)[:callback_origin]}/api/v1/auth/#{conn.params["provider"]}/callback"
  end
end
