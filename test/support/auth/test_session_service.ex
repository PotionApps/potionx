defmodule PotionxTest.SessionService do
  use Potionx.Auth.SessionService, [
    identity_service: PotionxTest.IdentityService,
    repo: PotionxTest.Repo,
    session_schema: PotionxTest.Session,
    user_service: PotionxTest.UserService
  ]
end
