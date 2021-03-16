defmodule <%= webNamespace %>.Router do
  use <%= webNamespace %>, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Potionx.Plug.Auth,
      login_path: "/login",
      public_hosts: [], # www.example.com for example
      session_optional: false,
      session_service: <%= appModule %>.SessionService,
      user_required: true
    # plug Potionx.Plug.ApiAuth, otp_app: :<%= appName %>
    # plug Potionx.Plug.MaybeRequireAuth, [
    #   login_path: "/login",
    #   public_urls: []
    # ]
  end

  pipeline :graphql do
    plug :accepts, ["json"]
    plug Potionx.Plug.Auth,
      session_optional: true,
      session_service:<%= appModule %>.SessionService
    plug Potionx.Plug.ServiceContext
    if Mix.env() in [:prod] do
      plug Potionx.Plug.MaybeDisableIntrospection, [roles: [:admin]]
    end
  end

  pipeline :auth_callback do
    plug :accepts, ["json"]
    plug Potionx.Plug.Auth,
      session_optional: false,
      session_service: <%= appModule %>.SessionService
  end

  pipeline :api_protected do
    plug Pow.Plug.RequireAuthenticated, error_handler: Potionx.Plug.ApiAuthErrorHandler
  end

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
      before_send: {Potionx.Auth.Assent, :before_send},
      schema: <%= graphqlNamespace %>.Schema
  end


  scope "/api/v1", <%= webNamespace %>, as: :api_v1 do
    pipe_through :auth_callback
    post "/auth/:provider/callback" do
      Potionx.Auth.Assent.callback(conn, [
        session_service: <%= appModule %>.Sessions.SessionService
      ])
    end
  end

  scope "/", <%= webNamespace %> do
    pipe_through :browser

    get "/*path", AppController, :index
  end
end
