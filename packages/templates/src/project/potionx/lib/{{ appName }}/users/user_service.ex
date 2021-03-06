defmodule <%= appModule %>.Users.UserService do
  alias Potionx.Context.Service
  alias <%= appModule %>.Users.User
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
        |> User.changeset(%{})
        |> Ecto.Changeset.put_change(
          :deleted_at,
          DateTime.truncate(DateTime.utc_now, :second)
        )
        |> Repo.update
    end
  end

  def mutation(%Service{filters: %{id: id}} = ctx) when not is_nil(id) do
    query(ctx)
    |> Repo.one
    |> case do
      nil -> {:error, "not_found"}
      entry ->
        User.changeset(entry, ctx.changes)
        |> Repo.update
    end
  end
  def mutation(%Service{} = ctx) do
    %User{}
    |> User.changeset(ctx.changes)
    |> Repo.insert
  end

  def one(%Service{} = ctx) do
    query(ctx)
    |> Repo.one
  end

  def query(%Service{} = ctx) do
    User
    |> where(
      ^(
        ctx.filters
        |> Map.to_list
      )
    )
    |> order_by([desc: :id])
    |> where([u], is_nil(u.deleted_at))
  end
  def query(q, _args), do: q

  def sign_in(%Service{} = ctx) do
    one(ctx)
  end
end
