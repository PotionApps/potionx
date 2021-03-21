defmodule <%= appModule %>.Sessions.SessionService do
  use Potionx.Auth.SessionService, [
    identity_service: <%= appModule %>.UserIdentities.UserIdentityService,
    repo: <%= appModule %>.Repo,
    session_schema: <%= appModule %>.Sessions.Session,
    user_schema: <%= appModule %>.Users.User,
    user_service: <%= appModule %>.Users.UserService
  ]
end
