defmodule Potionx.Socket do
  defmacro __using__ do
    quote do
      def connect(%{"token" => token} = _params, socket, _) do
        {:ok, app_name} = :application.get_application(__MODULE__)
        %Plug.Conn{secret_key_base: socket.endpoint.config(:secret_key_base)}
        |> ApiAuthPlug.get_credentials(token, [otp_app: app_name])
        |> case do
          nil -> :error

          {user, metadata} ->
            Absinthe.Phoenix.Socket.put_opts(
              socket,
              context: %Potionx.Context.Service{
                session_fingerprint: metadata[:fingerprint],
                user: user
              }
            )
            {:ok, socket}
        end
      end
      def id(%{assigns: %{session_fingerprint: session_fingerprint}}), do: "user:#{session_fingerprint}"

      defoverridable([id: 1, connect: 3])
    end
  end
end
