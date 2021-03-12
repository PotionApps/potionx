defmodule Potionx.Auth.SessionService do
  alias Potionx.Context.Service
  alias Ecto.Multi

  @callback delete(Potionx.Context.Service.t()) :: {:ok, struct()} | {:error, String.t()}
  @callback one(Potionx.Context.Service.t()) :: struct()
  @callback one_from_cache(Potionx.Context.Service.t()) :: struct() | map() | nil
  @callback mutation(Potionx.Context.Service.t()) :: {:ok, struct()} | {:error, map()}

  defmacro __using__(opts) do
    if !Keyword.get(opts, :use_redis) do
      raise "Potionx.Auth.session_schemaService requires a use_redis setting"
    end
    if !Keyword.get(opts, :session_schema) do
      raise "Potionx.Auth.session_schemaService requires a session schema"
    end

    quote do
      @behaviour Potionx.Auth.SessionService

      session_schema = unquote(opts[:session_schema])
      use_redis = unquote(opts[:use_redis])

      def delete(%Service{filters: %{id: id}}) do
        Multi.new
        |> Multi.run(:session, fn _, _ ->
          Repo.get(session_schema, id)
          |> case do
            nil -> {:error, "missing_session"}
            session -> {:ok, session}
          end
        end)
        |> Multi.run(
          :session_delete,
          fn _repo, %{session: session} ->
            session
            |> session_schema.changeset(%{
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
        session = id && Repo.get(session_schema, id) || struct(session_schema)
        Multi.new
        |> Multi.run(:session, fn _, _ ->
          session
          |> Repo.insert_or_update
        end)
        |> Multi.run(:redis, fn _, %{session: session} ->
          if (opts[:use_redis]) do
            Potionx.Redis.put(
              %{model_name: :session, id: session.id},
              Jason.encode(session)
            )
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
          |> case do
            {:ok, res} ->
              struct!(session_schema, Jason.decode!(res, keys: :atoms!))
            _ ->
              nil
          end
        else
          one(ctx)
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

      defoverridable(Potionx.Auth.SessionService)
    end
  end
end
