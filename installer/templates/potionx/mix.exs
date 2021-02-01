defmodule <%= @app_module %>.MixProject do
  use Mix.Project

  def project do
    [
      app: :<%= @app_name %>,
      version: "0.1.0",<%= if @in_umbrella do %>
      build_path: "../../_build",
      config_path: "../../config/config.exs",
      deps_path: "../../deps",
      lockfile: "../../mix.lock",<% end %>
      elixir: "~> 1.11",
      elixirc_paths: elixirc_paths(Mix.env()),
      compilers: [:phoenix<%= if @gettext do %>, :gettext<% end %>] ++ Mix.compilers(),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {<%= @app_module %>.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:absinthe, "~> 1.6.0", override: true},
      {:absinthe_phoenix, "~> 2.0.0"},
      {:absinthe_plug, "~> 1.5"},
      {:absinthe_relay, "~> 1.5.0"},
      {:castore, "~> 0.1.0"},
      {:dataloader, "~> 1.0.0"},
      {:decimal, "~> 2.0", override: true},
      {:mint, "~> 1.0"},
      {:phoenix, "~> 1.5.7"},
      {:phoenix_ecto, "~> 4.1"},
      {:potionx, "~0.2.3"},
      {:pow, "~> 1.0.21"},
      {:pow_assent, "~> 0.4.10"},
      {:typed_struct, "~> 0.2.1"},
      {:ecto_sql, "~> 3.5"},
      {<%= inspect @adapter_app %>, ">= 0.0.0"},
      {:phoenix_live_view, "~> 0.15.0"},
      {:floki, ">= 0.27.0", only: :test},
      {:phoenix_html, "~> 2.11"},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:phoenix_live_dashboard, "~> 0.4"},
      {:telemetry_metrics, "~> 0.4"},
      {:telemetry_poller, "~> 0.4"},
      {:gettext, "~> 0.11"},
      {:jason, "~> 1.0"},
      {:plug_cowboy, "~> 2.0"}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to install project dependencies and perform other setup tasks, run:
  #
  #     $ mix setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      "build.assets": ["cmd npm run build --prefix frontend/admin"],
      setup: ["deps.get", "ecto.setup"],
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test"]
    ]
  end
end
