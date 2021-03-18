defmodule Potionx.MixProject do
  use Mix.Project

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:absinthe, "~> 1.6.0", override: true},
      {:absinthe_plug, "~> 1.5.4"},
      {:absinthe_relay, "~> 1.5.0"},
      {:assent, "~> 0.1.23", only: :test},
      {:jason, "~> 1.2"},
      {:plug_cowboy, "~> 2.0"},
      {:redix, "~> 1.0.0"},
      {:typed_struct, "~> 0.2.1"},
      # {:dep_from_hexpm, "~> 0.3.0"},
      # {:dep_from_git, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"},
      {:ecto_network, "~> 1.3.0", only: :test},
      {:ecto_sql, "~> 3.5", only: :test},
      {:ex_doc, "~> 0.22", only: :dev, runtime: false},
      {:phoenix, "~> 1.5.8", only: :test},
      {:postgrex, ">= 0.0.0", only: :test}
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/repo", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  defp package do
    [
      maintainers: ["Vince Roy", "Michael Demchuk"],
      licenses: ["MIT"],
      links: %{github: "https://github.com/PotionApps/potionx"},
      files:
        ~w(lib priv LICENSE.md mix.exs README.md .formatter.exs)
    ]
  end

  def project do
    [
      app: :potionx,
      version: "0.3.0",
      elixir: "~> 1.11",
      elixirc_paths: elixirc_paths(Mix.env()),
      package: package(),
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      homepage_url: "https://www.potionapps.com",
      source_url: "https://github.com/PotionApps/potionx",
      description: """
      Potionx is a set of generators and functions that speeds up the process of setting up and deploying a full-stack application that uses Elixir with GraphQL for the server-side component and Vue for the frontend component.
      """
    ]
  end
end
