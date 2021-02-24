defmodule <%= module_name_graphql %>.Resolver.<%= model_name %> do
  alias <%= potion_name %>.Context.Service
  alias <%= module_name_data %>.<%= context_name %>.<%= model_name %>Service
  use Absinthe.Relay.Schema.Notation, :modern

  def collection(args, %{context: %Service{} = ctx}) do
    q = <%= model_name %>Service.query(ctx)
    count = <%= model_name %>Service.count(ctx)
    count_before =
      cond do
        not is_nil(ctx.pagination.after) ->
          cursor_to_offset(ctx.pagination.after)
        not is_nil(ctx.pagination.before) ->
          count - cursor_to_offset(before) - ctx.pagination.last
        true ->
          0
      end

    q
    |> Absinthe.Relay.Connection.from_query(
      &<%= module_name_data %>.Repo.all/1,
      args
    )
    |> case do
      {:ok, result} ->
        {
          :ok,
          Map.merge(
            result, %{
              count: count,
              count_before: count_before
            }
          )
        }
      err -> err
    end
  end

  def data do
    Dataloader.Ecto.new(<%= module_name_data %>.Repo, query: &<%= model_name %>Service.query/2)
  end

  def delete(_, %{context: %Service{} = ctx}) do
    <%= model_name %>Service.delete(ctx)
  end

  def mutation(_, %{context: %Service{} = ctx}) do
    <%= model_name %>Service.mutation(ctx)
  end

  def one(_, %{context: %Service{} = ctx}) do
    {:ok, <%= model_name %>Service.one(ctx)}
  end
end
