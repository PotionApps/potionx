defmodule Potionx.Integration.MixProject do
  use Mix.Project

  def project do
    [
      app: :phoenix_integration,
      version: "0.1.0",
      elixir: "~> 1.9",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  def application do
    [
      extra_applications: [:logger]
    ]
  end

  # IMPORTANT: Dependencies are initially compiled with `MIX_ENV=test` and then
  # copied to `_build/dev` to save time. Any dependencies with `only: :dev` set
  # will not be copied.
  defp deps do
    [
      {:potionx_new, path: "../installer"},
      {:potionx, path: "../", override: true},
      {:phoenix_ecto, "~> 4.1"},
      {:ecto_sql, "~> 3.5"},
      {:postgrex, ">= 0.0.0"},
      {:telemetry_metrics, "~> 0.4"},
      {:telemetry_poller, "~> 0.4"},
      {:gettext, "~> 0.11"},
      {:jason, "~> 1.0"},
      {:plug_cowboy, "~> 2.0"}
    ]
  end
end
