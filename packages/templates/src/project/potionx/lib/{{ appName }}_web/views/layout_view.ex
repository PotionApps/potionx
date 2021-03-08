defmodule <%= webNamespace %>.LayoutView do
  use <%= webNamespace %>, :view

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
        %{"main.js" => %{"file" => file}} ->
          ["/" <> file]
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
        %{"main.css" => %{"file" => file}} ->
          ["/" <> file]
        _ -> []
      end
    else
      [
      ]
    end
  end
end
