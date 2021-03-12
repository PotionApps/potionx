defmodule Potionx.Auth.SessionService do
  alias Potionx.Context.Service
  alias Ecto.Multi

  def delete(%Service{filters: %{id: id}}) do
    Multi.new
    |> Multi.run(:session, fn _, _ ->
      Repo.get(Session, id)
      |> case do
        nil -> {:error, "missing_session"}
        session -> {:ok, session}
      end
    end)
    |> Multi.run(
      :session_delete,
      fn _repo, %{session: session} ->
        session
        |> Session.changeset(%{
          deleted_at: NaiveDateTime.truncate(NaiveDateTime.utc_now, :second)
        })
        |> Repo.update
      end
    )
    |> Multi.run(:redis, fn _, %{session: session} ->
      if (opts[:use_redis]) do
        Potionx.Redis.delete(%{model_name: :session, id: session.id})
      else
        {:ok, nil}
      end
    end)
    |> Repo.transaction
  end

  def mutation(%Service{changes: changes, filters: filters}) do
    id = Map.get(filters, :id)
    session = id && Repo.get(Session, id) || %Session{}
    Multi.new
    |> Multi.run(:session, fn _, _ ->
      session
      |> Repo.insert_or_update
    end)
    |> Multi.run(:redis, fn _, %{session: session} ->
      if (opts[:use_redis]) do
        Potionx.Redis.put(%{model_name: :session, id: session.id}, Jason.encode(session))
      else 
        {:ok, nil}
      end
    end)
    |> Repo.transaction
  end

  def one(%Service{} = ctx) do
    query(ctx)
    |> Repo.one
  end
  def one_from_cache(%Service{id: id}) do
    if (opts[:use_redis]) do
      Potionx.Redis.get(%{model_name: :session, id: id})
    else
      {:ok, one(ctx)}
    end
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
  end
  def query(q, _args), do: q
end