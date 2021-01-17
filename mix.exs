defmodule Potionx.MixProject do
  use Mix.Project

  def project do
    [
      app: :potionx,
      version: "0.1.0",
      elixir: "~> 1.11",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:absinthe, "~> 1.6.0", only: :test, override: true},
      {:absinthe_plug, "~> 1.5.2", only: :test},
      {:jason, "~> 1.2"},
      {:plug_cowboy, "~> 2.0"},
      {:pow, "~> 1.0.21"},
      {:pow_assent, "~> 0.4.10"},
      {:typed_struct, "~> 0.2.1"},
      # {:dep_from_hexpm, "~> 0.3.0"},
      # {:dep_from_git, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"}
    ]
  end
end
