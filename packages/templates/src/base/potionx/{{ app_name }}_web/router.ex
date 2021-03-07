defmodule <%= web_namespace %>.Router do
  use <%= web_namespace %>, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Potionx.Plug.ApiAuth, otp_app: :<%= app_name %>
    plug Potionx.Plug.MaybeRequireAuth, [
      login_path: "/login",
      public_urls: []
    ]
  end

  pipeline :graphql do
    plug :accepts, ["json"]
    plug Potionx.Plug.ApiAuth, otp_app: :<%= app_name %>
    plug Potionx.Plug.ServiceContext
    if Mix.env() in [:prod] do
      plug Potionx.Plug.MaybeDisableIntrospection, [roles: [:admin]]
    end
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug Potionx.Plug.ApiAuth, otp_app: :<%= app_name %>
  end

  pipeline :api_protected do
    plug Pow.Plug.RequireAuthenticated, error_handler: Potionx.Plug.ApiAuthErrorHandler
  end

  # Other scopes may use custom stacks.
  # scope "/api", <%= web_namespace %> do
  #   pipe_through :api
  # end

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
      live_dashboard "/dashboard", metrics: <%= web_namespace %>.Telemetry
    end
  end

  scope "/graphql/v1" do
    pipe_through :graphql

    forward "/", Absinthe.Plug,
      schema: <%= graphql_namespace %>.Schema
  end


  scope "/api/v1", <%= web_namespace %>, as: :api_v1 do
    pipe_through :api

    get "/auth/:provider/new", AuthorizationController, :new
    get "/auth/:provider/callback", AuthorizationController, :callback
    post "/auth/:provider/callback", AuthorizationController, :callback
    get "/session/delete", AuthController, :delete
    post "/session/renew", AuthController, :renew
  end

  scope "/", <%= web_namespace %> do
    pipe_through :browser

    get "/*path", AppController, :index
  end
end
