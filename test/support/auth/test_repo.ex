defmodule PotionxTest.Repo do
  use Ecto.Repo,
    otp_app: :potionx,
    adapter: Ecto.Adapters.Postgres
end