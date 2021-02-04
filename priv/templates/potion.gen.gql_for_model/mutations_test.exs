defmodule <%= module_name_graphql %>.Schema.<%= model_name %>MutationTest do
  use <%= module_name_data %>.DataCase
  alias <%= module_name_data %>.<%= context_name %>.<%= model_name %>
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
      File.read!("frontend/shared/src/models/<%= context_name %>/<%= model_name_graphql_case %>/<%= model_name_graphql_case %>Delete.gql")
      |> Absinthe.run(
        <%= module_name_graphql %>.Schema,
        context: ctx,
        variables: %{"filters" => %{"id" => entry.id}}
      )
      |> (fn {:ok, res} ->
        assert res.data["<%= model_name_graphql_case %>Delete"]["node"]["id"] ===
          Absinthe.Relay.Node.to_global_id(
            :<%= model_name_snakecase %>,
            entry.id,
            <%= module_name_graphql %>.Schema
          )
       end).()
    end
  end

  describe "<%= model_name_snakecase %> new mutation" do
    setup do
      ctx =
        %Potionx.Context.Service{
          changes: <%= model_name %>Mock.run() |> Map.delete(:id),
          roles: [:admin]
        }
      {:ok, ctx: ctx}
    end

    test "creates <%= model_name_snakecase %>", %{ctx: ctx} do
      File.read!("frontend/shared/src/models/<%= context_name %>/<%= model_name_graphql_case %>/<%= model_name_graphql_case %>Mutation.gql")
      |> Absinthe.run(
        <%= module_name_graphql %>.Schema,
        [
          context: ctx,
          variables: %{
            "changes" => Jason.decode!(Jason.encode!(ctx.changes))
          }
        ]
      )
      |> (fn {:ok, res} ->
        assert res.data["<%= model_name_graphql_case %>Mutation"]["node"]["id"]
      end).()
    end
  end

  describe "<%= model_name_snakecase %> invalid mutation/2" do
    setup do
      ctx =
        %Potionx.Context.Service{
          changes: %{},
          roles: [:admin]
        }
      {:ok, ctx: ctx}
    end

    test "invalid <%= model_name_snakecase %> mutation", %{ctx: ctx} do
      File.read!("frontend/shared/src/models/<%= context_name %>/<%= model_name_graphql_case %>/<%= model_name_graphql_case %>Mutation.gql")
      |> Absinthe.run(
        <%= module_name_graphql %>.Schema,
        context: ctx,
        variables: %{
          "changes" => Jason.decode!(Jason.encode!(ctx.changes))
        }
      )
      |> (fn {:ok, res} ->
        assert res.data["<%= model_name_graphql_case %>Mutation"]["errorsFields"] |> Enum.at(0) |> Map.get("field")
        assert res.data["<%= model_name_graphql_case %>Mutation"]["errorsFields"] |> Enum.at(0) |> Map.get("message")
       end).()
    end
  end

  describe "<%= model_name_snakecase %> patch mutation/2" do
    setup do
      ctx =
        %Potionx.Context.Service{
          changes: <%= model_name %>Mock.run(),
          roles: [:admin]
        }
      required_field =
        <%= model_name %>.changeset(%<%= model_name %>{}, %{})
        |> Map.get(:errors)
        |> Keyword.keys
        |> Enum.at(0)
      {:ok, entry} = <%= model_name %>Service.mutation(ctx)
      {:ok, ctx: ctx, entry: entry, required_field: required_field}
    end

    test "patches <%= model_name_snakecase %>", %{ctx: ctx, entry: entry, required_field: required_field} do
      File.read!("frontend/shared/src/models/<%= context_name %>/<%= model_name_graphql_case %>/<%= model_name_graphql_case %>Mutation.gql")
      |> Absinthe.run(
        <%= module_name_graphql %>.Schema,
        context: ctx,
        variables: %{"filters" => %{"id" => entry.id}}
      )
      |> (fn {:ok, res} ->
        assert res.data["<%= model_name_graphql_case %>Mutation"]["node"]["id"]
        if required_field do
          assert res.data["<%= model_name_graphql_case %>Mutation"]["node"][to_string(required_field)] === <%= model_name %>Mock.run_patch()[required_field]
        end
      end).()
    end
  end
end
