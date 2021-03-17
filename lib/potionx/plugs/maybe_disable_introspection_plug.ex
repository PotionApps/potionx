defmodule Potionx.Plug.MaybeDisableIntrospection do
  @behaviour Plug
  alias Plug.Conn
  alias Potionx.Context.Service

  @doc false
  def init(config) do
    Keyword.merge(
      [roles: [:admin]],
      config
    )
    |> Enum.into(%{})
  end

  def call(%Plug.Conn{params: %{"query" => q}} = conn, config) do
    if (String.contains?(q, "__schema")) do
      conn
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

  def maybe_refuse(%{assigns: %{context: %Service{roles: roles}}} = conn, %{roles_allowed: roles_allowed}) when is_list(roles) do
    (roles_allowed || [])
    |> Enum.any?(fn role ->
      Enum.member?(roles, role)
    end)
    |> if do
      conn
    else
      conn
      |> Conn.put_status(:forbidden)
      |> Conn.halt
    end
  end
  def maybe_refuse(conn, _) do
    conn
    |> Conn.put_status(:forbidden)
    |> Conn.halt
  end
end
