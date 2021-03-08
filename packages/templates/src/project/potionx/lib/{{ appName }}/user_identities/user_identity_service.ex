defmodule <%= appModule %>.UserIdentities.UserIdentityService do
  alias Potionx.Context.Service
  alias <%= appModule %>.UserIdentities.UserIdentity
  alias <%= appModule %>.Repo
  import Ecto.Query

  def count(%Service{} = ctx) do
    from(item in query(ctx))
    |> select([i], count(i.id))
    |> exclude(:order_by)
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
        UserIdentity.changeset(entry, ctx.changes)
        |> Repo.update
    end
  end
  def mutation(%Service{} = ctx) do
    %UserIdentity{}
    |> UserIdentity.changeset(ctx.changes)
    |> Repo.insert
  end

  def one(%Service{} = ctx) do
    query(ctx)
    |> Repo.one
  end

  def query(%Service{} = ctx) do
    UserIdentity
    |> where(
      ^(
        ctx.filters
        |> Map.to_list
      )
    )
    |> order_by([desc: :id])
  end
  def query(q, _args), do: q
end
