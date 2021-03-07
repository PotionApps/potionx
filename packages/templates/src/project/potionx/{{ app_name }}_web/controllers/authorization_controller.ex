defmodule <%= web_namespace %>.AuthorizationController do
  use <%= web_namespace %>, :controller
  use Potionx.AuthorizationController, [endpoint: <%= web_namespace %>.Endpoint]

  defp redirect_uri(conn) do
    "#{Application.get_env(:<%= app_name %>, :pow_assent)[:callback_origin]}/api/v1/auth/#{conn.params["provider"]}/callback"
  end
end
