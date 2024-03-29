defmodule Potionx.Auth.Provider.Dev do
  @moduledoc false
  @behaviour Assent.Strategy

  def authorize_url(config) do
    case config[:error] do
      nil   -> {
        :ok, %{
          session_params: %{a: 1},
          url: "/api/v1/auth/dev/callback"
        }
      }
      error -> {:error, error}
    end
  end

  def callback(_config, %{"email" => email}) do
    {
      :ok,
      %{
        token: %{"access_token" => "access_token"},
        user: %{
          "sub" => email,
          "given_name" => String.split(email, "@") |> Enum.at(0),
          "email" => email,
          "family_name" => String.split(email, "@") |> Enum.at(1)
        }
      }
    }
  end
  def callback(_config, _params) do
    {:error, "Invalid params"}
  end
end
