defmodule PotionxTest.Router do
  use Plug.Router

  plug Plug.Parsers,
    parsers: [:urlencoded, :json],
    json_decoder: Jason
  plug Potionx.Plug.ServiceContext
  plug Potionx.Plug.Auth,
    session_optional: true,
    session_service: PotionxTest.SessionService,
    user_optional: true
  plug Potionx.Plug.MaybeDisableIntrospection, [roles: [:admin]]
  plug Potionx.Plug.Absinthe
  plug :match
  plug :dispatch

  forward "/graphql",
    init_opts: [
      before_send: {Potionx.Auth.Assent, :before_send},
      schema: PotionxTest.Schema
    ],
    to: Absinthe.Plug

  post "/auth/:provider/callback" do
    Potionx.Auth.Assent.callback(conn, [
      session_service: PotionxTest.SessionService,
      strategies: [
        test: [
          strategy: PotionxTest.TestProvider
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
    public_hosts: ["www.potionapps.com"],
    session_optional: false,
    session_service: PotionxTest.SessionService
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
