defmodule Potionx.Auth.Test do
  use Potionx.ConnCase
  alias PotionxTest.Router
  alias PotionxTest.TestProvider

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
      assert PotionxTest.Repo.one(PotionxTest.Session)
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
      %PotionxTest.User{
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
