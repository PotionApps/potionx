defmodule <%= webNamespace %>.LayoutView do
  use <%= webNamespace %>, :view
  @cdn_url Application.compile_env(:<%= appName %>, <%= webNamespace %>.Endpoint)[:cdn_url]

  def metas do
    []
  end

  def scripts do
    if Application.get_env(:<%= appName %>, :env) == :prod do
      File.read!(
        Path.join(:code.priv_dir(:<%= appName %>), "static/manifest.json")
      )
      |> Jason.decode!
      |> case do
        %{"src/main.ts" => %{"file" => file}} ->
          [@cdn_url <> file]
        _ -> []
      end
    else
      [
        "http://localhost:3000/@vite/client",
        "http://localhost:3000/src/main.ts"
      ]
    end
  end

  def stylesheets do
    if Application.get_env(:<%= appName %>, :env) == :prod do
      File.read!(
        Path.join(:code.priv_dir(:<%= appName %>), "static/manifest.json")
      )
      |> Jason.decode!
      |> case do
        %{"src/main.ts" => %{"css" => css}} ->
          Enum.map(css, fn file ->
            "/" <> file
          end)
        _ -> []
      end
    else
      [
      ]
    end
  end
end
