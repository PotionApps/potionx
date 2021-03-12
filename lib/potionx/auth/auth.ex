defmodule Potionx.Auth do
  use TypedStruct
  @salt "user_session"
  alias __MODULE__

  typedstruct do
    field :ttl, :number, enforce: true
  end

  def cookie_options(%Plug.Conn{} = conn, config, max_age \\ nil) do
    max_age = max_age || 30 * 60 # default to 30 minutes
    [
      http_only: true,
      domain: conn.host,
      max_age: max_age,
      secure: conn.scheme === :https,
      same_site: "strict"
    ] ++ (config[:cookie_options] || [])
  end

  @spec sign(Plug.Conn.t() | Phoenix.Socket.t(), String.t | integer) :: binary()
  def sign(conn, id) do
    Phoenix.Token.sign(conn, @salt, id)
  end

  @spec verify(Plug.Conn.t() | Phoenix.Socket.t(), String.t) :: {:error, } | {:ok, String.t}
  def verify(conn, token) do
    %{potionx_auth: %Auth{} = config} = conn.private

    Phoenix.Token.verify(conn, @salt, token, max_age: config.ttl)
  end
end
