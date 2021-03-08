defmodule <%= appModule %>.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      <%= appModule %>.Repo,
      # Start the Telemetry supervisor
      <%= webNamespace %>.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: <%= appModule %>.PubSub},
      # Start the Endpoint (http/https)
      <%= endpointModule %>,
      # Start a worker by calling: <%= appModule %>.Worker.start_link(arg)
      # {<%= appModule %>.Worker, arg}
    ] ++
      if Application.get_env(:<%= appName %>, :env) == :prod do
        [
          {Redix, {Application.get_env(:<%= appName %>, :redix)[:url], [name: :redix]}}
        ]
      else
        []
      end

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: <%= appModule %>.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    <%= endpointModule %>.config_change(changed, removed)
    :ok
  end
end
