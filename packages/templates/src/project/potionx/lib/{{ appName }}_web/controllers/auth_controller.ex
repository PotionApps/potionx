defmodule <%= webNamespace %>.AuthController do
  use <%= webNamespace %>, :controller
  use Potionx.AuthController, [endpoint: <%= webNamespace %>.Endpoint]
end
