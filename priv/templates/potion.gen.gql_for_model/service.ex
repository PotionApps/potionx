defmodule <%= module_name_data %>.<%= context_name %>.<%= model_name %>Service do
  alias <%= potion_name %>.Context.Service
  alias <%= module_name_data %>.<%= context_name %>.<%= model_name %>
  alias <%= module_name_data %>.Repo
  import Ecto.Query

  def count(%Service{} = ctx) do
    from(item in query(ctx), select: count(item.id))
    |> Repo.one!
  end

  def delete(%Service{} = ctx) do
    query(ctx)
    |> Repo.one
    |> case do
      nil -> {:error, "not_found"}
      entry ->
        entry
        |> Repo.delete
    end
  end

  def mutation(%Service{filters: %{id: id}} = ctx) when not is_nil(id) do
    query(ctx)
    |> Repo.one
    |> case do
      nil -> {:error, "not_found"}
      entry ->
        <%= model_name %>.changeset(entry, ctx.changes)
        |> Repo.update
    end
  end
  def mutation(%Service{} = ctx) do
    %<%= model_name %>{}
    |> <%= model_name %>.changeset(ctx.changes)
    |> Repo.insert
  end

  def one(%Service{} = ctx) do
    query(ctx)
    |> Repo.one
  end

  def query(%Service{} = ctx) do
    <%= model_name %>
    |> where(
      ^(
        ctx.filters
        |> Map.to_list
      )
    )
  end
  def query(q, _args), do: q
end
