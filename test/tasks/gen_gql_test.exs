Code.require_file "../../installer/test/mix_helper.exs", __DIR__

defmodule Mix.Tasks.Potionx.Gen.GqlForModelTest do
  use ExUnit.Case
  import MixHelper
  alias Mix.Tasks.Potionx.Gen

  defmodule Potionx.Users.User do
    import Ecto.Changeset
    use Ecto.Schema

    schema "users" do
      field :deleted_at, :utc_datetime
      field :email, :string
      field :name_first, :string
      field :name_last, :string
      field :roles, {:array, Ecto.Enum}, values: [:admin, :guest]

      timestamps()
    end

    def changeset(user_or_changeset, attrs) do
      user_or_changeset
      |> cast(attrs, [:name_first, :name_last, :roles])
      |> validate_subset(
        :roles,
        Ecto.Enum.values(__MODULE__, :roles)
      )
    end
  end


  setup do
    Mix.Task.clear()
    :ok
  end

  test "generates graphql-related files for model without JS code", config do
    in_tmp_project config.test, fn path ->
      # schema
      File.mkdir_p!(Path.join(path, "lib/potionx/users"))
      File.mkdir_p!(Path.join(path, "lib/potionx_graphql"))
      File.write!(
        Path.join(path, "lib/potionx_graphql/schema.ex"),
        """
        defmodule Potionx.Schema do
          use Potionx.Schema

          node interface do
            resolve_type fn
              _, _ ->
                nil
            end
          end

          def context(ctx) do
            Map.put(ctx, :loader, dataloader())
          end

          def dataloader do
            Dataloader.new
          end

          query do

          end
          mutation do

          end
          subscription do

          end
        end
        """
      )
      Gen.GqlForModel.run(~w(Users User --no-frontend) ++ [Potionx.Users.User])

      # shared
      # types
      # resolver
      # queries
      # mutations

      assert_file "lib/potionx_graphql/schema.ex", fn file ->
        assert file =~
          "|> Dataloader.add_source(PotionxGraphQl.Resolver.User, PotionxGraphQl.Resolver.User.data())"
        assert file =~ "import_fields :user_queries"
        assert file =~ "import_fields :user_mutations"
        assert file =~ "import_types PotionxGraphQl.Schema.UserMutations"
        assert file =~ "import_types PotionxGraphQl.Schema.UserQueries"
        assert file =~ "import_types PotionxGraphQl.Schema.UserTypes"
      end

      assert_file "shared/src/models/Users/User/user.json", fn file ->
        assert file =~ """
        [
          {
            "name": "deletedAt",
            "type": "utcDatetime",
            "validations": []
          },
          {
            "name": "email",
            "type": "string",
            "validations": []
          },
          {
            "name": "id",
            "type": "id",
            "validations": []
          },
          {
            "name": "nameFirst",
            "type": "string",
            "validations": []
          },
          {
            "name": "nameLast",
            "type": "string",
            "validations": []
          },
          {
            "name": "roles",
            "options": [
              "admin",
              "guest"
            ],
            "type": "checkbox",
            "validations": [
              {
                "name": "roles",
                "params": {
                  "values": [
                    "admin",
                    "guest"
                  ]
                }
              }
            ]
          }
        ]
        """ |> String.trim()
      end

      assert_file "shared/src/models/Users/User/user.mock.json", fn file ->
        assert file =~ """
        "email": "test@example.com",
        """
        assert file =~ """
        "id": "some id",
        """
        assert file =~ """
        "nameFirst": "some name_first",
        """
        assert file =~ """
        "nameLast": "some name_last",
        """
        assert file =~ """
        "roles": [],
        """
      end
      assert_file "shared/src/models/Users/User/userCollection.gql.ts", fn file ->
        assert String.replace(file, ~r(\n|\r|\s), "") =~
          """
          import gql from "../../../gql"
          export default gql`query userCollection(
            $after: String,
            $before: String,
            $first: Int,
            $last: Int,
            $filters: UserFilters
          ) {
            userCollection(
              after: $after,
              before: $before,
              first: $first,
              filters: $filters,
              last: $last
            ) {
              pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
              }
              edges {
                node {
                  deletedAt
                  email
                  id
                  insertedAt
                  nameFirst
                  nameLast
                  roles
                  updatedAt

                }
                cursor
              }
            }
          }`
          """ |> String.replace(~r(\n|\r|\s), "")
      end
      assert_file "shared/src/models/Users/User/userMutation.gql.ts", fn file ->
        assert String.replace(file, ~r(\n|\r|\s), "") =~
          """
          import gql from "../../../gql"
          export default gql`mutation userMutation(
            $changes: UserInput,
            $filters: UserFiltersSingle
          ) {
            userMutation(
              changes: $changes,
              filters: $filters
            ) {
              errors
              errorsFields {
                field
                message
              }
              node {
                deletedAt
                email
                id
                insertedAt
                nameFirst
                nameLast
                roles
                updatedAt

              }
            }
          }`
          """ |> String.replace(~r(\n|\r|\s), "")
      end
      assert_file "shared/src/models/Users/User/userSingle.gql.ts", fn file ->
        assert String.replace(file, ~r(\n|\r|\s), "") =~
          """
          import gql from "../../../gql"
          export default gql`query userSingle(
            $filters: UserFiltersSingle
          ) {
            userSingle(
              filters: $filters
            ) {
              deletedAt
              email
              id
              insertedAt
              nameFirst
              nameLast
              roles
              updatedAt
            }
          }`
          """ |> String.replace(~r(\n|\r|\s), "")
      end
      assert_file "lib/potionx_graphql/resolvers/user_resolver.ex", fn file ->
        assert String.replace(file, ~r(\n|\r|\s), "") =~
          """
          defmodule PotionxGraphQl.Resolver.User do
            alias Potionx.Context.Service
            alias Potionx.Users.UserService
            use Absinthe.Relay.Schema.Notation, :modern

            def collection(args, %{context: %Service{} = ctx}) do
              q = UserService.query(ctx)
              count = UserService.count(ctx)

              q
              |> Absinthe.Relay.Connection.from_query(
                &Potionx.Repo.all/1,
                args
              )
              |> case do
                {:ok, result} ->
                  {:ok, Map.put(result, :count, count)}
                err -> err
              end
            end

            def data do
              Dataloader.Ecto.new(Potionx.Repo, query: &UserService.query/2)
            end

            def delete(_, %{context: %Service{} = ctx}) do
              UserService.delete(ctx)
            end

            def mutation(_, %{context: %Service{} = ctx}) do
              UserService.mutation(ctx)
            end

            def one(_, %{context: %Service{} = ctx}) do
              {:ok, UserService.one(ctx)}
            end
          end

          """ |> String.replace(~r(\n|\r|\s), "")
      end
      assert_file "lib/potionx_graphql/schemas/user/user_mutations.ex", fn file ->
        assert String.replace(file, ~r(\n|\r|\s), "") =~
          """
          defmodule PotionxGraphQl.Schema.UserMutations do
            use Absinthe.Schema.Notation
            alias PotionxGraphQl.Resolver

            object :user_mutations do
              field :user_delete, type: :user_mutation_result do
                arg :filters, :user_filters_single
                middleware Potionx.Middleware.RolesAuthorization, [roles: [:admin]]
                resolve &Resolver.User.delete/2
              end

              field :user_mutation, type: :user_mutation_result do
                arg :changes, :user_input
                arg :filters, :user_filters_single
                middleware Potionx.Middleware.RolesAuthorization, [roles: [:admin]]
                resolve &Resolver.User.mutation/2
              end
            end
          end
          """ |> String.replace(~r(\n|\r|\s), "")
      end
      assert_file "lib/potionx_graphql/schemas/user/user_queries.ex", fn file ->
        assert String.replace(file, ~r(\n|\r|\s), "") =~
          """
          defmodule PotionxGraphQl.Schema.UserQueries do
            use Absinthe.Schema.Notation
            use Absinthe.Relay.Schema.Notation, :modern

            object :user_queries do
              connection field :user_collection, node_type: :user do
                arg :filters, :user_filters
                arg :order, type: :sort_order, default_value: :asc
                middleware Potionx.Middleware.RolesAuthorization, [roles: [:admin]]
                resolve &PotionxGraphQl.Resolver.User.collection/2
              end

              field :user_single, type: :user do
                arg :filters, :user_filters_single
                middleware Potionx.Middleware.RolesAuthorization, [roles: [:admin]]
                resolve &PotionxGraphQl.Resolver.User.one/2
              end
            end
          end
          """ |> String.replace(~r(\n|\r|\s), "")
      end
      assert_file "lib/potionx_graphql/schemas/user/user_types.ex", fn file ->
        assert String.replace(file, ~r(\n|\r|\s), "") =~
          """
          defmodule PotionxGraphQl.Schema.UserTypes do
            use Absinthe.Schema.Notation
            use Absinthe.Relay.Schema.Notation, :modern
            import Absinthe.Resolution.Helpers

            node object :user do
              field :deleted_at, :datetime
              field :email, :string
              field :inserted_at, :naive_datetime
              field :name_first, :string
              field :name_last, :string
              field :roles, list_of(:string)
              field :updated_at, :naive_datetime
            end
            connection node_type: :user do
              field :count, non_null(:integer)
              edge do
              end
            end
            input_object :user_filters do
              field :deleted_at, :datetime
              field :email, :string
              field :inserted_at, :naive_datetime
              field :name_first, :string
              field :name_last, :string
              field :roles, list_of(:string)
              field :updated_at, :naive_datetime
            end
            input_object :user_input do
              field :deleted_at, :datetime
              field :email, :string
              field :inserted_at, :naive_datetime
              field :name_first, :string
              field :name_last, :string
              field :roles, list_of(:string)
              field :updated_at, :naive_datetime
            end
            input_object :user_filters_single do
              field :id, non_null(:global_id)
            end
            object :user_mutation_result do
              field :errors, list_of(:string)
              field :errors_fields, list_of(:error)
              field :node, :user
              field :success_msg, :string
            end
          end
          """ |> String.replace(~r(\n|\r|\s), "")
      end
    end
  end
end
