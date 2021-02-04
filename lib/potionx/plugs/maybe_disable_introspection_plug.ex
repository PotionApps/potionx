defmodule Potionx.Plug.MaybeDisableIntrospection do
  @behaviour Plug
  @moduledoc false
  alias Plug.Conn

  @doc false
  def init(config) do
    Enum.into(%{roles: [:admin]}, config)
  end

  def call(%Plug.Conn{params: %{"query" => q}} = conn, config) do
    if (String.contains?(q, "__schema")) do
      conn
      |> Pow.Plug.current_user()
      |> maybe_refuse(conn, config)
    else
      conn
    end
  end
  def call(conn, _) do
    conn
  end

  def maybe_refuse(nil, conn, _) do
    conn
    |> Conn.put_status(:unauthorized)
    |> Conn.halt
  end

  def maybe_refuse(user, conn, %{roles: roles}) do
    roles
    |> Enum.any?(fn role ->
      Enum.member?(user.roles, role)
    end)
    |> if do
      conn
    else
      conn
      |> Conn.put_status(:forbidden)
      |> Conn.halt
    end
  end
end
