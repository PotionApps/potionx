defmodule Potionx.AuthorizationController do
  defmacro __using__(_) do
    quote do
      import Plug.Conn
      alias Plug.Conn
      import Ecto.Query

      @spec callback(Conn.t(), map()) :: Conn.t()
      def callback(conn, %{"provider" => provider} = params) do
        session_params = Map.fetch!(params, "session_params")
        params         = Map.drop(params, ["provider", "session_params"])

        conn
        |> Conn.put_private(:pow_assent_session_params, session_params)
        |> Conn.put_private(:pow_assent_registration, false) # disable registration
        |> Potionx.Plug.PowAssent.callback_upsert(provider, params, redirect_uri(conn))
        |> case do
          {:ok, conn} ->
            json(conn, %{data: %{access_token: conn.private[:api_access_token], renewal_token: conn.private[:api_renewal_token]}})

          {:error, conn} ->
            conn
            |> put_status(500)
            |> json(%{error: %{status: 500, message: "An unexpected error occurred"}})
        end
      end

      @spec new(Conn.t(), map()) :: Conn.t()
      def new(conn, %{"provider" => provider}) do
        conn
        |> Potionx.Plug.PowAssent.authorize_url(provider, redirect_uri(conn))
        |> case do
          {:ok, url, conn} ->
            json(conn, %{data: %{url: url, session_params: conn.private[:pow_assent_session_params]}})

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
