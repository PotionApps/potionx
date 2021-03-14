defmodule PotionxTest.IdentityService do
  use Potionx.Auth.IdentityService, [
    repo: PotionxTest.Repo,
    identity_schema: PotionxTest.Identity
  ]
end
