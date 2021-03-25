defmodule Potionx.GraphQl.Middleware.ChangesetErrorsTest do
  use Potionx.ConnCase
  alias PotionxTest.Router

  describe "Authentication test" do
    setup do
      {:ok, %{
        secret_key_base: :crypto.strong_rand_bytes(64) |> Base.encode64 |> binary_part(0, 64)
      }}
    end

    test "Should return ecto transaction errors", %{secret_key_base: secret_key_base} do
      query = """
        mutation {
          changesetMiddleware {
            errors
            errorsFields {
              field
              message
            }
          }
        }
      """
      conn(:post, "/graphql", %{variables: %{}, query: query})
      |> Map.replace(:secret_key_base, secret_key_base)
      |> Router.call(Router.init([]))
      |> sent_resp
      |> elem(2)
      |> Jason.decode!
      |> case do
        %{"data" =>  %{"changesetMiddleware" => res}} ->
          assert res["errorsFields"] === [
            %{"field" => "email", "message" => "can't be blank"},
            %{"field" => "name_first", "message" => "can't be blank"}
          ]
      end
    end

  end
end
