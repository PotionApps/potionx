defmodule Potionx.Plug.Auth.Test do
  use Potionx.ConnCase
  alias PotionxTest.Router
  alias PotionxTest.RouterAuthRequired
  alias Potionx.Auth.Provider

  describe "Authentication plug test" do
    setup do
      {:ok, %{
        secret_key_base: :crypto.strong_rand_bytes(64) |> Base.encode64 |> binary_part(0, 64)
      }}
    end

    test "Should allow a signed in user access, renew when access token is expired and redirect to home page when trying to access login", %{secret_key_base: secret_key_base} do
      %PotionxTest.User{
        email: Provider.Test.email()
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
        conn(:post, "/auth/test/callback?a=1")
        |> Map.replace(:secret_key_base, secret_key_base)

      conn2 =
        Plug.Test.recycle_cookies(conn2, conn1)
        |> Router.call(Router.init([]))

      conn3 = conn(:post, "/test")
      conn3 = Plug.Test.recycle_cookies(conn3, conn2)

      conn3 =
        conn3
        |> Map.replace(:secret_key_base, secret_key_base)
        |> RouterAuthRequired.call(Router.init([]))

      assert {_, _, "ok"} = sent_resp(conn3)
      assert %{user: %{id: _}} = conn3.assigns.context

      conn4 = conn(:get, "/login")
      conn4 = Plug.Test.recycle_cookies(conn4, conn3)

      conn4 =
        conn4
        |> Map.replace(:secret_key_base, secret_key_base)
        |> RouterAuthRequired.call(Router.init([]))
      assert %{status: 302} = conn4

      conn5 = conn(:get, "/")
      conn5 = Plug.Test.recycle_cookies(conn5, conn4)
      conn5 =
        conn5
        |> Map.put(
          :req_headers,
          Enum.reject(
            conn5.req_headers,
            fn {_, v} ->
              v =~ Potionx.Auth.token_config().access_token.name
            end
          )
        )

      conn5 =
        conn5
        |> Map.replace(:secret_key_base, secret_key_base)
        |> RouterAuthRequired.call(Router.init([]))
      assert Map.get(conn5.resp_cookies, Potionx.Auth.token_config().access_token.name)
      refute conn5.req_cookies["r_app"] === conn5.resp_cookies["r_app"]
      refute conn5.req_cookies["a_app"] === conn5.resp_cookies["a_app"]
    end

    test "Should allow access to login even without a user" do
      assert %{status: 200} =
        conn(:get, "/login")
        |> RouterAuthRequired.call(Router.init([]))
    end

    test "Should block access to non-public hosts without user" do
      assert %{status: 302} =
        conn(:get, "http://bad.potionapps.com/test")
        |> RouterAuthRequired.call(Router.init([]))
      assert %{status: 401} =
        conn(:post, "http://bad.potionapps.com/test")
        |> RouterAuthRequired.call(Router.init([]))
    end

    test "Should block an unknown user" do
      assert %{halted: true, status: 401} =
        conn(:post, "/test")
        |> RouterAuthRequired.call(Router.init([]))
    end

    test "Should redirect to login" do
      assert %{status: 302} =
        conn(:get, "/test")
        |> RouterAuthRequired.call(Router.init([]))
    end
  end
end
