defmodule Potionx.Schema do
  defmacro __using__(_) do
    quote do
      use Absinthe.Schema
      use Absinthe.Relay.Schema, :modern
      import_types Absinthe.Plug.Types
      import_types Absinthe.Type.Custom
      import_types Potionx.Types
      import_types Potionx.Types.JSON

      scalar :global_id do
        parse fn
          %{value: v}, ctx ->
            case v do
              s when is_binary(s) ->
                Absinthe.Relay.Node.from_global_id(s, __MODULE__)
                |> case do
                  {:ok, %{id: id}} -> {:ok, id}
                  err -> err
                end
              default ->
                {:ok, default}
            end
          _, _ ->
            {:ok, nil}
        end

        serialize fn input ->
          input
        end
      end

      def middleware(middleware, _field, %{identifier: :mutation}) do
        Enum.concat([
          [
            {Potionx.Middleware.UserRequired, [exceptions: [:sign_in_provider]]},
            Potionx.Middleware.ServiceContext,
            Potionx.Middleware.Scope
          ],
          middleware,
          [
              Potionx.Middleware.ChangesetErrors,
              Potionx.Middleware.Mutation
          ]
        ])
      end
      def middleware(middleware, _field, %{identifier: :query}) do
        [
          Potionx.Middleware.UserRequired,
          Potionx.Middleware.ServiceContext,
          Potionx.Middleware.Scope
        ] ++ middleware
      end

      def middleware(middleware, _field, _object) do
        middleware
      end

      defoverridable([middleware: 3])
    end
  end
end
