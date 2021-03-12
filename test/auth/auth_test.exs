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
    def callback(_config, %{"code" => "valid"}), do: {:ok, %{user: %{"sub" => 1, "name" => "name", "email" => "test@example.com"}, token: %{"access_token" => "access_token"}}}
    def callback(_config, _params), do: {:error, "Invalid params"}

    def url do
      "https://provider.example.com/oauth/authorize"
    end
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
        resolve Potionx.Auth.Assent.resolve([
          strategies: [
            test: [
              strategy: TestProvider
            ]
          ]
        ])
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

    forward "/graphql", to: Absinthe.Plug, init_opts: [schema: Schema]

    post "/auth/:provider/callback" do
      send_resp(conn, 200, "world")
    end
    get "hello" do
      send_resp(conn, 200, "world")
    end
  end


  # need absinthe
  # need redis
  # need conn

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
      assert %{"data" => %{"signInProvider" => %{"url" => ^url}}} =
        conn(:post, "/graphql", %{variables: %{}, query: query})
        |> Router.call(Router.init([]))
        |> sent_resp
        |> elem(2)
        |> Jason.decode!
    end
  end
end
