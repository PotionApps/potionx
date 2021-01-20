defmodule Mix.Tasks.Potionx.New do
  @moduledoc """
  Creates a new Potionx project.

  It expects the path of the project as an argument.

      mix potionx.new PATH [--module MODULE] [--app APP]

  A project at the given PATH will be created. The
  application name and module name will be retrieved
  from the path, unless `--module` or `--app` is given.

  ## Options

    * `--live` - include Phoenix.LiveView to make it easier than ever
      to build interactive, real-time applications

    * `--umbrella` - generate an umbrella project,
      with one application for your domain, and
      a second application for the web interface.

    * `--app` - the name of the OTP application

    * `--module` - the name of the base module in
      the generated skeleton

    * `--database` - specify the database adapter for Ecto. One of:

        * `postgres` - via https://github.com/elixir-ecto/postgrex
        * `mysql` - via https://github.com/elixir-ecto/myxql
        * `mssql` - via https://github.com/livehelpnow/tds

      Please check the driver docs for more information
      and requirements. Defaults to "postgres".

    * `--no-webpack` - do not generate webpack files
      for static asset building. When choosing this
      option, you will need to manually handle
      JavaScript dependencies if building HTML apps

    * `--no-ecto` - do not generate Ecto files.

    * `--no-html` - do not generate HTML views.

    * `--no-gettext` - do not generate gettext files.

    * `--no-dashboard` - do not include Phoenix.LiveDashboard

    * `--binary-id` - use `binary_id` as primary key type
      in Ecto schemas

    * `--verbose` - use verbose output

  ## Installation

  `mix potionx.new` by default prompts you to fetch and install your
  dependencies. You can enable this behaviour by passing the
  `--install` flag or disable it with the `--no-install` flag.

  ## Examples

      mix potionx.new hello_world

  Is equivalent to:

      mix potionx.new hello_world --module HelloWorld

  Would generate the following directory structure and modules:

      hello_umbrella/   Hello.Umbrella
        apps/
          hello/        Hello
          hello_web/    HelloWeb

  You can read more about umbrella projects using the
  official [Elixir guide](http://elixir-lang.org/getting-started/mix-otp/dependencies-and-umbrella-apps.html#umbrella-projects)

  To print the Phoenix installer version, pass `-v` or `--version`, for example:

      mix potionx.new -v
  """
  use Mix.Task
  alias Phx.New.{Generator, Project, Single, Web, Ecto}

  @version Mix.Project.config()[:version]
  @shortdoc "Creates a new Phoenix v#{@version} application"

  @switches [dev: :boolean, webpack: :boolean, ecto: :boolean,
             app: :string, module: :string, web_module: :string,
             database: :string, binary_id: :boolean, html: :boolean,
             gettext: :boolean, umbrella: :boolean, verbose: :boolean,
             live: :boolean, dashboard: :boolean, install: :boolean]

  def ask_for_email(%Project{} = project) do
    email =
      Mix.shell().prompt("\nWhat email should the default user have?")
      |> String.trim

    %{project | email: email}
  end

  def ask_for_local_postgres_password(%Project{} = project) do
    email =
      Mix.shell().prompt("\nWhat is the password to your local Postgres database?")
      |> String.trim

    %{project | local_postgres_password: email}
  end

  def generate_default_graphql(%Project{} = project, path_key) do
    path = Map.fetch!(project, path_key)

    maybe_cd(path, fn ->
      cmd(project, "mix potionx.gen.gql_for_model UserIdentities UserIdentity --no-associations")
    end)

    maybe_cd(path, fn ->
      cmd(project, "mix potionx.gen.gql_for_model Users User")
    end)

    project
  end

  def install_pow_assent(%Project{} = project, path_key) do
    path = Map.fetch!(project, path_key)

    maybe_cd(path, fn ->
      cmd(project, "mix pow_assent.install")
    end)

    project
  end

  def run([version]) when version in ~w(-v --version) do
    Mix.shell().info("Phoenix v#{@version}")
  end

  def run(argv) do
    elixir_version_check!()
    case parse_opts(argv) do
      {_opts, []} ->
        Mix.Tasks.Help.run(["potionx.new"])

      {opts, [base_path | _]} ->
        generate(base_path, Single, :project_path, opts)
    end
  end

  def run(argv, generator, path) do
    elixir_version_check!()
    case parse_opts(argv) do
      {_opts, []} -> Mix.Tasks.Help.run(["potionx.new"])
      {opts, [base_path | _]} -> generate(base_path, generator, path, opts)
    end
  end

  def generate(base_path, generator, path, opts) do
    base_path
    |> Project.new(opts)
    |> ask_for_local_postgres_password
    |> generator.prepare_project()
    |> ask_for_email
    |> Generator.put_binding()
    |> validate_project(path)
    |> generator.generate()
    |> prompt_to_install_deps(generator, path)
    |> install_pow_assent(path)
    |> generate_default_graphql(path)
  end

  defp validate_project(%Project{opts: opts} = project, path) do
    check_app_name!(project.app, !!opts[:app])
    check_directory_existence!(Map.fetch!(project, path))
    check_module_name_validity!(project.root_mod)
    check_module_name_availability!(project.root_mod)

    project
  end

  defp prompt_to_install_deps(%Project{} = project, generator, path_key) do
    path = Map.fetch!(project, path_key)

    install? =
      Keyword.get_lazy(project.opts, :install, fn ->
        Mix.shell().yes?("\nFetch and install dependencies?")
      end)

    cd_step = ["$ cd #{relative_app_path(path)}"]

    maybe_cd(path, fn ->
      mix_step = install_mix(project, install?)

      compile =
        case mix_step do
          [] -> Task.async(fn -> rebar_available?() && cmd(project, "mix deps.compile") end)
          _  -> Task.async(fn -> :ok end)
        end

      # webpack_step = install_webpack(install?, project)
      Task.await(compile, :infinity)

      # if Project.webpack?(project) and !System.find_executable("npm") do
      #   print_webpack_info(project, generator)
      # end

      # print_missing_steps(cd_step ++ mix_step ++ webpack_step)
      print_missing_steps(cd_step ++ mix_step)

      if Project.ecto?(project) do
        print_ecto_info(generator)
      end

      if path_key == :web_path do
        Mix.shell().info("""
        Your web app requires a PubSub server to be running.
        The PubSub server is typically defined in a `mix potionx.new.ecto` app.
        If you don't plan to define an Ecto app, you must explicitly start
        the PubSub in your supervision tree as:

            {Phoenix.PubSub, name: #{inspect(project.app_mod)}.PubSub}
        """)
      end

      print_mix_info(generator)
    end)
    project
  end
  defp maybe_cd(path, func), do: path && File.cd!(path, func)

  defp parse_opts(argv) do
    case OptionParser.parse(argv, strict: @switches) do
      {opts, argv, []} ->
        {opts, argv}
      {_opts, _argv, [switch | _]} ->
        Mix.raise "Invalid option: " <> switch_to_string(switch)
    end
  end
  defp switch_to_string({name, nil}), do: name
  defp switch_to_string({name, val}), do: name <> "=" <> val

  defp install_webpack(install?, project) do
    assets_path = Path.join(project.web_path || project.project_path, "assets")
    webpack_config = Path.join(assets_path, "webpack.config.js")

    maybe_cmd(project, "cd #{relative_app_path(assets_path)} && npm install && node node_modules/webpack/bin/webpack.js --mode development",
              File.exists?(webpack_config), install? && System.find_executable("npm"))
  end

  defp install_mix(project, install?) do
    maybe_cmd(project, "mix deps.get", true, install? && hex_available?())
  end

  defp hex_available? do
    Code.ensure_loaded?(Hex)
  end

  defp rebar_available? do
    Mix.Rebar.rebar_cmd(:rebar) && Mix.Rebar.rebar_cmd(:rebar3)
  end

  defp print_webpack_info(_project, _gen) do
    Mix.shell().info """
    Phoenix uses an optional assets build tool called webpack
    that requires node.js and npm. Installation instructions for
    node.js, which includes npm, can be found at http://nodejs.org.

    The command listed next expect that you have npm available.
    If you don't want webpack, you can re-run this generator
    with the --no-webpack option.
    """
  end

  defp print_missing_steps(steps) do
    Mix.shell().info """

    We are almost there! The following steps are missing:

        #{Enum.join(steps, "\n    ")}
    """
  end

  defp print_ecto_info(Web), do: :ok
  defp print_ecto_info(_gen) do
    Mix.shell().info """
    Then configure your database in config/dev.exs and run:

        $ mix ecto.create
    """
  end

  defp print_mix_info(Ecto) do
    Mix.shell().info """
    You can run your app inside IEx (Interactive Elixir) as:

        $ iex -S mix
    """
  end
  defp print_mix_info(_gen) do
    Mix.shell().info """
    Start your Phoenix app with:

        $ mix phx.server

    You can also run your app inside IEx (Interactive Elixir) as:

        $ iex -S mix phx.server
    """
  end

  defp relative_app_path(path) do
    case Path.relative_to_cwd(path) do
      ^path -> Path.basename(path)
      rel -> rel
    end
  end

  ## Helpers

  defp maybe_cmd(project, cmd, should_run?, can_run?) do
    cond do
      should_run? && can_run? ->
        cmd(project, cmd)
      should_run? ->
        ["$ #{cmd}"]
      true ->
        []
    end
  end

  defp cmd(%Project{} = project, cmd) do
    Mix.shell().info [:green, "* running ", :reset, cmd]

    Mix.shell().cmd(cmd, cmd_opts(project))
    |> case do
      0 ->
        []
      _ ->
        ["$ #{cmd}"]
    end
  end

  defp cmd_opts(%Project{} = project) do
    if Project.verbose?(project) do
      []
    else
      [quiet: true]
    end
  end

  defp check_app_name!(name, from_app_flag) do
    unless name =~ Regex.recompile!(~r/^[a-z][\w_]*$/) do
      extra =
        if !from_app_flag do
          ". The application name is inferred from the path, if you'd like to " <>
          "explicitly name the application then use the `--app APP` option."
        else
          ""
        end

      Mix.raise "Application name must start with a letter and have only lowercase " <>
                "letters, numbers and underscore, got: #{inspect name}" <> extra
    end
  end

  defp check_module_name_validity!(name) do
    unless inspect(name) =~ Regex.recompile!(~r/^[A-Z]\w*(\.[A-Z]\w*)*$/) do
      Mix.raise "Module name must be a valid Elixir alias (for example: Foo.Bar), got: #{inspect name}"
    end
  end

  defp check_module_name_availability!(name) do
    [name]
    |> Module.concat()
    |> Module.split()
    |> Enum.reduce([], fn name, acc ->
        mod = Module.concat([Elixir, name | acc])
        if Code.ensure_loaded?(mod) do
          Mix.raise "Module name #{inspect mod} is already taken, please choose another name"
        else
          [name | acc]
        end
    end)
  end

  defp check_directory_existence!(path) do
    if File.dir?(path) and not Mix.shell().yes?("The directory #{path} already exists. Are you sure you want to continue?") do
      Mix.raise "Please select another directory for installation."
    end
  end

  defp elixir_version_check! do
    unless Version.match?(System.version(), "~> 1.11") do
      Mix.raise "Phoenix v#{@version} requires at least Elixir v1.11.\n " <>
                "You have #{System.version()}. Please update accordingly"
    end
  end
end
