defmodule Potionx.Endpoint do
  defmacro __using__(opts) do
    quote do
      def disconnect_socket(fingerprint) do
        %Phoenix.Socket{
          assigns: %{
            session_fingerprint: fingerprint
          }
        }
        |> unquote(opts[:socket]).id
        |> broadcast("disconnect", %{})
      end
      defoverridable([disconnect_socket: 1])
    end
  end
end
