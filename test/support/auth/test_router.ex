defmodule PotionxTest.Router do
  use Plug.Router

  plug Plug.Parsers,
    parsers: [:urlencoded, :json],
    json_decoder: Jason
  plug Potionx.Plug.ServiceContext
  plug Potionx.Plug.Auth,
    session_service: PotionxTest.SessionService
  plug Potionx.Plug.MaybeDisableIntrospection, [roles: [:admin]]
  plug Potionx.Plug.Absinthe
  plug :match
  plug :dispatch

  forward "/graphql",
    init_opts: [
      before_send: {Potionx.Auth.Resolvers, :before_send},
      schema: PotionxTest.Schema
    ],
    to: Absinthe.Plug

  post "/auth/:provider/callback" do
    Potionx.Auth.Resolvers.callback(conn, [
      session_service: PotionxTest.SessionService,
      strategies: [
        test: [
          strategy: Potionx.Auth.Provider.Test
        ]
      ]
    ])
  end
end

defmodule PotionxTest.RouterAuthRequired do
  use Plug.Router

  plug Plug.Parsers,
    parsers: [:urlencoded, :json],
    json_decoder: Jason
  plug Potionx.Plug.ServiceContext
  plug Potionx.Plug.Auth,
    session_service: PotionxTest.SessionService
  plug Potionx.Plug.RequireAuth
  plug Potionx.Plug.Absinthe
  plug :match
  plug :dispatch

  get "/" do
    conn
    |> Plug.Conn.send_resp(200, "ok")
  end

  get "/login" do
    conn
    |> Plug.Conn.send_resp(200, "ok")
  end

  get "/test" do
    conn
    |> Plug.Conn.send_resp(200, "ok")
  end

  post "/test" do
    conn
    |> Plug.Conn.send_resp(200, "ok")
  end
end
