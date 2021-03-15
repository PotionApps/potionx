defmodule PotionxTest.SessionService do
  use Potionx.Auth.SessionService, [
    identity_service: PotionxTest.IdentityService,
    repo: PotionxTest.Repo,
    session_schema: PotionxTest.Session,
    use_redis: System.get_env("REDIS_URL") !== nil,
    user_service: PotionxTest.UserService
  ]
end

