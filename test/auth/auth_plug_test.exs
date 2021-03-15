defmodule Potionx.Plug.Auth.Test do
  use Potionx.ConnCase
  alias PotionxTest.Router
  alias PotionxTest.RouterAuthRequired
  alias PotionxTest.TestProvider

  describe "Authentication plug test" do
    setup do
      {:ok, %{
        secret_key_base: :crypto.strong_rand_bytes(64) |> Base.encode64 |> binary_part(0, 64)
      }}
    end

    test "Should allow a signed in user access", %{secret_key_base: secret_key_base} do
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
      conn1 =
        conn(:post, "/graphql", %{variables: %{}, query: query})
        |> Map.replace(:secret_key_base, secret_key_base)
        |> Router.call(Router.init([]))

      conn2 =
        conn(:post, "/test")
        |> Map.replace(:secret_key_base, secret_key_base)
      conn2 = Plug.Test.recycle_cookies(conn2, conn1)

     assert {_, _, "ok"} =
        conn2
        |> RouterAuthRequired.call(Router.init([]))
        |> sent_resp
    end
    test "Should block an unknown user" do
      assert %{halted: true, status: 401} =
        conn(:post, "/test")
        |> RouterAuthRequired.call(Router.init([]))
    end
  end
end