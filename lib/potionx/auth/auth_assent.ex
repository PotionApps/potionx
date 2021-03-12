defmodule Potionx.Auth.Assent do
  @assent Application.get_env(:potionx, :assent)
  @cookie_name "auth_session_token"
  alias Potionx.Context.Service

  @spec before_send(Plug.Conn.t(), Absinthe.Blueprint.t()) :: any
  def before_send(conn, %Absinthe.Blueprint{execution: %{value: %{redirect_uri: r, provider: provider}}}) when not is_nil(r) do
    conn
    |> Plug.Conn.put_resp_cookie(
      @cookie_name,
      Potionx.Auth.sign(
        conn,
        Jason.encode!(%{
          max_age: DateTime.utc_now() |> DateTime.add(5 * 60) |> DateTime.to_unix,
          provider: provider
        })
      ),
      Potionx.Auth.cookie_options(conn, [], 5 * 60) # 5 minutes
    )
  end
  def before_send(conn, _) do
    conn
  end

  def callback(%{}, %{}) do

  end

  def renew() do
    # get renewal
    # delete access and renewal
    # generate new access and new renewal
  end

  def resolve(opts \\ []) do
    fn _parent, %{provider: provider}, %{context: %Service{redirect_uri: redirect_uri}} ->
      redirect_uri = redirect_uri || Keyword.fetch!(@assent || [], :redirect_uri)
      strategies = Keyword.get(opts, :strategies) || @assent[:strategies]

      strategies
      |> Keyword.fetch(String.to_existing_atom(provider))
      |> case do
        {:ok, config} ->
          strategy = Keyword.fetch!(config, :strategy)
          config
          |> Keyword.delete(:strategy)
          |> Keyword.put(:redirect_uri, redirect_uri)
          |> strategy.authorize_url()

          # save state
          # set cookie in before send?
        _ ->
          {:error, "Missing Provider"}
      end
    end
  end
end
