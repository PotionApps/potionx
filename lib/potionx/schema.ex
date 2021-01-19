defmodule Potionx.Schema do
  defmacro __using__(_) do
    quote do
      use Absinthe.Schema
      import_types Absinthe.Plug.Types

      def middleware(middleware, _field, %{identifier: :mutation}) do
        Enum.concat([
          [
            Potionx.Middleware.ServiceContext,
            Potionx.Middleware.Scope
          ],
          middleware,
          [
              Potionx.Middleware.ChangesetErrors,
              # Potionx.Middleware.Error
          ]
        ])
      end
      def middleware(middleware, _field, %{identifier: :query}) do
        # middleware ++ [Potionx.Error]
        [
          Potionx.Middleware.ServiceContext,
          Potionx.Middleware.Scope
        ] ++ middleware
      end

      def middleware(middleware, _field, _object) do
        middleware
      end
    end
  end
end
