Code.require_file "mix_helper.exs", __DIR__

defmodule Mix.Tasks.Potionx.NewTest do
  use ExUnit.Case, async: false
  import MixHelper
  import ExUnit.CaptureIO

  @app_name "phx_blog"

  setup do
    # The shell asks to install deps.
    # We will politely say not.
    send self(), {:mix_shell_input, :yes?, false}
    :ok
  end

  test "assets are in sync with installer" do
    for file <- ~w(favicon.ico phoenix.js phoenix.png) do
      assert File.read!("../priv/static/#{file}") ==
        File.read!("templates/phx_static/#{file}")
    end
  end

  test "returns the version" do
    Mix.Tasks.Potionx.New.run(["-v"])
    assert_received {:mix_shell, :info, ["Phoenix v" <> _]}
  end

  test "new with defaults" do
    in_tmp "new with defaults", fn ->
      Mix.Tasks.Potionx.New.run([@app_name])

      assert_file "phx_blog/README.md"

      assert_file "phx_blog/.formatter.exs", fn file ->
        assert file =~ "import_deps: [:ecto, :phoenix]"
        assert file =~ "inputs: [\"*.{ex,exs}\", \"priv/*/seeds.exs\", \"{config,lib,test}/**/*.{ex,exs}\"]"
        assert file =~ "subdirectories: [\"priv/*/migrations\"]"
      end

      assert_file "phx_blog/mix.exs", fn file ->
        assert file =~ "app: :phx_blog"
        refute file =~ "deps_path: \"../../deps\""
        refute file =~ "lockfile: \"../../mix.lock\""
      end

      assert_file "phx_blog/config/config.exs", fn file ->
        assert file =~ "ecto_repos: [PhxBlog.Repo]"
        assert file =~ "config :phoenix, :json_library, Jason"
        refute file =~ "namespace: PhxBlog"
        refute file =~ "config :phx_blog, :generators"
      end

      assert_file "phx_blog/config/prod.exs", fn file ->
        assert file =~ "port: 80"
      end

      assert_file "phx_blog/config/runtime.exs", ~r/ip: {0, 0, 0, 0, 0, 0, 0, 0}/

      assert_file "phx_blog/lib/phx_blog/application.ex", ~r/defmodule PhxBlog.Application do/
      assert_file "phx_blog/lib/phx_blog.ex", ~r/defmodule PhxBlog do/
      assert_file "phx_blog/mix.exs", fn file ->
        assert file =~ "mod: {PhxBlog.Application, []}"
        assert file =~ "{:jason, \"~> 1.0\"}"
        assert file =~ "{:phoenix_live_dashboard,"
      end

      assert_file "phx_blog/lib/phx_blog_web.ex", fn file ->
        assert file =~ "defmodule PhxBlogWeb do"
        assert file =~ "use Phoenix.View,\n        root: \"lib/phx_blog_web/templates\""
      end

      assert_file "phx_blog/test/phx_blog_web/controllers/page_controller_test.exs"
      assert_file "phx_blog/test/phx_blog_web/views/page_view_test.exs"
      assert_file "phx_blog/test/phx_blog_web/views/error_view_test.exs"
      assert_file "phx_blog/test/phx_blog_web/views/layout_view_test.exs"
      assert_file "phx_blog/test/support/conn_case.ex"
      assert_file "phx_blog/test/test_helper.exs"

      assert_file "phx_blog/lib/phx_blog_web/controllers/page_controller.ex",
                  ~r/defmodule PhxBlogWeb.PageController/

      assert_file "phx_blog/lib/phx_blog_web/views/page_view.ex",
                  ~r/defmodule PhxBlogWeb.PageView/

      assert_file "phx_blog/lib/phx_blog_web/router.ex", fn file ->
        assert file =~ "defmodule PhxBlogWeb.Router"
        assert file =~ "live_dashboard"
        assert file =~ "import Phoenix.LiveDashboard.Router"
      end

      assert_file "phx_blog/lib/phx_blog_web/endpoint.ex", fn file ->
        assert file =~ ~s|defmodule PhxBlogWeb.Endpoint|
        assert file =~ ~s|socket "/live"|
        assert file =~ ~s|plug Phoenix.LiveDashboard.RequestLogger|
      end

      assert_file "phx_blog/lib/phx_blog_web/templates/layout/app.html.eex",
                  "<title>PhxBlog · Phoenix Framework</title>"
      assert_file "phx_blog/lib/phx_blog_web/templates/page/index.html.eex", fn file ->
        version = Application.spec(:phx_new, :vsn) |> to_string() |> Version.parse!()
        changelog_vsn = "v#{version.major}.#{version.minor}"
        assert file =~
          "https://github.com/phoenixframework/phoenix/blob/#{changelog_vsn}/CHANGELOG.md"
      end

      # webpack
      assert_file "phx_blog/.gitignore", "/assets/node_modules/"
      assert_file "phx_blog/.gitignore", "phx_blog-*.tar"
      assert_file "phx_blog/.gitignore", ~r/\n$/
      assert_file "phx_blog/assets/webpack.config.js", "js/app.js"
      assert_file "phx_blog/assets/.babelrc", "env"
      assert_file "phx_blog/config/dev.exs", fn file ->
        assert file =~ "watchers: [\n    node:"
        assert file =~ "lib/phx_blog_web/(live|views)/.*(ex)"
        assert file =~ "lib/phx_blog_web/templates/.*(eex)"
      end
      assert_file "phx_blog/assets/static/favicon.ico"
      assert_file "phx_blog/assets/static/images/phoenix.png"
      assert_file "phx_blog/assets/css/app.scss"
      assert_file "phx_blog/assets/css/phoenix.css"
      assert_file "phx_blog/assets/js/app.js",
                  ~s[import socket from "./socket"]
      assert_file "phx_blog/assets/js/socket.js",
                  ~s[import {Socket} from "phoenix"]

      assert_file "phx_blog/assets/package.json", fn file ->
        assert file =~ ~s["file:../deps/phoenix"]
        assert file =~ ~s["file:../deps/phoenix_html"]
      end

      refute File.exists? "phx_blog/priv/static/css/app.scss"
      refute File.exists? "phx_blog/priv/static/css/phoenix.css"
      refute File.exists? "phx_blog/priv/static/js/phoenix.js"
      refute File.exists? "phx_blog/priv/static/js/app.js"

      assert File.exists?("phx_blog/assets/vendor")

      # Ecto
      config = ~r/config :phx_blog, PhxBlog.Repo,/
      assert_file "phx_blog/mix.exs", fn file ->
        assert file =~ "{:phoenix_ecto,"
        assert file =~ "aliases: aliases()"
        assert file =~ "ecto.setup"
        assert file =~ "ecto.reset"
      end
      assert_file "phx_blog/config/dev.exs", config
      assert_file "phx_blog/config/test.exs", config
      assert_file "phx_blog/config/runtime.exs", config
      assert_file "phx_blog/config/test.exs", ~R/database: "phx_blog_test#\{System.get_env\("MIX_TEST_PARTITION"\)\}"/
      assert_file "phx_blog/lib/phx_blog/repo.ex", ~r"defmodule PhxBlog.Repo"
      assert_file "phx_blog/lib/phx_blog_web.ex", ~r"defmodule PhxBlogWeb"
      assert_file "phx_blog/lib/phx_blog_web/endpoint.ex", ~r"plug Phoenix.Ecto.CheckRepoStatus, otp_app: :phx_blog"
      assert_file "phx_blog/priv/repo/seeds.exs", ~r"PhxBlog.Repo.insert!"
      assert_file "phx_blog/test/support/data_case.ex", ~r"defmodule PhxBlog.DataCase"
      assert_file "phx_blog/priv/repo/migrations/.formatter.exs", ~r"import_deps: \[:ecto_sql\]"

      # LiveView (disabled by default)
      refute_file "phx_blog/lib/phx_blog_web/live/page_live_view.ex"
      refute_file "phx_blog/assets/js/live.js"
      assert_file "phx_blog/mix.exs", &refute(&1 =~ ~r":phoenix_live_view")
      assert_file "phx_blog/mix.exs", &refute(&1 =~ ~r":floki")
      assert_file "phx_blog/assets/package.json",
                  &refute(&1 =~ ~s["phoenix_live_view": "file:../deps/phoenix_live_view"])

      assert_file "phx_blog/assets/js/app.js", fn file -> refute file =~ "LiveSocket" end

      assert_file "phx_blog/lib/phx_blog_web.ex", fn file ->
        refute file =~ "Phoenix.LiveView"
      end
      assert_file "phx_blog/lib/phx_blog_web/router.ex", &refute(&1 =~ ~s[plug :fetch_live_flash])
      assert_file "phx_blog/lib/phx_blog_web/router.ex", &refute(&1 =~ ~s[plug :put_root_layout])
      assert_file "phx_blog/lib/phx_blog_web/router.ex", &refute(&1 =~ ~s[HomeLive])
      assert_file "phx_blog/lib/phx_blog_web/router.ex", &assert(&1 =~ ~s[PageController])

      # Telemetry
      assert_file "phx_blog/mix.exs", fn file ->
        assert file =~ "{:telemetry_metrics, \"~> 0.4\"}"
        assert file =~ "{:telemetry_poller, \"~> 0.4\"}"
      end

      assert_file "phx_blog/lib/phx_blog_web/telemetry.ex", fn file ->
        assert file =~ "defmodule PhxBlogWeb.Telemetry do"
        assert file =~ "{:telemetry_poller, measurements: periodic_measurements()"
        assert file =~ "defp periodic_measurements do"
        assert file =~ "# {PhxBlogWeb, :count_users, []}"
        assert file =~ "def metrics do"
        assert file =~ "summary(\"phoenix.endpoint.stop.duration\","
        assert file =~ "summary(\"phoenix.router_dispatch.stop.duration\","
        assert file =~ "# Database Metrics"
        assert file =~ "summary(\"phx_blog.repo.query.total_time\","
      end

      # Install dependencies?
      assert_received {:mix_shell, :yes?, ["\nFetch and install dependencies?"]}

      # Instructions
      assert_received {:mix_shell, :info, ["\nWe are almost there" <> _ = msg]}
      assert msg =~ "$ cd phx_blog"
      assert msg =~ "$ mix deps.get"

      assert_received {:mix_shell, :info, ["Then configure your database in config/dev.exs" <> _]}
      assert_received {:mix_shell, :info, ["Start your Phoenix app" <> _]}

      # Channels
      assert File.exists?("phx_blog/lib/phx_blog_web/channels")
      assert_file "phx_blog/lib/phx_blog_web/channels/user_socket.ex", ~r"defmodule PhxBlogWeb.UserSocket"
      assert_file "phx_blog/lib/phx_blog_web/endpoint.ex", ~r"socket \"/socket\", PhxBlogWeb.UserSocket"
      assert File.exists?("phx_blog/test/phx_blog_web/channels")

      # Gettext
      assert_file "phx_blog/lib/phx_blog_web/gettext.ex", ~r"defmodule PhxBlogWeb.Gettext"
      assert File.exists?("phx_blog/priv/gettext/errors.pot")
      assert File.exists?("phx_blog/priv/gettext/en/LC_MESSAGES/errors.po")
    end
  end

  test "new without defaults" do
    in_tmp "new without defaults", fn ->
      Mix.Tasks.Potionx.New.run([@app_name, "--no-html", "--no-webpack", "--no-ecto", "--no-gettext", "--no-dashboard"])

      # No webpack
      refute File.read!("phx_blog/.gitignore") |> String.contains?("/assets/node_modules/")
      assert_file "phx_blog/.gitignore", ~r/\n$/
      assert_file "phx_blog/config/dev.exs", ~r/watchers: \[\]/

      # No webpack & No HTML
      refute_file "phx_blog/priv/static/css/app.css"
      refute_file "phx_blog/priv/static/css/phoenix.css"
      refute_file "phx_blog/priv/static/favicon.ico"
      refute_file "phx_blog/priv/static/images/phoenix.png"
      refute_file "phx_blog/priv/static/js/phoenix.js"
      refute_file "phx_blog/priv/static/js/app.js"

      # No Ecto
      config = ~r/config :phx_blog, PhxBlog.Repo,/
      refute File.exists?("phx_blog/lib/phx_blog/repo.ex")
      assert_file "phx_blog/lib/phx_blog_web/endpoint.ex", fn file ->
        refute file =~ "plug Phoenix.Ecto.CheckRepoStatus, otp_app: :phx_blog"
      end

      assert_file "phx_blog/lib/phx_blog_web/telemetry.ex", fn file ->
        refute file =~ "# Database Metrics"
        refute file =~ "summary(\"phx_blog.repo.query.total_time\","
      end

      assert_file "phx_blog/.formatter.exs", fn file ->
        assert file =~ "import_deps: [:phoenix]"
        assert file =~ "inputs: [\"*.{ex,exs}\", \"{config,lib,test}/**/*.{ex,exs}\"]"
        refute file =~ "subdirectories:"
      end

      assert_file "phx_blog/mix.exs", &refute(&1 =~ ~r":phoenix_ecto")

      assert_file "phx_blog/config/config.exs", fn file ->
        refute file =~ "config :phx_blog, :generators"
        refute file =~ "ecto_repos:"
      end

      assert_file "phx_blog/config/dev.exs", fn file ->
        refute file =~ config
        assert file =~ "config :phoenix, :plug_init_mode, :runtime"
      end
      assert_file "phx_blog/config/test.exs", &refute(&1 =~ config)
      assert_file "phx_blog/config/runtime.exs", &refute(&1 =~ config)
      assert_file "phx_blog/lib/phx_blog_web.ex", &refute(&1 =~ ~r"alias PhxBlog.Repo")

      # No gettext
      refute_file "phx_blog/lib/phx_blog_web/gettext.ex"
      refute_file "phx_blog/priv/gettext/en/LC_MESSAGES/errors.po"
      refute_file "phx_blog/priv/gettext/errors.pot"
      assert_file "phx_blog/mix.exs", &refute(&1 =~ ~r":gettext")
      assert_file "phx_blog/lib/phx_blog_web.ex", &refute(&1 =~ ~r"import AmsMockWeb.Gettext")
      assert_file "phx_blog/lib/phx_blog_web/views/error_helpers.ex", &refute(&1 =~ ~r"gettext")
      assert_file "phx_blog/config/dev.exs", &refute(&1 =~ ~r"gettext")

      # No HTML
      assert File.exists?("phx_blog/test/phx_blog_web/controllers")

      assert File.exists?("phx_blog/lib/phx_blog_web/controllers")
      assert File.exists?("phx_blog/lib/phx_blog_web/views")

      refute File.exists? "phx_blog/test/web/controllers/pager_controller_test.exs"
      refute File.exists? "phx_blog/test/views/layout_view_test.exs"
      refute File.exists? "phx_blog/test/views/page_view_test.exs"
      refute File.exists? "phx_blog/lib/phx_blog_web/controllers/page_controller.ex"
      refute File.exists? "phx_blog/lib/phx_blog_web/templates/layout/app.html.eex"
      refute File.exists? "phx_blog/lib/phx_blog_web/templates/page/index.html.eex"
      refute File.exists? "phx_blog/lib/phx_blog_web/views/layout_view.ex"
      refute File.exists? "phx_blog/lib/phx_blog_web/views/page_view.ex"

      assert_file "phx_blog/mix.exs", &refute(&1 =~ ~r":phoenix_html")
      assert_file "phx_blog/mix.exs", &refute(&1 =~ ~r":phoenix_live_reload")
      assert_file "phx_blog/lib/phx_blog_web.ex",
                  &assert(&1 =~ "defp view_helpers do")
      assert_file "phx_blog/lib/phx_blog_web/endpoint.ex",
                  &refute(&1 =~ ~r"Phoenix.LiveReloader")
      assert_file "phx_blog/lib/phx_blog_web/endpoint.ex",
                  &refute(&1 =~ ~r"Phoenix.LiveReloader.Socket")
      assert_file "phx_blog/lib/phx_blog_web/views/error_view.ex", ~r".json"
      assert_file "phx_blog/lib/phx_blog_web/router.ex", &refute(&1 =~ ~r"pipeline :browser")

      # No Dashboard
      assert_file "phx_blog/lib/phx_blog_web/endpoint.ex", fn file ->
        refute file =~ ~s|socket "/live"|
        refute file =~ ~s|plug Phoenix.LiveDashboard.RequestLogger|
      end

      assert_file "phx_blog/lib/phx_blog_web/router.ex", fn file ->
        refute file =~ "live_dashboard"
        refute file =~ "import Phoenix.LiveDashboard.Router"
      end
    end
  end

  test "new with no_dashboard" do
    in_tmp "new with no_dashboard", fn ->
      Mix.Tasks.Potionx.New.run([@app_name, "--no-dashboard"])

      assert_file "phx_blog/mix.exs", &refute(&1 =~ ~r":phoenix_live_dashboard")

      assert_file "phx_blog/lib/phx_blog_web/templates/layout/app.html.eex", fn file ->
        refute file =~ ~s|<%= link "LiveDashboard", to: Routes.live_dashboard_path(@conn, :home)|
      end

      assert_file "phx_blog/lib/phx_blog_web/endpoint.ex", fn file ->
        assert file =~ ~s|defmodule PhxBlogWeb.Endpoint|
        refute file =~ ~s|socket "/live"|
        refute file =~ ~s|plug Phoenix.LiveDashboard.RequestLogger|
      end
    end
  end

  test "new with no_html" do
    in_tmp "new with no_html", fn ->
      Mix.Tasks.Potionx.New.run([@app_name, "--no-html"])

      assert_file "phx_blog/mix.exs", fn file ->
        refute file =~ ~s|:phoenix_live_view|
        assert file =~ ~s|:phoenix_live_dashboard|
      end

      assert_file "phx_blog/lib/phx_blog_web/endpoint.ex", fn file ->
        assert file =~ ~s|defmodule PhxBlogWeb.Endpoint|
        assert file =~ ~s|socket "/live"|
        assert file =~ ~s|plug Phoenix.LiveDashboard.RequestLogger|
      end

      assert_file "phx_blog/lib/phx_blog_web/router.ex", fn file ->
        refute file =~ ~s|pipeline :browser|
        assert file =~ ~s|pipe_through [:fetch_session, :protect_from_forgery]|
      end
    end
  end

  test "new with no_webpack" do
    in_tmp "new with no_webpack", fn ->
      Mix.Tasks.Potionx.New.run([@app_name, "--no-webpack"])

      assert_file "phx_blog/.gitignore"
      assert_file "phx_blog/.gitignore", ~r/\n$/
      assert_file "phx_blog/priv/static/css/app.css"
      assert_file "phx_blog/priv/static/css/phoenix.css"
      assert_file "phx_blog/priv/static/favicon.ico"
      assert_file "phx_blog/priv/static/images/phoenix.png"
      assert_file "phx_blog/priv/static/js/phoenix.js"
      assert_file "phx_blog/priv/static/js/app.js"
    end
  end

  test "new with binary_id" do
    in_tmp "new with binary_id", fn ->
      Mix.Tasks.Potionx.New.run([@app_name, "--binary-id"])
      assert_file "phx_blog/config/config.exs", ~r/generators: \[binary_id: true\]/
    end
  end

  test "new with live" do
    in_tmp "new with live", fn ->
      Mix.Tasks.Potionx.New.run([@app_name, "--live"])
      assert_file "phx_blog/mix.exs", &assert(&1 =~ ~r":phoenix_live_view")
      assert_file "phx_blog/mix.exs", &assert(&1 =~ ~r":floki")

      refute_file "phx_blog/lib/phx_blog_web/controllers/page_controller.ex"

      assert_file "phx_blog/lib/phx_blog_web/live/page_live.ex", fn file ->
        assert file =~ "defmodule PhxBlogWeb.PageLive do"
      end

      assert_file "phx_blog/lib/phx_blog_web/templates/layout/root.html.leex", fn file ->
        assert file =~ ~s|<%= live_title_tag assigns[:page_title]|
        assert file =~ ~s|<%= link "LiveDashboard", to: Routes.live_dashboard_path(@conn, :home)|
      end

      assert_file "phx_blog/lib/phx_blog_web/live/page_live.html.leex", fn file ->
        assert file =~ ~s[Welcome]
      end

      assert_file "phx_blog/assets/package.json",
                  ~s["phoenix_live_view": "file:../deps/phoenix_live_view"]

      assert_file "phx_blog/assets/js/app.js", fn file ->
        assert file =~ ~s[import {LiveSocket} from "phoenix_live_view"]
      end

      assert_file "phx_blog/assets/css/app.scss", fn file ->
        assert file =~ ~s[.phx-click-loading]
      end

      assert_file "phx_blog/config/config.exs", fn file ->
        assert file =~ "live_view:"
        assert file =~ "signing_salt:"
      end

      assert_file "phx_blog/lib/phx_blog_web.ex", fn file ->
        assert file =~ "import Phoenix.LiveView.Helpers"
        assert file =~ "def live_view do"
        assert file =~ "def live_component do"
      end

      assert_file "phx_blog/lib/phx_blog_web/endpoint.ex", ~s[socket "/live", Phoenix.LiveView.Socket]
      assert_file "phx_blog/lib/phx_blog_web/router.ex", fn file ->
        assert file =~ ~s[plug :fetch_live_flash]
        assert file =~ ~s[plug :put_root_layout, {PhxBlogWeb.LayoutView, :root}]
        assert file =~ ~s[live "/", PageLive]
        refute file =~ ~s[plug :fetch_flash]
        refute file =~ ~s[PageController]
      end
    end
  end

  test "new with live no_dashboard" do
    in_tmp "new with live no_dashboard", fn ->
      Mix.Tasks.Potionx.New.run([@app_name, "--live", "--no-dashboard"])

      assert_file "phx_blog/mix.exs", &refute(&1 =~ ~r":phoenix_live_dashboard")

      assert_file "phx_blog/lib/phx_blog_web/templates/layout/root.html.leex", fn file ->
        refute file =~ ~s|<%= link "LiveDashboard", to: Routes.live_dashboard_path(@conn, :home)|
      end

      assert_file "phx_blog/lib/phx_blog_web/endpoint.ex", fn file ->
        assert file =~ ~s|defmodule PhxBlogWeb.Endpoint|
        assert file =~ ~s|socket "/live"|
        refute file =~ ~s|plug Phoenix.LiveDashboard.RequestLogger|
      end
    end
  end

  test "new with uppercase" do
    in_tmp "new with uppercase", fn ->
      Mix.Tasks.Potionx.New.run(["phxBlog"])

      assert_file "phxBlog/README.md"

      assert_file "phxBlog/mix.exs", fn file ->
        assert file =~ "app: :phxBlog"
      end

      assert_file "phxBlog/config/dev.exs", fn file ->
        assert file =~ ~r/config :phxBlog, PhxBlog.Repo,/
        assert file =~ "database: \"phxblog_dev\""
      end
    end
  end

  test "new with path, app and module" do
    in_tmp "new with path, app and module", fn ->
      project_path = Path.join(File.cwd!(), "custom_path")
      Mix.Tasks.Potionx.New.run([project_path, "--app", @app_name, "--module", "PhoteuxBlog"])

      assert_file "custom_path/.gitignore"
      assert_file "custom_path/.gitignore", ~r/\n$/
      assert_file "custom_path/mix.exs", ~r/app: :phx_blog/
      assert_file "custom_path/lib/phx_blog_web/endpoint.ex", ~r/app: :phx_blog/
      assert_file "custom_path/config/config.exs", ~r/namespace: PhoteuxBlog/
      assert_file "custom_path/lib/phx_blog_web.ex", ~r/use Phoenix.Controller, namespace: PhoteuxBlogWeb/
    end
  end

  test "new inside umbrella" do
    in_tmp "new inside umbrella", fn ->
      File.write! "mix.exs", MixHelper.umbrella_mixfile_contents()
      File.mkdir! "apps"
      File.cd! "apps", fn ->
        Mix.Tasks.Potionx.New.run([@app_name])

        assert_file "phx_blog/mix.exs", fn file ->
          assert file =~ "deps_path: \"../../deps\""
          assert file =~ "lockfile: \"../../mix.lock\""
        end

        assert_file "phx_blog/assets/package.json", fn file ->
          assert file =~ ~s["file:../../../deps/phoenix"]
          assert file =~ ~s["file:../../../deps/phoenix_html"]
        end
      end
    end
  end

  test "new with --no-install" do
    in_tmp "new with no install", fn ->
      Mix.Tasks.Potionx.New.run([@app_name, "--no-install"])

      # Does not prompt to install dependencies
      refute_received {:mix_shell, :yes?, ["\nFetch and install dependencies?"]}

      # Instructions
      assert_received {:mix_shell, :info, ["\nWe are almost there" <> _ = msg]}
      assert msg =~ "$ cd phx_blog"
      assert msg =~ "$ mix deps.get"

      assert_received {:mix_shell, :info, ["Then configure your database in config/dev.exs" <> _]}
      assert_received {:mix_shell, :info, ["Start your Phoenix app" <> _]}
    end
  end

  test "new defaults to pg adapter" do
    in_tmp "new defaults to pg adapter", fn ->
      project_path = Path.join(File.cwd!(), "custom_path")
      Mix.Tasks.Potionx.New.run([project_path])

      assert_file "custom_path/mix.exs", ":postgrex"
      assert_file "custom_path/config/dev.exs", [~r/username: "postgres"/, ~r/password: "postgres"/, ~r/hostname: "localhost"/]
      assert_file "custom_path/config/test.exs", [~r/username: "postgres"/, ~r/password: "postgres"/, ~r/hostname: "localhost"/]
      assert_file "custom_path/config/runtime.exs", [~r/url: database_url/]
      assert_file "custom_path/lib/custom_path/repo.ex", "Ecto.Adapters.Postgres"

      assert_file "custom_path/test/support/conn_case.ex", "Ecto.Adapters.SQL.Sandbox.start_owner"
      assert_file "custom_path/test/support/channel_case.ex", "Ecto.Adapters.SQL.Sandbox.start_owner"
      assert_file "custom_path/test/support/data_case.ex", "Ecto.Adapters.SQL.Sandbox.start_owner"
    end
  end

  test "new with mysql adapter" do
    in_tmp "new with mysql adapter", fn ->
      project_path = Path.join(File.cwd!(), "custom_path")
      Mix.Tasks.Potionx.New.run([project_path, "--database", "mysql"])

      assert_file "custom_path/mix.exs", ":myxql"
      assert_file "custom_path/config/dev.exs", [~r/username: "root"/, ~r/password: ""/]
      assert_file "custom_path/config/test.exs", [~r/username: "root"/, ~r/password: ""/]
      assert_file "custom_path/config/runtime.exs", [~r/url: database_url/]
      assert_file "custom_path/lib/custom_path/repo.ex", "Ecto.Adapters.MyXQL"

      assert_file "custom_path/test/support/conn_case.ex", "Ecto.Adapters.SQL.Sandbox.start_owner"
      assert_file "custom_path/test/support/channel_case.ex", "Ecto.Adapters.SQL.Sandbox.start_owner"
      assert_file "custom_path/test/support/data_case.ex", "Ecto.Adapters.SQL.Sandbox.start_owner"
    end
  end

  test "new with mssql adapter" do
    in_tmp "new with mssql adapter", fn ->
      project_path = Path.join(File.cwd!(), "custom_path")
      Mix.Tasks.Potionx.New.run([project_path, "--database", "mssql"])

      assert_file "custom_path/mix.exs", ":tds"
      assert_file "custom_path/config/dev.exs", [~r/username: "sa"/, ~r/password: "some!Password"/]
      assert_file "custom_path/config/test.exs", [~r/username: "sa"/, ~r/password: "some!Password"/]
      assert_file "custom_path/config/runtime.exs", [~r/url: database_url/]
      assert_file "custom_path/lib/custom_path/repo.ex", "Ecto.Adapters.Tds"

      assert_file "custom_path/test/support/conn_case.ex", "Ecto.Adapters.SQL.Sandbox.start_owner"
      assert_file "custom_path/test/support/channel_case.ex", "Ecto.Adapters.SQL.Sandbox.start_owner"
      assert_file "custom_path/test/support/data_case.ex", "Ecto.Adapters.SQL.Sandbox.start_owner"
    end
  end

  test "new with invalid database adapter" do
    in_tmp "new with invalid database adapter", fn ->
      project_path = Path.join(File.cwd!(), "custom_path")
      assert_raise Mix.Error, ~s(Unknown database "invalid"), fn ->
        Mix.Tasks.Potionx.New.run([project_path, "--database", "invalid"])
      end
    end
  end

  test "new with invalid args" do
    assert_raise Mix.Error, ~r"Application name must start with a letter and ", fn ->
      Mix.Tasks.Potionx.New.run ["007invalid"]
    end

    assert_raise Mix.Error, ~r"Application name must start with a letter and ", fn ->
      Mix.Tasks.Potionx.New.run ["valid", "--app", "007invalid"]
    end

    assert_raise Mix.Error, ~r"Module name must be a valid Elixir alias", fn ->
      Mix.Tasks.Potionx.New.run ["valid", "--module", "not.valid"]
    end

    assert_raise Mix.Error, ~r"Module name \w+ is already taken", fn ->
      Mix.Tasks.Potionx.New.run ["string"]
    end

    assert_raise Mix.Error, ~r"Module name \w+ is already taken", fn ->
      Mix.Tasks.Potionx.New.run ["valid", "--app", "mix"]
    end

    assert_raise Mix.Error, ~r"Module name \w+ is already taken", fn ->
      Mix.Tasks.Potionx.New.run ["valid", "--module", "String"]
    end
  end

  test "invalid options" do
    assert_raise Mix.Error, ~r/Invalid option: -d/, fn ->
      Mix.Tasks.Potionx.New.run(["valid", "-database", "mysql"])
    end
  end

  test "new without args" do
    in_tmp "new without args", fn ->
      assert capture_io(fn -> Mix.Tasks.Potionx.New.run([]) end) =~
             "Creates a new Phoenix project."
    end
  end
end
