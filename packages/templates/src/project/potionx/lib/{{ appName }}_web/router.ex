defmodule <%= webNamespace %>.Router do
  use <%= webNamespace %>, :router

  get "/_k8s/*path", Potionx.Plug.Health, health_module: <%= appModule %>.Health

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Potionx.Plug.ServiceContext
    plug Potionx.Plug.Auth,
      login_path: "/login",
      public_hosts: [], # www.example.com for example
      session_optional: false,
      session_service: <%= appModule %>.Sessions.SessionService
  end

  pipeline :graphql do
    plug :accepts, ["json"]
    plug Potionx.Plug.ServiceContext
    plug Potionx.Plug.Auth,
      session_optional: true,
      session_service: <%= appModule %>.Sessions.SessionService,
      user_optional: true
    if Mix.env() in [:prod, :test] do
      plug Potionx.Plug.MaybeDisableIntrospection, [roles: [:admin]]
    end
    plug Potionx.Plug.Absinthe
  end

  pipeline :auth_callback do
    plug :accepts, ["json"]
    plug Potionx.Plug.ServiceContext
    plug Potionx.Plug.Auth,
      session_optional: false,
      session_service: <%= appModule %>.Sessions.SessionService,
      user_optional: true
  end

  #
  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through :browser
      live_dashboard "/dashboard", metrics: <%= webNamespace %>.Telemetry
    end
  end

  scope "/graphql/v1" do
    pipe_through :graphql

    forward "/", Absinthe.Plug,
      before_send: {Potionx.Auth.Resolvers, :before_send},
      schema: <%= graphqlNamespace %>.Schema
  end


  scope "/api/v1", as: :api_v1 do
    pipe_through :auth_callback
    get "/auth/:provider/callback",
      Potionx.Auth.Resolvers,
      [
        session_service: <%= appModule %>.Sessions.SessionService
      ]
    post "/auth/:provider/callback",
      Potionx.Auth.Resolvers,
      [
        session_service: <%= appModule %>.Sessions.SessionService
      ]
  end

  scope "/", <%= webNamespace %> do
    pipe_through :browser

    get "/*path", AppController, :index
  end
end
