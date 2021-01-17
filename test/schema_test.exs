defmodule Potionx.Schema.Test do
  use ExUnit.Case
  alias __MODULE__

  defmodule User do
    use Ecto.Schema
    import Ecto
    import Ecto.Changeset

    schema "users" do
      field :test, :string
    end
  end

  defmodule Repo do
    use Potionx.Repo

    def all do

    end

    def mutation do
      {
        :error,
        Ecto.Changeset.cast(%Test.User{}, %{}, [:test])
        |> Ecto.Changeset.validate_required([:test])
      }
    end
  end

  defmodule Users do
    def all do
    end
  end

  defmodule SchemaTest do
    use Absinthe.Schema
    use Potionx.Schema

    object :user do
      field :id, :string
      field :test, :string
    end

    input_object :user_filters do
      field :test, :string
    end

    mutation do
      field :user_mutation, type: :user do
        arg :changes, :user_filters
        resolve fn _, %{context: ctx} ->
          Repo.mutation
        end
      end
    end
    query do
      field :user_many, type: list_of(:user) do
        middleware Potionx.Middleware.RolesAuthorization, [roles: [:admin]]
        arg :filters, :user_filters
        resolve fn _, %{context: ctx} ->
          {:ok, []}
        end
      end
      field :user_single, type: :user do
        arg :filters, :user_filters
        resolve fn _, %{context: ctx} ->
          {:ok, ctx.filters}
        end
      end
    end
    # subscription do
    # end
  end

  describe "test middleware" do
    test "test scope middleware" do
      user_id = 1
      """
      query {
        userSingle(filters: {test: "test"}) {
          id
          test
        }
      }
      """
      |> Absinthe.run(
        SchemaTest,
        [
          context: %Potionx.Context.Service{
            roles: [:author],
            user: %User{
              id: user_id
            }
          }
        ]
      )
      assert Potionx.Repo.get_user_id() === user_id
    end

    test "test service_context middleware" do
      """
      query {
        userSingle(filters: {test: "test"}) {
          id
          test
        }
      }
      """
      |> Absinthe.run(
        SchemaTest,
        [
          context: %Potionx.Context.Service{
            roles: [:author],
            user: %User{
              id: 1
            }
          }
        ]
      )
      |> (fn {:ok, %{data: data}} ->
        assert data["userSingle"]["test"] === "test"
      end).()
    end

    test "test roles middleware" do
      query =
        """
        query {
          userMany(filters: {test: "test"}) {
            id
            test
          }
        }
        """
       Absinthe.run(
        query,
        SchemaTest,
        [
          context: %Potionx.Context.Service{
            roles: [],
            user: %User{
              id: 1
            }
          }
        ]
      )
      |> (fn {:ok, %{errors: [%{message: msg}]}} ->
        assert msg === "unauthorized"
      end).()

      Absinthe.run(
        query,
        SchemaTest,
        [
          context: %Potionx.Context.Service{
            roles: [:admin],
            user: %User{
              id: 1
            }
          }
        ]
      )
      |> (fn {:ok, %{data: data}} ->
        assert not is_nil(data["userMany"])
      end).()
    end

    test "test changeset errors middleware" do
      query =
        """
        mutation {
          userMutation(changes: {test: "test"}) {
            id
            test
          }
        }
        """
       Absinthe.run(
        query,
        SchemaTest,
        [
          context: %Potionx.Context.Service{
            roles: [],
            user: %User{
              id: 1
            }
          }
        ]
      )
      |> (fn {:ok, %{errors: [%{field: field, message: [msg]}]}} ->
        assert msg === "can't be blank"
        assert field === :test
      end).()
    end
  end
end
