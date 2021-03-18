defmodule <%= appModule %>.UserIdentities.UserIdentityService do
  use Potionx.Auth.IdentityService, [
    repo: <%= appModule %>.Repo,
    identity_schema: <%= appModule %>.UserIdentities.UserIdentity
  ]
end
