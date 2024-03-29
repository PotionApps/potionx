defmodule <%= appModule %>.MixProject do
  use Mix.Project

  def project do
    [
      app: :<%= appName %>,
      version: "0.1.0",
      elixir: "~> 1.11",
      elixirc_paths: elixirc_paths(Mix.env()),
      compilers: [:phoenix, :gettext] ++ Mix.compilers(),
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
      mod: {<%= appModule %>.Application, []},
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
      {:absinthe_phoenix, "~> 2.0.0"},
      {:absinthe_plug, "~> 1.5"},
      {:absinthe_relay, "~> 1.5.1"},
      {:absinthe, "~> 1.6.0", override: true},
      {:castore, "~> 0.1.0"},
      {:dataloader, "~> 1.0.8"},
      {:decimal, "~> 2.0", override: true},
      {:ecto_network, "~> 1.3.0"},
      {:ecto_sql, "~> 3.5"},
      {:gettext, "~> 0.11"},
      {:jason, "~> 1.0"},
      {:mint, "~> 1.3.0"},
      {:phoenix_ecto, "~> 4.1"},
      {:phoenix_html, "~> 3.2"},
      {:phoenix_live_dashboard, "~> 0.4"},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:phoenix, "~> 1.6.0"},
      {:plug_cowboy, "~> 2.0"},
      {:postgrex, ">= 0.0.0"},
      {:potionx, <%- potionxDep %>},
      {:redix, "~> 1.1.0"},
      {:telemetry_metrics, "~> 0.4"},
      {:telemetry_poller, "~> 0.4"},
      {:typed_struct, "~> 0.2.1"},
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
