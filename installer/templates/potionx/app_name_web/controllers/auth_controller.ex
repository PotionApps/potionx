defmodule <%= @web_namespace %>.AuthController do
  use <%= @web_namespace %>, :controller
  use Potionx.AuthController, [endpoint: <%= @web_namespace %>.Endpoint]
end
