defmodule Potionx.Auth.Test do
  use Potionx.ConnCase
  alias PotionxTest.Router
  alias Potionx.Auth.Provider

  describe "Authentication test" do
    setup do
      {:ok, %{
        secret_key_base: :crypto.strong_rand_bytes(64) |> Base.encode64 |> binary_part(0, 64)
      }}
    end

    test "Blocks introspection" do
      query = """
      {
        __schema {
          types {
            name
          }
        }
      }
      """

      assert %{status: 403, halted: true} =
        conn(:post, "/graphql", %{variables: %{}, query: query})
        |> Router.call(Router.init([]))
    end

    test "Should return a redirect_url", %{secret_key_base: secret_key_base} do
      query = """
        mutation {
          signInProvider (provider: "test") {
            error
            url
          }
        }
      """
      url = Provider.Test.url()
      conn1 =
        conn(:post, "/graphql", %{variables: %{}, query: query})
        |> Map.replace(:secret_key_base, secret_key_base)
        |> Router.call(Router.init([]))
      assert %{"data" => %{"signInProvider" => %{"url" => ^url}}} =
        conn1
        |> sent_resp
        |> elem(2)
        |> Jason.decode!
      assert conn1.resp_cookies[Potionx.Auth.token_config().sign_in_token.name]
      assert PotionxTest.Repo.one(PotionxTest.Session)
    end

    test "Should return an error", %{secret_key_base: _secret_key_base} do
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

    test "Should sign a user in and sign them out", %{secret_key_base: secret_key_base} do
      %PotionxTest.User{
        email: Provider.Test.email()
      }
      |> Ecto.Changeset.cast(%{}, [])
      |> PotionxTest.Repo.insert
      query = """
        mutation {
          signInProvider (provider: "test", redirectUrl: "https://potionapps.com/test?buy=1") {
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
      conn2 = Plug.Test.recycle_cookies(conn2, conn1)
      conn2 =
        conn2
        |> Router.call(Router.init([]))
      conn2
      |> (fn res ->
        assert elem(sent_resp(res), 2) =~ "refresh"
        assert elem(sent_resp(res), 2) =~ "URL='https://www.example.com/test?buy=1'"
        assert res.resp_cookies[Potionx.Auth.token_config().frontend.name].http_only === false
        assert res.resp_cookies[Potionx.Auth.token_config().access_token.name].max_age === 60 * 30 # 30 minutes
        assert res.resp_cookies[Potionx.Auth.token_config().renewal_token.name].max_age === 60 * 60 * 24 * 30 # 30 days
      end).()


      query = """
        mutation {
          signOut {
            error
          }
        }
      """
      conn3 =
        conn(:post, "/graphql", %{variables: %{}, query: query})
        |> Map.replace(:secret_key_base, secret_key_base)
      Plug.Test.recycle_cookies(conn3, conn2)
      |> Router.call(Router.init([]))
      |> (fn conn ->
        res =
          conn
          |> sent_resp
          |> elem(2)
          |> Jason.decode!
        assert Enum.all?(Map.values(conn.resp_cookies), &(&1.max_age === 0))
        refute res["data"]["signOut"]["error"]

        # check that old cookie is no longer available
        conn = Plug.Conn.fetch_cookies(
          conn,
          signed: [
            Potionx.Auth.token_config().access_token.name,
            Potionx.Auth.token_config().renewal_token.name
          ]
        )
        assert PotionxTest.SessionService.one_from_cache(
          %Potionx.Context.Service{filters: %{
            uuid_access: Map.get(conn.cookies, Potionx.Auth.token_config().access_token.name),
            uuid_renewal: Map.get(conn.cookies, Potionx.Auth.token_config().renewal_token.name)
          }}
        ) === nil
      end).()
    end

    test "Should sign a user in with an existing identity", %{secret_key_base: _secret_key_base} do
      user = %PotionxTest.User{
        email: Provider.Test.email()
      }
      |> Ecto.Changeset.cast(%{}, [])
      |> PotionxTest.Repo.insert!
      %PotionxTest.Identity{
        provider: "test",
        uid: "1",
        user_id: user.id
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
      secret_key_base = :crypto.strong_rand_bytes(64) |> Base.encode64 |> binary_part(0, 64)
      conn1 =
        conn(:post, "/graphql", %{variables: %{}, query: query})
        |> Map.replace(:secret_key_base, secret_key_base)
        |> Router.call(Router.init([]))

      conn2 =
        conn(:post, "/auth/test/callback?a=1")
        |> Map.replace(:secret_key_base, secret_key_base)
      conn2 = Plug.Test.recycle_cookies(conn2, conn1)

      conn2
      |> Router.call(Router.init([]))
      |> (fn res ->
        assert elem(sent_resp(res), 2) =~ "refresh"
        assert res.resp_cookies[Potionx.Auth.token_config().access_token.name].max_age === 60 * 30 # 30 minutes
        assert res.resp_cookies[Potionx.Auth.token_config().renewal_token.name].max_age === 60 * 60 * 24 * 30 # 30 days
      end).()
    end

    test "Sign in should fail for a user that doesn't exist" do
      query = """
        mutation {
          signInProvider (provider: "test") {
            error
            url
          }
        }
      """
      secret_key_base = :crypto.strong_rand_bytes(64) |> Base.encode64 |> binary_part(0, 64)
      conn1 =
        conn(:post, "/graphql", %{variables: %{}, query: query})
        |> Map.replace(:secret_key_base, secret_key_base)
        |> Router.call(Router.init([]))

      conn2 =
        conn(:post, "/auth/test/callback?a=1")
        |> Map.replace(:secret_key_base, secret_key_base)
      conn2 = Plug.Test.recycle_cookies(conn2, conn1)

      conn2
      |> Router.call(Router.init([]))
      |> (fn res ->
        assert res.assigns.potionx_auth_error === "user_not_found"
        assert elem(sent_resp(res), 2) =~ "login?msg=user_not_found"
      end).()
    end

    test "Sign in should fail for a user trying to sign in with a different provider", %{secret_key_base: _secret_key_base} do
      user = %PotionxTest.User{
        email: Provider.Test.email()
      }
      |> Ecto.Changeset.cast(%{}, [])
      |> PotionxTest.Repo.insert!
      %PotionxTest.Identity{
        provider: "other",
        user_id: user.id,
        uid: "1"
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
      secret_key_base = :crypto.strong_rand_bytes(64) |> Base.encode64 |> binary_part(0, 64)
      conn1 =
        conn(:post, "/graphql", %{variables: %{}, query: query})
        |> Map.replace(:secret_key_base, secret_key_base)
        |> Router.call(Router.init([]))

      conn2 =
        conn(:post, "/auth/test/callback?a=1")
        |> Map.replace(:secret_key_base, secret_key_base)
      conn2 = Plug.Test.recycle_cookies(conn2, conn1)

      conn2
      |> Router.call(Router.init([]))
      |> (fn res ->
        assert res.assigns.potionx_auth_error === "invalid_provider"
      end).()
    end

    test "Should renew access", %{secret_key_base: secret_key_base} do
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
      conn2 = Plug.Test.recycle_cookies(conn2, conn1)

      conn2 =
        conn2
        |> Router.call(Router.init([]))


        query = """
        mutation {
          sessionRenew {
            error
          }
        }
      """
      conn3 =
        conn(:post, "/graphql", %{variables: %{}, query: query})
        |> Map.replace(:secret_key_base, secret_key_base)
      Plug.Test.recycle_cookies(conn3, conn2)
      |> Router.call(Router.init([]))
      |> (fn conn ->
        # check that old cookie is no longer available
        conn = Plug.Conn.fetch_cookies(
          conn,
          signed: [
            Potionx.Auth.token_config().access_token.name,
            Potionx.Auth.token_config().renewal_token.name
          ]
        )
        assert PotionxTest.SessionService.one_from_cache(
          %Potionx.Context.Service{filters: %{
            uuid_access: Map.get(conn.cookies, Potionx.Auth.token_config().access_token.name),
            uuid_renewal: Map.get(conn.cookies, Potionx.Auth.token_config().renewal_token.name)
          }}
        ) === nil

        assert conn.resp_cookies[Potionx.Auth.token_config().access_token.name] &&
          conn.resp_cookies[Potionx.Auth.token_config().renewal_token.name]
        recycle_cookies(conn(:post, "/graphql"), conn)
        |> Map.replace(:secret_key_base, secret_key_base)
        |> fetch_cookies([
          signed: [
            Potionx.Auth.token_config().access_token.name,
            Potionx.Auth.token_config().renewal_token.name
          ]
        ])
        |> (fn conn ->
          assert PotionxTest.SessionService.one_from_cache(
            %Potionx.Context.Service{filters: %{
              uuid_access: Map.get(conn.cookies, Potionx.Auth.token_config().access_token.name),
              uuid_renewal: Map.get(conn.cookies, Potionx.Auth.token_config().renewal_token.name)
            }}
          )
        end).()
      end).()
    end
  end
end
