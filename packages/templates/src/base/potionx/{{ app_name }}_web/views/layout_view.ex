defmodule <%= web_namespace %>.LayoutView do
  use <%= web_namespace %>, :view

  def metas do
    []
  end

  def scripts do
    if Application.get_env(:<%= app_name %>, :env) == :prod do
      File.read!(
        Path.join(:code.priv_dir(:<%= app_name %>), "static/manifest.json")
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
    if Application.get_env(:<%= app_name %>, :env) == :prod do
      File.read!(
        Path.join(:code.priv_dir(:<%= app_name %>), "static/manifest.json")
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
