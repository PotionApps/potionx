defmodule <%= appModule %>.Repo do
  use Ecto.Repo,
    otp_app: :<%= appName %>,
    adapter: Ecto.Adapters.Postgres
  use Potionx.Repo, [
    scoped_by_organization: [],
    scoped_by_user: []
  ]
end
