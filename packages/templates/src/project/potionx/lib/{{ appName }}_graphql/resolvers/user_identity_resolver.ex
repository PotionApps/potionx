defmodule <%= appModule %>GraphQl.Resolver.UserIdentity do
  alias Potionx.Context.Service
  alias <%= appModule %>.UserIdentities.UserIdentityService
  use Absinthe.Relay.Schema.Notation, :modern

  def collection(args, %{context: %Service{} = ctx}) do
    q = UserIdentityService.query(ctx)
    count = UserIdentityService.count(ctx)
    count_before = get_count_before(ctx, count)

    q
    |> Absinthe.Relay.Connection.from_query(
      &<%= appModule %>.Repo.all/1,
      ensure_first_page_is_full(args),
      [count: count]
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
    Dataloader.Ecto.new(<%= appModule %>.Repo, query: &UserIdentityService.query/2)
  end

  def delete(_, %{context: %Service{} = ctx}) do
    UserIdentityService.delete(ctx)
  end

  def ensure_first_page_is_full(args) do
    if Map.get(args, :before) do
      Absinthe.Relay.Connection.cursor_to_offset(args.before)
      |> elem(1)
      |> Kernel.<(args.last)
      |> if do
        %{
          first: args.last
        }
      else
        args
      end
    else
      args
    end
  end

  def get_count_before(ctx, count) do
    cond do
      not is_nil(ctx.pagination.after) ->
        Absinthe.Relay.Connection.cursor_to_offset(ctx.pagination.after)
        |> elem(1)
      not is_nil(ctx.pagination.before) ->
        Absinthe.Relay.Connection.cursor_to_offset(ctx.pagination.before)
        |> elem(1)
        |> Kernel.-(ctx.pagination.last)
        |> max(0)
      not is_nil(ctx.pagination.last) ->
        count - ctx.pagination.last
      true ->
        0
    end
  end

  def one(_, %{context: %Service{} = ctx}) do
    {:ok, UserIdentityService.one(ctx)}
  end
end
