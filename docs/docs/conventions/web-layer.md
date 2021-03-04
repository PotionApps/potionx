# Web Layer
This layer receives HTTP requests and manages web sockets. It mostly contains [Phoenix's](https://www.phoenixframework.org/) defaults. It communicates with the GraphQL layer via HTTP and Websocket JSON requests.

![architecture](./web-layer.svg)


## Default Routes and Plugs
The following default routes and plugs are added:

```elixir
  pipeline :graphql do
    plug :accepts, ["json"]
    plug Potionx.Plug.ApiAuth, otp_app: :installer_test_twelve
    plug Potionx.Plug.ServiceContext
    plug Potionx.Plug.MaybeDisableIntrospection, [roles: [:admin]]
    # disables GraphQL introspection if user does not have admin role
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug Potionx.Plug.ApiAuth, otp_app: :installer_test_twelve
  end

  pipeline :api_protected do
    plug Pow.Plug.RequireAuthenticated, error_handler: Potionx.Plug.ApiAuthErrorHandler
  end

   scope "/graphql/v1" do
    pipe_through :graphql

    forward "/", Absinthe.Plug,
      schema: SomeProjectGraphQl.Schema
  end


  scope "/api/v1", SomeProjectWeb, as: :api_v1 do
    pipe_through :api

    get "/auth/:provider/new", AuthorizationController, :new
    get "/auth/:provider/callback", AuthorizationController, :callback
    post "/auth/:provider/callback", AuthorizationController, :callback
    get "/session/delete", AuthController, :delete
    post "/session/renew", AuthController, :renew
  end

  scope "/", SomeProjectWeb do
    pipe_through :browser

    get "/*path", AppController, :index
  end
```