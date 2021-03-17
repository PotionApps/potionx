defmodule Potionx.Auth.IdentityService do
  alias Potionx.Context.Service

  @callback count(Potionx.Context.Service.t()) :: {:ok, struct()} | {:error, map()}
  @callback create(Potionx.Context.Service.t()) :: {:ok, struct()} | {:error, map()}
  @callback delete(Potionx.Context.Service.t()) :: {:ok, struct()} | {:error, map()}
  @callback one(Potionx.Context.Service.t()) :: struct()

  defmacro __using__(opts) do
    if !Keyword.get(opts, :repo) do
      raise "Potionx.Auth.SessionService requires a repo"
    end
    if !Keyword.get(opts, :identity_schema) do
      raise "Potionx.Auth.SessionService requires a session schema"
    end

    quote do
      @behaviour Potionx.Auth.IdentityService
      @identity_schema unquote(opts[:identity_schema])
      @repo unquote(opts[:repo])
      import Ecto.Query

      def count(%Service{} = ctx) do
        from(item in query(ctx))
        |> select([i], count(i.id))
        |> exclude(:order_by)
        |> @repo.one!
      end

      def create(%Service{changes: changes} = srv) do
        struct(@identity_schema, %{})
        |> @identity_schema.changeset(changes)
        |> @repo.insert
      end

      def delete(%Service{} = ctx) do
        query(ctx)
        |> @repo.one
        |> case do
          nil -> {:error, "not_found"}
          entry ->
            entry
            |> @repo.delete
        end
      end

      def one(%Service{} = ctx) do
        query(ctx)
        |> @repo.one
      end
      
      def query(%Service{} = ctx) do
        @identity_schema
        |> where(
          ^(
            ctx.filters
            |> Map.to_list
          )
        )
        |> order_by([desc: :id])
      end
      def query(q, _args), do: q

      defoverridable(Potionx.Auth.IdentityService)
    end
  end
end
