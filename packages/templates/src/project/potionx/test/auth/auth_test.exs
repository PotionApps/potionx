defmodule <%= webNamespace %>.Auth.Test do
  use <%= webNamespace %>.ConnCase
  use Plug.Test
  alias Potionx.Auth.Provider

    test "Blocks introspection", %{conn: conn} do
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
        post(conn, "/graphql/v1", %{variables: %{}, query: query})
    end

    test "Should return a redirect_url", %{conn: conn} do
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
        post(conn, "/graphql/v1", %{variables: %{}, query: query})
        
      assert %{"data" => %{"signInProvider" => %{"url" => ^url}}} =
        conn1
        |> sent_resp
        |> elem(2)
        |> Jason.decode!
      assert conn1.resp_cookies[Potionx.Auth.token_config().sign_in_token.name]
      assert <%= appModule %>.Repo.one(<%= appModule %>.Sessions.Session)
    end

    test "Should return an error", %{conn: conn} do
      query = """
        mutation {
          signInProvider (provider: "invalid") {
            error
            url
          }
        }
      """
      assert %{"data" => %{"signInProvider" => %{"error" => err}}} =
        post(conn, "/graphql/v1", %{variables: %{}, query: query})
        |> json_response(200)
      assert err
    end

    test "Should sign a user in and sign them out", %{conn: conn} do
      %<%= appModule %>.Users.User{
        email: Provider.Test.email()
      }
      |> Ecto.Changeset.cast(%{}, [])
      |> <%= appModule %>.Repo.insert
      query = """
        mutation {
          signInProvider (provider: "test") {
            error
            url
          }
        }
      """
      conn1 =
        post(conn, "/graphql/v1", %{variables: %{}, query: query})

      conn2 = recycle(conn1)
      conn2 =
        post(conn2, "/api/v1/auth/test/callback", %{"a" => "1"})

      conn2
      |> (fn res ->
        assert html_response(res, 200) =~ "refresh"
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
      recycle(conn2)
      |> post("/graphql/v1", %{variables: %{}, query: query})
      |> (fn conn ->
        res = json_response(conn, 200)
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
        assert <%= appModule %>.Sessions.SessionService.one_from_cache(
          %Potionx.Context.Service{filters: %{
            uuid_access: Map.get(conn.cookies, Potionx.Auth.token_config().access_token.name),
            uuid_renewal: Map.get(conn.cookies, Potionx.Auth.token_config().renewal_token.name)
          }}
        ) === nil
      end).()
    end

    test "Should sign a user in with an existing identity", %{conn: conn} do
      user = %<%= appModule %>.Users.User{
        email: Provider.Test.email()
      }
      |> Ecto.Changeset.cast(%{}, [])
      |> <%= appModule %>.Repo.insert!
      %<%= appModule %>.UserIdentities.UserIdentity{
        provider: "test",
        uid: "1",
        user_id: user.id
      }
      |> Ecto.Changeset.cast(%{}, [])
      |> <%= appModule %>.Repo.insert
      query = """
        mutation {
          signInProvider (provider: "test") {
            error
            url
          }
        }
      """
      conn1 =
        post(conn, "/graphql/v1", %{variables: %{}, query: query})

      recycle(conn1)
      |> post("/api/v1/auth/test/callback", %{"a" => "1"})
      |> (fn res ->
        assert html_response(res, 200) =~ "refresh"
        assert res.resp_cookies[Potionx.Auth.token_config().access_token.name].max_age === 60 * 30 # 30 minutes
        assert res.resp_cookies[Potionx.Auth.token_config().renewal_token.name].max_age === 60 * 60 * 24 * 30 # 30 days
      end).()
    end

    test "Sign in should fail for a user that doesn't exist", %{conn: conn} do
      query = """
        mutation {
          signInProvider (provider: "test") {
            error
            url
          }
        }
      """
      conn1 = post(conn, "/graphql/v1", %{variables: %{}, query: query})

      recycle(conn1)
      |> post("/api/v1/auth/test/callback", %{"a" => "1"})
      |> (fn res ->
        assert res.assigns.potionx_auth_error === "user_not_found"
      end).()
    end

    test "Sign in should fail for a user trying to sign in with a different provider", %{conn: conn} do
      user = %<%= appModule %>.Users.User{
        email: Provider.Test.email()
      }
      |> Ecto.Changeset.cast(%{}, [])
      |> <%= appModule %>.Repo.insert!
      %<%= appModule %>.UserIdentities.UserIdentity{
        provider: "other",
        user_id: user.id,
        uid: "1"
      }
      |> Ecto.Changeset.cast(%{}, [])
      |> <%= appModule %>.Repo.insert
      query = """
        mutation {
          signInProvider (provider: "test") {
            error
            url
          }
        }
      """
      conn1 =
        post(conn, "/graphql/v1", %{variables: %{}, query: query})

      recycle(conn1)
      |> post("/api/v1/auth/test/callback", %{"a" => "1"})
      |> (fn res ->
        assert res.assigns.potionx_auth_error === "invalid_provider"
      end).()
    end

  test "Should renew access", %{conn: conn} do
    %<%= appModule %>.Users.User{
      email: Provider.Test.email()
    }
    |> Ecto.Changeset.cast(%{}, [])
    |> <%= appModule %>.Repo.insert
    query = """
      mutation {
        signInProvider (provider: "test") {
          error
          url
        }
      }
    """
    conn1 = post(conn, "/graphql/v1", %{variables: %{}, query: query})
    conn2 = recycle(conn1) |> post("/api/v1/auth/test/callback", %{"a" => "1"})

    query = """
      mutation {
        sessionRenew {
          error
        }
      }
    """

    recycle(conn2)
    |> post("/graphql/v1", %{variables: %{}, query: query})
    |> (fn conn ->
      # check that old cookie is no longer available
      conn = Plug.Conn.fetch_cookies(
        conn,
        signed: [
          Potionx.Auth.token_config().access_token.name,
          Potionx.Auth.token_config().renewal_token.name
        ]
      )
      assert <%= appModule %>.Sessions.SessionService.one_from_cache(
        %Potionx.Context.Service{filters: %{
          uuid_access: Map.get(conn.cookies, Potionx.Auth.token_config().access_token.name),
          uuid_renewal: Map.get(conn.cookies, Potionx.Auth.token_config().renewal_token.name)
        }}
      ) === nil

      assert conn.resp_cookies[Potionx.Auth.token_config().access_token.name] &&
        conn.resp_cookies[Potionx.Auth.token_config().renewal_token.name]
      
      recycle(conn)
      |> post("/graphql/v1")
      |> fetch_cookies([
        signed: [
          Potionx.Auth.token_config().access_token.name,
          Potionx.Auth.token_config().renewal_token.name
        ]
      ])
      |> (fn conn ->
        assert <%= appModule %>.Sessions.SessionService.one_from_cache(
          %Potionx.Context.Service{filters: %{
            uuid_access: Map.get(conn.cookies, Potionx.Auth.token_config().access_token.name),
            uuid_renewal: Map.get(conn.cookies, Potionx.Auth.token_config().renewal_token.name)
          }}
        )
      end).()
    end).()
  end
end