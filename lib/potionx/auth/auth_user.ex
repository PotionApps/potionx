defmodule Potionx.Auth.User do
  @callback from_json(map()) ::  struct()
end
