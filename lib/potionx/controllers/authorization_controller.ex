defmodule Potionx.AuthorizationController do
  defmacro __using__(_) do
    quote do
      import Plug.Conn
      alias Plug.Conn
      import Ecto.Query

      def callback(conn, %{"provider" => provider} = params) do
        session_params = %{state: Map.fetch!(params, "state")}
        params         = Map.drop(params, ["provider"])
        config = Pow.Plug.fetch_config(conn)

        conn
        |> Potionx.Plug.PowAssent.init_session
        # |> load_session_params
        |> Conn.put_private(:pow_assent_session_params, session_params)
        |> Conn.put_private(:pow_assent_registration, false) # disable registration
        |> Potionx.Plug.PowAssent.callback_upsert(
          provider,
          params,
          redirect_uri(conn)
        )
        |> case do
          {:ok, conn} ->

            conn
            |> Potionx.Plug.ApiAuth.handle_cookies(
              %{
                access_token: conn.private[:api_access_token],
                renewal_token: conn.private[:api_renewal_token]
              },
              config
            )
            |> Phoenix.Controller.put_layout(false)
            |> render(
              "refresh.html",
              url:
                URI.parse(Conn.request_url(conn))
                |> Map.put(:query, nil)
                |> Map.put(:path, "/")
                |> to_string
            )
          {:error, conn} ->
            conn
            |> redirect(
              to: "/login/error"
            )
        end
      end

      defp load_session_params(%{private: %{pow_assent_session: %{session_params: params}}} = conn) do
        conn
        |> Conn.put_private(:pow_assent_session_params, params)
        |> Potionx.Plug.PowAssent.delete_session(:session_params)
      end
      defp load_session_params(conn), do: conn

      defp maybe_store_session_params(%{private: %{pow_assent_session_params: params}} = conn),
      do: Potionx.Plug.PowAssent.put_session(conn, :session_params, params)
      defp maybe_store_session_params(conn), do: conn

      @spec new(Conn.t(), map()) :: Conn.t()
      def new(conn, %{"provider" => provider}) do
        conn
        |> Potionx.Plug.PowAssent.init_session
        |> Potionx.Plug.PowAssent.authorize_url(provider, redirect_uri(conn))
        |> case do
          {:ok, url, conn} ->
            conn
            |> maybe_store_session_params
            |> json(%{data: %{url: url, session_params: conn.private[:pow_assent_session_params]}})

          {:error, _error, conn} ->
            conn
            |> put_status(500)
            |> json(%{error: %{status: 500, message: "An unexpected error occurred"}})
        end
      end

      defoverridable [callback: 2, new: 2]
    end
  end
end
