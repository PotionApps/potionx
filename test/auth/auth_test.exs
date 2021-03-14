defmodule Potionx.Auth.Test do
  use Potionx.ConnCase
  def redirect_uri, do: "/"

  defmodule TestProvider do
    @moduledoc false
    @behaviour Assent.Strategy

    @impl true
    def authorize_url(config) do
      case config[:error] do
        nil   -> {:ok, %{url: url(), session_params: %{a: 1}}}
        error -> {:error, error}
      end
    end

    @impl true
    def callback(_config, %{"a" => 1}), do: {:ok, %{user: %{"sub" => 1, "name" => "name", "email" => email()}, token: %{"access_token" => "access_token"}}}
    def callback(_config, _params), do: {:error, "Invalid params"}
    
    def email, do: "test@potionapps.com"

    def url do
      "https://provider.example.com/oauth/authorize"
    end
  end

  defmodule User do
    import Ecto.Changeset
    use Ecto.Schema
    use Potionx.Users.User
  
    schema "users" do
      field :deleted_at, :utc_datetime
      field :email, :string
      field :name_first, :string
      field :name_last, :string
      field :roles, {:array, Ecto.Enum}, values: [:admin, :guest]
  
      timestamps()
    end
  end

  defmodule Identity do
    import Ecto.Changeset
    use Ecto.Schema

    schema "user_identities" do
      field :provider, :string
      field :uid, :string
      belongs_to :user, User

      timestamps()
    end

    def changeset(struct, params) do
      Potionx.Auth.Identity.changeset(struct, params)
    end
  end

  defmodule Session do
    use Ecto.Schema
  
    schema "sessions" do
      field :data, :map
      field :deleted_at, :utc_datetime
      field :expires_at, :utc_datetime
      field :ip, EctoNetwork.INET
      field :sign_in_provider, :string
      field :ttl_access_seconds, :integer
      field :ttl_renewal_seconds, :integer
      field :uuid_access, Ecto.UUID
      field :uuid_renewal, Ecto.UUID
      belongs_to :user, User

      timestamps()
    end

    def changeset(struct, params) do
      Potionx.Auth.Session.changeset(struct, params)
    end
  end

  defmodule IdentityService do
    use Potionx.Auth.IdentityService, [
      repo: PotionxTest.Repo,
      identity_schema: Identity
    ]
  end
  defmodule UserService do
    import Ecto.Query
    def one(ctx) do
      query(ctx)
      |> PotionxTest.Repo.one
    end
    def query(ctx) do
      User
      |> where(
        ^(
          ctx.filters
          |> Map.to_list
        )
      )
      |> order_by([desc: :id])
    end
    def query(q, _args), do: q
  end
  defmodule SessionService do
    use Potionx.Auth.SessionService, [
      identity_service: IdentityService,
      repo: PotionxTest.Repo,
      session_schema: Session,
      use_redis: false,
      user_service: UserService
    ]
  end


  defmodule Schema do
    use Absinthe.Schema

    import_types Potionx.Types

    query do
    end

    mutation do
      # def session_renew do
      # end
      # def sign_in_provider do
      # end
      # def sign_out do
      # end
      field :sign_in_provider, type: :sign_in_provider_result do
        arg :provider, non_null(:string)

        middleware fn %{context: context} = res, _ ->
          %{
            res |
              context: %{context | redirect_uri: Potionx.Auth.Test.redirect_uri()}
          }
        end
        resolve Potionx.Auth.Assent.resolve_sign_in([
          session_service: SessionService,
          strategies: [
            test: [
              strategy: TestProvider
            ]
          ]
        ])
        middleware &Potionx.Auth.Assent.middleware_sign_in/2
      end
    end
  end

  defmodule Router do
    use Plug.Router

    plug Plug.Parsers,
      parsers: [:urlencoded, :json],
      json_decoder: Jason
    plug Potionx.Plug.ServiceContext
    plug :match
    plug :dispatch

    forward "/graphql",
      init_opts: [before_send: {Potionx.Auth.Assent, :before_send}, schema: Schema],
      to: Absinthe.Plug

    post "/auth/:provider/callback" do
      Potionx.Auth.Assent.callback(conn, [
        session_service: SessionService,
        strategies: [
          test: [
            strategy: TestProvider
          ]
        ]
      ])
      |> Plug.Conn.send_resp(200, "test")
    end
  end


  describe "Auth Assent" do
    setup do
      {:ok, %{}}
    end

    test "Should return a redirect_uri" do
      query = """
        mutation {
          signInProvider (provider: "test") {
            error
            url
          }
        }
      """
      url = TestProvider.url()
      conn1 =
        conn(:post, "/graphql", %{variables: %{}, query: query})
        |> Router.call(Router.init([]))
      assert %{"data" => %{"signInProvider" => %{"url" => ^url}}} =
        conn1
        |> sent_resp
        |> elem(2)
        |> Jason.decode!
      assert conn1.resp_cookies[Potionx.Auth.token_config().sign_in_token.name]
      assert PotionxTest.Repo.one(Session)
    end

    test "Should return an error" do
      query = """
        mutation {
          signInProvider (provider: "invalid") {
            error
            url
          }
        }
      """
      assert %{"data" => %{"signInProvider" => %{"error" => err}}} =
        conn(:post, "/graphql", %{variables: %{}, query: query})
        |> Router.call(Router.init([]))
        |> sent_resp
        |> elem(2)
        |> Jason.decode!
      assert err
    end

    test "Should sign a user in" do
      %User{
        email: TestProvider.email()
      }
      |> Ecto.Changeset.cast(%{}, [])
      |> PotionxTest.Repo.insert
      query = """
        mutation {
          signInProvider (provider: "test") {
            error
            url
          }
        }
      """
      secret_key_base =  :crypto.strong_rand_bytes(64) |> Base.encode64 |> binary_part(0, 64)
      conn1 =
        conn(:post, "/graphql", %{variables: %{}, query: query})
        |> Map.replace(:secret_key_base, secret_key_base)
        |> Router.call(Router.init([]))

      conn2 =
        conn(:post, "/auth/test/callback")
        |> Map.replace(:secret_key_base, secret_key_base)
      conn2 = Plug.Test.recycle_cookies(conn2, conn1)

      conn2
      |> Router.call(Router.init([]))
      |> (fn res ->
        assert "test" ===
          res
          |> sent_resp
          |> elem(2)
        assert res.resp_cookies[Potionx.Auth.token_config().access_token.name].max_age === 60 * 30 # 30 minutes
        assert res.resp_cookies[Potionx.Auth.token_config().renewal_token.name].max_age === 60 * 60 * 24 * 30 # 30 days
      end).()
    end
  end
end
