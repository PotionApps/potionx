defmodule <%= module_name_graphql %>.Schema.<%= model_name %>MutationTest do
  use <%= module_name_data %>.DataCase
  alias <%= module_name_data %>.<%= context_name %>.<%= model_name %>Mock
  alias <%= module_name_data %>.<%= context_name %>.<%= model_name %>Service

  describe "<%= model_name_snakecase %> delete" do
    setup do
      ctx = %Potionx.Context.Service{
          changes: <%= model_name %>Mock.run(),
          roles: [:admin]
        }
      {:ok, entry} = <%= model_name %>Service.mutation(ctx)
      {:ok, ctx: ctx, entry: entry}
    end
    test "deletes <%= model_name_snakecase %>", %{ctx: ctx, entry: entry} do
      File.read!("assets/<%= context_name %>/<%= model_name_graphql_case %>/<%= model_name_graphql_case %>Delete.gql")
      |> Absinthe.run(
        context: ctx,
        variables: %{"filters" => %{"id" => entry.id}}
      )
    end
  end

  describe "<%= model_name_snakecase %> new mutation" do
    setup do
      ctx =
        %Potionx.Context.Service{
          changes: <%= model_name %>Mock.run(),
          roles: [:admin]
        }
      {:ok, entry} = <%= model_name %>Service.mutation(ctx)
      {:ok, ctx: ctx, entry: entry}
    end

    test "deletes <%= model_name_snakecase %>", %{ctx: ctx, entry: entry} do
      File.read!("assets/<%= context_name %>/<%= model_name_graphql_case %>/<%= model_name_graphql_case %>Mutation.gql")
      |> Absinthe.run([
        context: ctx,
        variables: %{"id" => entry.id}
      ])
    end
  end

  describe "<%= model_name_snakecase %> invalid mutation/2" do
    setup do
      ctx =
        %Potionx.Context.Service{
          changes: <%= model_name %>Mock.run(),
          roles: [:admin]
        }
      {:ok, ctx: ctx}
    end

    test "invalid <%= model_name_snakecase %> mutation", %{ctx: ctx} do
      File.read!("assets/<%= context_name %>/<%= model_name_graphql_case %>/<%= model_name_graphql_case %>Mutation.gql")
      |> Absinthe.run(
        context: ctx,
        variables: %{}
      )
    end
  end

  describe "<%= model_name_snakecase %> patch mutation/2" do
    setup do
      ctx =
        %Potionx.Context.Service{
          changes: <%= model_name %>Mock.run_patch(),
          roles: [:admin]
        }
      {:ok, entry} = <%= model_name %>Service.mutation(ctx)
      {:ok, ctx, entry: entry}
    end

    test "patches <%= model_name_snakecase %>", %{ctx: ctx, entry: entry} do
      File.read!("assets/<%= context_name %>/<%= model_name_graphql_case %>/<%= model_name_graphql_case %>Mutation.gql")
      |> Absinthe.run(
        context: ctx,
        variables: %{"filters" => %{"id" => entry.id}}
      )
    end
  end
end
