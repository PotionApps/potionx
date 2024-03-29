defmodule Potionx.Repo do
  @tenant_key_org {:potionx, :organization_id}
  @tenant_key_user {:potionx, :user_id}
  use TypedStruct

  defmodule Pagination do
    typedstruct do
      field :after, :string
      field :before, :string
      field :first, :integer
      field :last, :integer
    end
  end

  defmacro __using__(opts) do
    quote do
      require Ecto.Query
      @scoped_by_organization unquote(opts[:scoped_by_organization]) || []
      @scoped_by_user unquote(opts[:scoped_by_user]) || []

      def default_options(_operation) do
        [org_id: Potionx.Repo.get_org_id(), user_id: Potionx.Repo.get_user_id()]
      end

      def prepare_query(_operation, %{from: %{source: {_, model}}} = query, opts) do
        cond do
          opts[:schema_migration] ->
            {query, opts}
          Enum.member?(@scoped_by_organization, model) and is_nil(opts[:org_id]) ->
            raise "expected organization_id to be set"
          Enum.member?(@scoped_by_user, model) and is_nil(opts[:user_id]) ->
            raise "expected user_id to be set"
          true ->
            [
              {:user_id, @scoped_by_user},
              {:organization_id, @scoped_by_organization}
            ]
            |> Enum.reduce({query, opts}, fn {key, list}, {q, opts} ->
              cond do
                Enum.member?(list, model) ->
                  {
                    q |> Ecto.Query.where(^[{key, opts[key]}]),
                    opts
                  }
                not is_nil(opts[key]) ->
                  {
                    q |> Ecto.Query.where(^[{key, opts[key]}]),
                    opts
                  }
                true ->
                  {q, opts}
              end
            end)
          true ->
            raise "expected org_id or skip_org_id to be set"
        end
      end
      def prepare_query(_operation, q, opts) do
        {q, opts}
      end
      defoverridable([default_options: 1, prepare_query: 3])
    end
  end

  def get_org_id() do
    Process.get(@tenant_key_org)
  end
  def get_user_id() do
    Process.get(@tenant_key_user)
  end

  def put_org_id(org_id) do
    Process.put(@tenant_key_org, org_id)
  end
  def put_user_id(user_id) do
    Process.put(@tenant_key_user, user_id)
  end
end
