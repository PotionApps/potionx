defmodule Mix.Tasks.Local.Potionx do
  use Mix.Task

  @shortdoc "Updates the Phoenix project generator locally"

  @moduledoc """
  Updates the Phoenix project generator locally.

      mix local.phx

  Accepts the same command line options as `archive.install hex potionx_new`.
  """
  def run(args) do
    Mix.Task.run("archive.install", ["hex", "potionx_new" | args])
  end
end
