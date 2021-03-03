Code.require_file "mix_helper.exs", __DIR__

defmodule Mix.Tasks.Potionx.NewTest do
  use ExUnit.Case, async: false
  import MixHelper
  import ExUnit.CaptureIO

  @app_name "potionx_blog"

  setup do
    # The shell asks for the database user and database along with default email
    send self(), {:mix_shell_input, :prompt, "user"}
    send self(), {:mix_shell_input, :prompt, "password"}
    send self(), {:mix_shell_input, :prompt, "user@potionapps.com"}
    :ok
  end

  # test "frontend is in sync with installer" do
  #   for file <- ~w(favicon.ico phoenix.js phoenix.png) do
  #     assert File.read!("../priv/static/#{file}") ==
  #       File.read!("templates/phx_static/#{file}")
  #   end
  # end

  test "returns the version" do
    Mix.Tasks.Potionx.New.run(["-v"])
    assert_received {:mix_shell, :info, ["Potionx v" <> _]}
  end

  test "new with defaults without: deps, frontend and migrations" do
    in_tmp "new with defaults", fn ->
      Mix.Tasks.Potionx.New.run([@app_name, "--no-frontend", "--no-migrations", "--no-install-deps", "--no-users"])

      assert_file "potionx_blog/README.md"

      assert_file "potionx_blog/.formatter.exs", fn file ->
        assert file =~ "import_deps: [:ecto, :phoenix]"
        assert file =~ "inputs: [\"*.{ex,exs}\", \"priv/*/seeds.exs\", \"{config,lib,test}/**/*.{ex,exs}\"]"
        assert file =~ "subdirectories: [\"priv/*/migrations\"]"
      end

      assert_file "potionx_blog/mix.exs", fn file ->
        assert file =~ "app: :potionx_blog"
        refute file =~ "deps_path: \"../../deps\""
        refute file =~ "lockfile: \"../../mix.lock\""
      end

      assert_file "potionx_blog/config/config.exs", fn file ->
        assert file =~ "ecto_repos: [PotionxBlog.Repo]"
        assert file =~ "config :phoenix, :json_library, Jason"
        refute file =~ "namespace: PotionxBlog"
        refute file =~ "config :potionx_blog, :generators"
      end

      assert_file "potionx_blog/config/prod.exs", fn file ->
        assert file =~ "port: 80"
      end

      assert_file "potionx_blog/config/runtime.exs", ~r/ip: {0, 0, 0, 0, 0, 0, 0, 0}/

      assert_file "potionx_blog/lib/potionx_blog/application.ex", ~r/defmodule PotionxBlog.Application do/
      assert_file "potionx_blog/lib/potionx_blog.ex", ~r/defmodule PotionxBlog do/
      assert_file "potionx_blog/mix.exs", fn file ->
        assert file =~ "mod: {PotionxBlog.Application, []}"
        assert file =~ "{:jason, \"~> 1.0\"}"
        assert file =~ "{:phoenix_live_dashboard,"
      end

      assert_file "potionx_blog/lib/potionx_blog_web.ex", fn file ->
        assert file =~ "defmodule PotionxBlogWeb do"
        assert file =~ "use Phoenix.View,"
        assert file =~ "root: \"lib/potionx_blog_web/templates\""
      end

      # assert_file "potionx_blog/test/potionx_blog_web/controllers/page_controller_test.exs"
      # assert_file "potionx_blog/test/potionx_blog_web/views/page_view_test.exs"
      assert_file "potionx_blog/test/potionx_blog_web/views/error_view_test.exs"
      assert_file "potionx_blog/test/potionx_blog_web/views/layout_view_test.exs"
      assert_file "potionx_blog/test/support/conn_case.ex"
      assert_file "potionx_blog/test/test_helper.exs"

      assert_file "potionx_blog/lib/potionx_blog_web/controllers/app_controller.ex",
                  ~r/defmodule PotionxBlogWeb.AppController/

      assert_file "potionx_blog/lib/potionx_blog_web/views/app_view.ex",
                  ~r/defmodule PotionxBlogWeb.AppView/

      assert_file "potionx_blog/lib/potionx_blog_web/router.ex", fn file ->
        assert file =~ "defmodule PotionxBlogWeb.Router"
        assert file =~ "live_dashboard"
        assert file =~ "import Phoenix.LiveDashboard.Router"
      end

      assert_file "potionx_blog/lib/potionx_blog_web/endpoint.ex", fn file ->
        assert file =~ ~s|defmodule PotionxBlogWeb.Endpoint|
        assert file =~ ~s|socket "/live"|
        assert file =~ ~s|plug Phoenix.LiveDashboard.RequestLogger|
      end

      assert_file "potionx_blog/lib/potionx_blog_web/templates/layout/app.html.eex",
                  "<script async defer type=\"module\" src=\"<%= script %>\"></script>"
      # assert_file "potionx_blog/lib/potionx_blog_web/templates/page/index.html.eex", fn file ->
      #   version = Application.spec(:phx_new, :vsn) |> to_string() |> Version.parse!()
      #   changelog_vsn = "v#{version.major}.#{version.minor}"
      #   assert file =~
      #     "https://github.com/phoenixframework/phoenix/blob/#{changelog_vsn}/CHANGELOG.md"
      # end

      # frontend
      assert_file "potionx_blog/.gitignore", "node_modules"
      assert_file "potionx_blog/.gitignore", "potionx_blog-*.tar"
      # assert_file "potionx_blog/frontend/admin/vite.config.ts", "./src/main.ts"
      assert_file "potionx_blog/config/dev.exs", fn file ->
        assert file =~ "lib/potionx_blog_web/(live|views)/.*(ex)"
        assert file =~ "lib/potionx_blog_web/templates/.*(eex)"
      end
      # assert_file "potionx_blog/assets/static/images/phoenix.png"
      # assert_file "potionx_blog/assets/css/app.scss"
      # assert_file "potionx_blog/assets/css/phoenix.css"
      # assert_file "potionx_blog/assets/js/app.js",
      #             ~s[import socket from "./socket"]
      # assert_file "potionx_blog/assets/js/socket.js",
      #             ~s[import {Socket} from "phoenix"]

      # assert_file "potionx_blog/assets/package.json", fn file ->
      #   assert file =~ ~s["file:../deps/phoenix"]
      #   assert file =~ ~s["file:../deps/phoenix_html"]
      # end

      # refute File.exists? "potionx_blog/priv/static/css/app.scss"
      # refute File.exists? "potionx_blog/priv/static/css/phoenix.css"
      # refute File.exists? "potionx_blog/priv/static/js/phoenix.js"
      # refute File.exists? "potionx_blog/priv/static/js/app.js"

      # assert File.exists?("potionx_blog/assets/vendor")

      # Ecto
      config = ~r/config :potionx_blog, PotionxBlog.Repo,/
      assert_file "potionx_blog/mix.exs", fn file ->
        assert file =~ "{:phoenix_ecto,"
        assert file =~ "aliases: aliases()"
        assert file =~ "ecto.setup"
        assert file =~ "ecto.reset"
      end
      assert_file "potionx_blog/config/dev.secret.exs", config
      assert_file "potionx_blog/config/test.secret.exs", config
      assert_file "potionx_blog/config/runtime.exs", config
      assert_file "potionx_blog/config/test.secret.exs", ~R/database: "potionx_blog_test#\{System.get_env\("MIX_TEST_PARTITION"\)\}"/
      assert_file "potionx_blog/lib/potionx_blog/repo.ex", ~r"defmodule PotionxBlog.Repo"
      assert_file "potionx_blog/lib/potionx_blog_web.ex", ~r"defmodule PotionxBlogWeb"
      assert_file "potionx_blog/lib/potionx_blog_web/endpoint.ex", ~r"plug Phoenix.Ecto.CheckRepoStatus, otp_app: :potionx_blog"
      assert_file "potionx_blog/priv/repo/seeds.exs", ~r"PotionxBlog.Repo.insert!"
      assert_file "potionx_blog/test/support/data_case.ex", ~r"defmodule PotionxBlog.DataCase"
      assert_file "potionx_blog/priv/repo/migrations/.formatter.exs", ~r"import_deps: \[:ecto_sql\]"

      # LiveView (disabled by default)
      refute_file "potionx_blog/lib/potionx_blog_web/live/page_live_view.ex"
      refute_file "potionx_blog/assets/js/live.js"
      assert_file "potionx_blog/mix.exs", &refute(&1 =~ ~r":phoenix_live_view")
      assert_file "potionx_blog/mix.exs", &refute(&1 =~ ~r":floki")

      assert_file "potionx_blog/lib/potionx_blog_web.ex", fn file ->
        refute file =~ "Phoenix.LiveView"
      end
      assert_file "potionx_blog/lib/potionx_blog_web/router.ex", &refute(&1 =~ ~s[plug :fetch_live_flash])
      assert_file "potionx_blog/lib/potionx_blog_web/router.ex", &refute(&1 =~ ~s[plug :put_root_layout])
      assert_file "potionx_blog/lib/potionx_blog_web/router.ex", &refute(&1 =~ ~s[HomeLive])
      assert_file "potionx_blog/lib/potionx_blog_web/router.ex", &assert(&1 =~ ~s[AppController])

      # Telemetry
      assert_file "potionx_blog/mix.exs", fn file ->
        assert file =~ "{:telemetry_metrics, \"~> 0.4\"}"
        assert file =~ "{:telemetry_poller, \"~> 0.4\"}"
      end

      assert_file "potionx_blog/lib/potionx_blog_web/telemetry.ex", fn file ->
        assert file =~ "defmodule PotionxBlogWeb.Telemetry do"
        assert file =~ "{:telemetry_poller, measurements: periodic_measurements()"
        assert file =~ "defp periodic_measurements do"
        assert file =~ "# {PotionxBlogWeb, :count_users, []}"
        assert file =~ "def metrics do"
        assert file =~ "summary(\"phoenix.endpoint.stop.duration\","
        assert file =~ "summary(\"phoenix.router_dispatch.stop.duration\","
        assert file =~ "# Database Metrics"
        assert file =~ "summary(\"potionx_blog.repo.query.total_time\","
      end

      # Install dependencies?
      # assert_received {:mix_shell, :yes?, ["\nFetch and install dependencies?"]}

      # Instructions
      # assert_received {:mix_shell, :info, ["\nWe are almost there" <> _ = msg]}
      # assert msg =~ "$ cd potionx_blog"
      # assert msg =~ "$ mix deps.get"

      # assert_received {:mix_shell, :info, ["Then configure your database in config/dev.exs" <> _]}
      # assert_received {:mix_shell, :info, ["Start your Phoenix app" <> _]}

      # Channels
      assert File.exists?("potionx_blog/lib/potionx_blog_web/channels")
      assert_file "potionx_blog/lib/potionx_blog_web/channels/user_socket.ex", ~r"defmodule PotionxBlogWeb.UserSocket"
      assert_file "potionx_blog/lib/potionx_blog_web/endpoint.ex", ~r"socket \"/socket\", PotionxBlogWeb.UserSocket"
      assert File.exists?("potionx_blog/test/potionx_blog_web/channels")

      # Gettext
      assert_file "potionx_blog/lib/potionx_blog_web/gettext.ex", ~r"defmodule PotionxBlogWeb.Gettext"
      assert File.exists?("potionx_blog/priv/gettext/errors.pot")
      assert File.exists?("potionx_blog/priv/gettext/en/LC_MESSAGES/errors.po")
    end
  end
end
