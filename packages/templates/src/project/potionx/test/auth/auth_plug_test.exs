defmodule <%= webNamespace %>.AuthPlugTest do
  use <%= webNamespace %>.ConnCase
  use Plug.Test
  alias Potionx.Auth.Provider

  test "Should allow a signed in user access, renew access and redirect to home page when trying to access login", %{conn: conn} do
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
    conn3 = get(recycle(conn2), "/")
    assert {200, _, _} = sent_resp(conn3)
    assert %{user: %{id: _}} = conn3.assigns.context

    conn4 = get(recycle(conn3), "/login")
    assert %{status: 302} = conn4

    # Test renewal
    conn5 = recycle(conn4)
    conn5 =
      conn5
      |> Map.put(
        :req_headers,
        Enum.reject(
          conn4.req_headers,
          fn {_, v} ->
            v =~ Potionx.Auth.token_config().access_token.name
          end
        )
      )
      |> get("/")

    assert Map.get(conn5.resp_cookies, Potionx.Auth.token_config().access_token.name)
    refute conn5.req_cookies["r_app"] === conn5.resp_cookies["r_app"]
    refute conn5.req_cookies["a_app"] === conn5.resp_cookies["a_app"]
  end

  test "Should allow access to login even without a user", %{conn: conn} do
    assert %{status: 200} =
      get(conn, "/login")
  end

  test "Should redirect to login", %{conn: conn} do
    assert %{status: 302} =
      get(conn, "/test")
  end
end
