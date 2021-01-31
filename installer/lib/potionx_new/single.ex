defmodule Potionx.New.Single do
  @moduledoc false
  use Potionx.New.Generator
  alias Potionx.New.{Project}

  template :new, [
    {:eex,  "potionx/config/config.exs",                :project, "config/config.exs"},
    {:eex,  "potionx/config/dev.exs",                   :project, "config/dev.exs"},
    {:eex,  "potionx/config/dev.secret.exs",            :project, "config/dev.secret.exs"},
    {:eex,  "potionx/config/prod.exs",                  :project, "config/prod.exs"},
    {:eex,  "potionx/config/test.exs",                  :project, "config/test.exs"},
    {:eex,  "potionx/config/runtime.exs",               :project, "config/runtime.exs"},
    {:eex,  "phx_single/lib/app_name/application.ex",   :project, "lib/:app/application.ex"},
    {:eex,  "phx_single/lib/app_name.ex",               :project, "lib/:app.ex"},
    {:eex,  "phx_web/channels/user_socket.ex",          :project, "lib/:lib_web_name/channels/user_socket.ex"},
    {:keep, "phx_web/controllers",                      :project, "lib/:lib_web_name/controllers"},
    {:eex,  "phx_web/views/error_helpers.ex",           :project, "lib/:lib_web_name/views/error_helpers.ex"},
    {:eex,  "phx_web/views/error_view.ex",              :project, "lib/:lib_web_name/views/error_view.ex"},
    {:eex,  "potionx/app_name_web/endpoint.ex",         :project, "lib/:lib_web_name/endpoint.ex"},
    {:eex,  "potionx/app_name_web/router.ex",           :project, "lib/:lib_web_name/router.ex"},
    {:eex,  "phx_web/telemetry.ex",                     :project, "lib/:lib_web_name/telemetry.ex"},
    {:eex,  "phx_single/lib/app_name_web.ex",           :project, "lib/:lib_web_name.ex"},
    {:eex,  "phx_single/README.md",                     :project, "README.md"},
    {:eex,  "phx_single/formatter.exs",                 :project, ".formatter.exs"},
    {:eex,  "phx_single/gitignore",                     :project, ".gitignore"},
    {:eex,  "phx_test/support/channel_case.ex",         :project, "test/support/channel_case.ex"},
    {:eex,  "phx_test/support/conn_case.ex",            :project, "test/support/conn_case.ex"},
    {:eex,  "phx_single/test/test_helper.exs",          :project, "test/test_helper.exs"},
    {:keep, "phx_test/channels",                        :project, "test/:lib_web_name/channels"},
    {:keep, "phx_test/controllers",                     :project, "test/:lib_web_name/controllers"},
    {:eex,  "phx_test/views/error_view_test.exs",       :project, "test/:lib_web_name/views/error_view_test.exs"},
  ]

  template :gettext, [
    {:eex,  "phx_gettext/gettext.ex",               :project, "lib/:lib_web_name/gettext.ex"},
    {:eex,  "phx_gettext/en/LC_MESSAGES/errors.po", :project, "priv/gettext/en/LC_MESSAGES/errors.po"},
    {:eex,  "phx_gettext/errors.pot",               :project, "priv/gettext/errors.pot"}
  ]

  template :html, [
    {:eex, "potionx/app_name_web/controllers/app_controller.ex",         :project, "lib/:lib_web_name/controllers/app_controller.ex"},
    {:eex, "phx_web/controllers/page_controller.ex",         :project, "lib/:lib_web_name/controllers/page_controller.ex"},
    {:eex, "potionx/app_name_web/templates/layout/app.html.eex", :project, "lib/:lib_web_name/templates/layout/app.html.eex"},
    {:eex, "potionx/app_name_web/templates/app/index.html.eex", :project, "lib/:lib_web_name/templates/app/index.html.eex"},
    {:eex, "potionx/app_name_web/templates/authorization/refresh.html.eex", :project, "lib/:lib_web_name/templates/authorization/refresh.html.eex"},
    {:eex, "phx_web/templates/page/index.html.eex",          :project, "lib/:lib_web_name/templates/page/index.html.eex"},
    {:eex, "potionx/app_name_web/views/app_view.ex",         :project, "lib/:lib_web_name/views/app_view.ex"},
    {:eex, "potionx/app_name_web/views/authorization_view.ex",  :project, "lib/:lib_web_name/views/authorization_view.ex"},
    {:eex, "potionx/app_name_web/views/layout_view.ex",      :project, "lib/:lib_web_name/views/layout_view.ex"},
    {:eex, "phx_web/views/page_view.ex",                     :project, "lib/:lib_web_name/views/page_view.ex"},
    {:eex, "phx_test/controllers/page_controller_test.exs",  :project, "test/:lib_web_name/controllers/page_controller_test.exs"},
    {:eex, "phx_test/views/layout_view_test.exs",            :project, "test/:lib_web_name/views/layout_view_test.exs"},
    {:eex, "phx_test/views/page_view_test.exs",              :project, "test/:lib_web_name/views/page_view_test.exs"},
  ]

  template :ecto, [
    {:eex,  "phx_ecto/repo.ex",              :app, "lib/:app/repo.ex"},
    {:keep, "phx_ecto/priv/repo/migrations", :app, "priv/repo/migrations"},
    {:eex,  "phx_ecto/formatter.exs",        :app, "priv/repo/migrations/.formatter.exs"},
    {:eex,  "phx_ecto/seeds.exs",            :app, "priv/repo/seeds.exs"},
    {:eex,  "phx_ecto/data_case.ex",         :app, "test/support/data_case.ex"},
  ]

  template :webpack, []

  template :webpack_live, []
  template :bare, []

  template :static, [
    {:text, "phx_static/robots.txt",  :web, "priv/static/robots.txt"},
    {:text, "phx_static/favicon.ico", :web, "priv/static/favicon.ico"}
  ]

  template :potionx, [
    {:eex,  "potionx/mix.exs",  :project, "mix.exs"},
    {:keep, "potionx/app_name_graphql", :app, "lib/:lib_graphql_name"},
    {:eex, "potionx/app_name_graphql/schema.ex", :app, "lib/:lib_graphql_name/schema.ex"},
    {:keep, "potionx/app_name/users", :app, "lib/:app/users"},
    {:eex, "potionx/app_name/users/user.ex", :app, "lib/:app/users/user.ex"},
    {:eex, "potionx/app_name/release.ex", :app, "lib/:app/release.ex"},
    {:eex, "potionx/app_name_web/controllers/auth_controller.ex", :app, "lib/:lib_web_name/controllers/auth_controller.ex"},
    {:eex, "potionx/app_name_web/controllers/authorization_controller.ex", :app, "lib/:lib_web_name/controllers/authorization_controller.ex"},
    {:migration, "potionx/migrations/create_users.exs", :app, "priv/repo/migrations/{timestamp}_create_users.exs"},
    {:eex, "potionx/test/app_name_web/controllers/authorization_controller_test.exs", :app, "test/:lib_web_name/controllers/authorization_controller_test.exs"},
    {:eex, "potionx/priv/repo/potionx_seed.exs", :app, "priv/repo/potionx_seed.exs"},
    {:eex, "potionx/frontend/admin/.gitignore", :app, "frontend/admin/.gitignore"},
    {:eex, "potionx/frontend/admin/package.json", :app, "frontend/admin/package.json"},
    {:eex, "potionx/frontend/admin/postcss.config.js", :app, "frontend/admin/postcss.config.js"},
    {:eex, "potionx/frontend/admin/tailwind.config.js", :app, "frontend/admin/tailwind.config.js"},
    {:eex, "potionx/frontend/admin/tsconfig.json", :app, "frontend/admin/tsconfig.json"},
    {:eex, "potionx/frontend/admin/vite.config.ts", :app, "frontend/admin/vite.config.ts"},
    {:eex, "potionx/frontend/admin/src/App.tsx", :app, "frontend/admin/src/App.tsx"},
    {:eex, "potionx/frontend/admin/src/main.css", :app, "frontend/admin/src/main.css"},
    {:eex, "potionx/frontend/admin/src/main.ts", :app, "frontend/admin/src/main.ts"},
    {:eex, "potionx/frontend/admin/src/routes/index.ts", :app, "frontend/admin/src/routes/index.ts"},
    {:eex, "potionx/frontend/admin/src/routes/routeNames.ts", :app, "frontend/admin/src/routes/routeNames.ts"},
    {:eex, "potionx/frontend/admin/src/routes/RouteLogin/RouteLogin.tsx", :app, "frontend/admin/src/routes/RouteLogin/RouteLogin.tsx"},
    {:eex, "potionx/frontend/admin/src/routes/RouteUsers/RouteUsers.tsx", :app, "frontend/admin/src/routes/RouteUsers/RouteUsers.tsx"},
    {:eex, "potionx/frontend/shared/.gitignore", :app, "frontend/shared/.gitignore"},
    {:eex, "potionx/frontend/shared/package.json", :app, "frontend/shared/package.json"},
    {:eex, "potionx/frontend/shared/codegen.yml", :app, "frontend/shared/codegen.yml"},
    {:eex, "potionx/frontend/shared/src/gql.ts", :app, "frontend/shared/src/gql.ts"},
    {:eex, "potionx/frontend/shared/src/signIn.ts", :app, "frontend/shared/src/signIn.ts"},
    {:eex, "potionx/frontend/shared/src/types.d.ts", :app, "frontend/shared/src/types.d.ts"},
    {:eex, "potionx/build.sh", :app, "build.sh"},
    {:eex, "potionx/Dockerfile", :app, "Dockerfile"}
  ]

  def prepare_project(%Project{app: app} = project) when not is_nil(app) do
    %Project{project | project_path: project.base_path}
    |> put_app()
    |> put_root_app()
    |> put_web_app()
  end

  defp put_app(%Project{base_path: base_path} = project) do
    %Project{project |
             in_umbrella?: in_umbrella?(base_path),
             app_path: base_path}
  end

  defp put_root_app(%Project{app: app, opts: opts} = project) do
    %Project{project |
             root_app: app,
             root_mod: Module.concat([opts[:module] || Macro.camelize(app)])}
  end

  defp put_web_app(%Project{app: app} = project) do
    %Project{project |
             web_app: app,
             lib_graphql_name: "#{app}_graphql",
             lib_web_name: "#{app}_web",
             graphql_namespace: Module.concat(["#{project.root_mod}GraphQl"]),
             web_namespace: Module.concat(["#{project.root_mod}Web"]),
             web_path: project.project_path}
  end

  def generate(%Project{} = project) do
    if Project.live?(project), do: assert_live_switches!(project)

    copy_from project, __MODULE__, :new
    gen_potionx(project)

    if Project.ecto?(project), do: gen_ecto(project)

    cond do
      Project.live?(project) -> gen_live(project)
      Project.html?(project) -> gen_html(project)
      true -> :noop
    end

    if Project.gettext?(project), do: gen_gettext(project)

    project
  end

  def gen_html(project) do
    copy_from project, __MODULE__, :html
  end

  def gen_gettext(project) do
    copy_from project, __MODULE__, :gettext
  end

  defp gen_live(project) do
    copy_from project, __MODULE__, :live
  end

  def gen_ecto(project) do
    copy_from project, __MODULE__, :ecto
    gen_ecto_config(project)
  end

  def gen_potionx(%Project{} = project) do
    copy_from project, __MODULE__, :potionx
  end

  def gen_static(%Project{} = project) do
    copy_from project, __MODULE__, :static
  end

  def gen_bare(%Project{} = project) do
    copy_from project, __MODULE__, :bare
  end

  def assert_live_switches!(project) do
    unless Project.html?(project) and Project.webpack?(project) do
      raise "cannot generate --live project with --no-html or --no-webpack. LiveView requires HTML and webpack"
    end
  end
end
