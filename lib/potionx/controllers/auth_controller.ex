defmodule Potionx.AuthController do
  defmacro __using__(opts) do
    endpoint = Keyword.get(opts, :endpoint)

    if !endpoint do
      raise "Potionx.AuthController requires an endpoint to disconnect sockets when access token is deleted"
    end

    quote do
      import Plug.Conn
      @spec create(Conn.t(), map()) :: Conn.t()
      def create(conn, %{"user" => user_params}) do
        conn
        |> Pow.Plug.authenticate_user(user_params)
        |> case do
          {:ok, conn} ->
            json(conn, %{data: %{access_token: conn.private[:api_access_token], renewal_token: conn.private[:api_renewal_token]}})

          {:error, conn} ->
            conn
            |> put_status(401)
            |> json(%{error: %{status: 401, message: "Invalid email or password"}})
        end
      end

      @spec renew(Conn.t(), map()) :: Conn.t()
      def renew(conn, _params) do
        config = Pow.Plug.fetch_config(conn)

        conn
        |> Potionx.Plug.ApiAuth.renew(config)
        |> case do
          {conn, nil} ->
            conn
            |> put_status(401)
            |> json(%{error: %{status: 401, message: "Invalid token"}})

          {conn, _user} ->
            conn
            |> Potionx.Plug.ApiAuth.handle_cookies(
              %{
                access_token: conn.private[:api_access_token],
                renewal_token: conn.private[:api_renewal_token]
              },
              config
            )
            |> json(%{
              data: %{
                access_token: conn.private[:api_access_token]
              }
            })
        end
      end

      @spec delete(Conn.t(), map()) :: Conn.t()
      def delete(conn, _params) do
        conn
        |> Pow.Plug.delete()
        |> (fn conn ->
          unquote(endpoint).disconnect_socket(conn.private[:session_fingerprint])
          conn
          |> json(%{data: %{}})
        end).()
      end
      defoverridable [create: 2, delete: 2, renew: 2]
    end
  end
end
