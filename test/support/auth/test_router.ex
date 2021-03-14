defmodule PotionxTest.Router do
  use Plug.Router

  plug Plug.Parsers,
    parsers: [:urlencoded, :json],
    json_decoder: Jason
  plug Potionx.Plug.ServiceContext
  plug Potionx.Plug.Auth, auth_optional: true, session_service: PotionxTest.SessionService
  plug Potionx.Plug.Absinthe
  plug :match
  plug :dispatch

  forward "/graphql",
    init_opts: [before_send: {Potionx.Auth.Assent, :before_send}, schema: PotionxTest.Schema],
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
    |> Plug.Conn.send_resp(200, "test")
  end
end