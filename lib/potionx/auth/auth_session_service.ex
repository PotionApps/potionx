defmodule Potionx.Auth.SessionService do
  alias Potionx.Context.Service
  alias Ecto.Multi

  @callback create(Potionx.Context.Service.t()) :: {:ok, struct()} | {:error, map()}
  @callback delete(Potionx.Context.Service.t()) :: {:ok, struct()} | {:error, String.t()}
  @callback one(Potionx.Context.Service.t()) :: struct()
  @callback one_from_cache(Potionx.Context.Service.t()) :: struct() | map() | nil

  # renewal
  # test expiry
  # test redis
  # need to be logged in with original provider to add provider

  defmacro __using__(opts) do
    if !Keyword.get(opts, :identity_service) do
      raise "Potionx.Auth.SessionService requires an identity service"
    end
    if !Keyword.get(opts, :repo) do
      raise "Potionx.Auth.SessionService requires a repo"
    end
    if !Keyword.get(opts, :session_schema) do
      raise "Potionx.Auth.SessionService requires a session schema"
    end
    if is_nil(Keyword.get(opts, :use_redis)) do
      raise "Potionx.Auth.SessionService requires a use_redis setting"
    end
    if !Keyword.get(opts, :user_service) do
      raise "Potionx.Auth.SessionService requires a user service"
    end

    quote do
      @behaviour Potionx.Auth.SessionService
      @repo unquote(opts[:repo])
      @identity_service unquote(opts[:identity_service])
      @session_schema unquote(opts[:session_schema])
      @use_redis unquote(opts[:use_redis])
      @user_service unquote(opts[:user_service])
      import Ecto.Query

      def create(%Service{changes: %{session: _} = changes, filters: filters}) do
        Multi.new
        |> Multi.run(:user, fn _, _ ->
          case changes do
            %{user: %{"email" => email}} ->
              @user_service.one(%Service{filters: %{email: email}})
              |> case do
                nil -> {:error, "user_not_found"}
                user -> {:ok, user}
              end
            _ ->
              {:ok, nil}
          end
        end)
        |> Multi.run(:identity, fn
          _, %{user: %{id: user_id}} ->
            process_identity(changes.identity, user_id)
          _, _ -> {:ok, nil}
        end)
        |> Multi.run(:session, fn _, %{user: user} ->
          struct(@session_schema)
          |> @session_schema.changeset(
            Map.put(
              changes.session,
              :user_id,
              Map.get(user || %{}, :id)
            )
          )
          |> @repo.insert
        end)
        |> Multi.run(:redis, fn _, %{session: session} ->
          if (@use_redis) do
            [{:uuid_access, :ttl_access_seconds}, {:uuid_renewal, :ttl_renewal_seconds}]
            |> Enum.map(fn {key, ttl_key} ->
              Potionx.Redis.put(
                Map.get(session, key),
                Jason.encode(session),
                Map.get(session, ttl_key)
              )
            end)
            |> Potionx.Utils.Ecto.reduce_results
          else
            {:ok, nil}
          end
        end)
        |> @repo.transaction
      end
      def create(%Service{changes: changes} = srv) do
        create(%{
          srv | changes: %{session: changes}
        })
      end

      def delete(%Service{filters: %{id: id}}) do
        Multi.new
        |> Multi.run(:session, fn _, _ ->
          @repo.get(@session_schema, id)
          |> case do
            nil -> {:error, "missing_session"}
            session -> {:ok, session}
          end
        end)
        |> Multi.run(
          :session_delete,
          fn _repo, %{session: session} ->
            session
            |> @session_schema.changeset(%{
              deleted_at: NaiveDateTime.truncate(NaiveDateTime.utc_now, :second)
            })
            |> @repo.update
          end
        )
        |> Multi.run(:redis, fn _, %{session: session} ->
          if (@use_redis) do
            Potionx.Redis.delete(%{model_name: :session, id: session.id})
          else
            {:ok, nil}
          end
        end)
        |> @repo.transaction
      end

      def one(%Service{} = ctx) do
        query(ctx)
        |> preload([:user])
        |> @repo.one
      end

      def one_from_cache(%Service{} = ctx) do
        token = case ctx.filters do
          %{uuid_access: token} -> token
          %{uuid_renewal: token} -> token
        end
        if (@use_redis) do
          Potionx.Redis.get(token)
          |> case do
            {:ok, res} ->
              struct!(@session_schema, Jason.decode!(res, keys: :atoms!))
            _ ->
              nil
          end
        else
          one(ctx)
        end
      end

      def process_identity(changes, user_id) do
        @identity_service.query(%Service{filters: %{user_id: user_id}})
        |> @repo.all
        |> (fn identities ->
          existing_identity =
            Enum.find(identities, fn i -> i.provider === changes["provider"] end)
          cond do 
            Enum.count(identities) === 0 ->
              @identity_service.create(%Service{
                changes: changes |> Map.put("user_id", user_id)
              })
            not is_nil(existing_identity) ->
              {:ok, existing_identity}
            true -> 
              {:error, "invalid_provider"}
          end
        end).()
      end

      def query(%Service{} = ctx) do
        @session_schema
        |> where(
          ^(
            ctx.filters
            |> Map.to_list
          )
        )
        |> order_by([desc: :id])
        |> where([s], is_nil(s.deleted_at))
      end
      def query(q, _args), do: q

      defoverridable(Potionx.Auth.SessionService)
    end
  end
end
