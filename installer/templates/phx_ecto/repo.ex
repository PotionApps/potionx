defmodule <%= @app_module %>.Repo do
  use Ecto.Repo,
    otp_app: :<%= @app_name %>,
    adapter: <%= inspect @adapter_module %>
  use Potionx.Repo, [
    scoped_by_organization: [],
    scoped_by_user: []
  ]
end
