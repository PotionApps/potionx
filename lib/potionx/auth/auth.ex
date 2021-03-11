defmodule Potionx.Auth do
  @salt "user_session"
  alias __MODULE__
  
  typedstruct do
    field :ttl, :number, enforce: true
  end

  def create_cookie_for_oauth(email) do
  end

  @spec sign(Plug.Conn | Phoenix.Socket, String.t | integer) :: String.t | integer
  def sign(conn, id) do
    Phoenix.Token.sign(conn, @salt, current_user.id)
  end

  @spec verify(Plug.Conn | Phoenix.Socket, String.t) :: {:error, } | {:ok, String.t}
  def verify(conn, token) do
    %{potionx_auth: %Auth{} = config} = conn.private

    Phoenix.Token.verify(socket, @salt, token, max_age: config.ttl)
  end
end