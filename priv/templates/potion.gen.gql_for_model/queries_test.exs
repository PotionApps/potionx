defmodule <%= module_name_graphql %>.Schema.<%= model_name %>QueryTest do
  use <%= module_name_data %>.DataCase
  alias <%= module_name_data %>.<%= context_name %>.<%= model_name %>Mock
  alias <%= module_name_data %>.<%= context_name %>.<%= model_name %>Service

  describe "<%= model_name_snakecase %> collection and single" do
    setup do
      ctx = %Potionx.Context.Service{
          changes: <%= model_name %>Mock.run(),
          roles: [:admin]
        }
      {:ok, entry} = <%= model_name %>Service.mutation(ctx)
      {:ok, ctx: ctx, entry: entry}
    end
    test "returns collection of <%= model_name_snakecase %>", %{ctx: ctx, entry: entry} do
      File.read!("assets/<%= context_name %>/<%= model_name_graphql_case %>/<%= model_name_graphql_case %>Collection.gql")
      |> Absinthe.run(
        [
          context: ctx
        ]
      )
    end
    test "returns single <%= model_name_snakecase %>", %{ctx: ctx, entry: entry} do
      File.read!("assets/<%= context_name %>/<%= model_name_graphql_case %>/<%= model_name_graphql_case %>Single.gql")
      |> Absinthe.run(
        ctx: ctx,
        variables: %{"filters" => %{"id" => entry.id}}
      )
    end
  end
end
