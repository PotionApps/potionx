defmodule Potionx.Pow.Provider.Dev do
  @moduledoc false
  @behaviour Assent.Strategy

  @impl true
  def authorize_url(config) do
    case config[:error] do
      nil   -> {
        :ok, %{
          session_params: %{a: 1},
          url: "https://provider.example.com/oauth/authorize"
        }
      }
      error -> {:error, error}
    end
  end

  @impl true
  def callback(_config, %{"code" => "valid", "email" => email}) do
    {
      :ok,
      %{
        token: %{"access_token" => "access_token"},
        user: %{"sub" => 1, "name" => "name", "email" => email}
      }
    }
  end
  def callback(_config, _params), do: {:error, "Invalid params"}
end
