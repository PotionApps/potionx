for path <- :code.get_path,
    Regex.match?(~r/potionx_new\-\d+\.\d+\.\d\/ebin$/, List.to_string(path)) do
  Code.delete_path(path)
end

defmodule Potionx.New.MixProject do
  use Mix.Project

  @version "0.0.14"
  @github_path "potionapps/potionx"
  @url "https://github.com/#{@github_path}"

  def project do
    [
      app: :potionx_new,
      start_permanent: Mix.env() == :prod,
      version: @version,
      elixir: "~> 1.11",
      deps: deps(),
      package: [
        maintainers: [
          "Vince Roy"
        ],
        licenses: ["MIT"],
        links: %{github: @url},
        files: ~w(lib templates mix.exs README.md)
      ],
      source_url: @url,
      docs: docs(),
      homepage_url: "https://www.potionapps.com",
      description: """
      Potionx project generator.

      Provides a `mix potionx.new` task to bootstrap a new Elixir application
      with Phoenix, Absinthe, Pow and Vue dependencies.
      """
    ]
  end

  def application do
    [
      extra_applications: [:eex, :crypto]
    ]
  end

  def deps do
    [
      {:ex_doc, "~> 0.23", only: :dev, runtime: false}
    ]
  end

  defp docs do
    [
      source_url_pattern:
        "https://github.com/#{@github_path}/blob/v#{@version}/installer/%{path}#L%{line}"
    ]
  end
end
