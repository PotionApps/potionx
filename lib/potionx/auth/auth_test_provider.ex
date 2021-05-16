defmodule Potionx.Auth.Provider.Test do
  @behaviour Assent.Strategy

  @impl true
  def authorize_url(config) do
    case config[:error] do
      nil   -> {:ok, %{url: url(), session_params: %{a: 1}}}
      error -> {:error, error}
    end
  end

  @impl true
  def callback(_config, %{"a" => "1"}) do
    {
      :ok, %{
        user: %{
          "sub" => 1,
          "name" => "name",
          "email" => email(),
          "family_name" => "family_name",
          "given_name" => "given_name",
          "picture" => "https://lh3.googleusercontent.com/a-/AOh14GhYIvA2AFsxAfXqUm9ZBiEbzwHX0M7qQ0JMzQzV8w=s100-c"
        },
        token: %{"access_token" => "access_token"}
      }
    }
  end
  def callback(_config, _params) do
    {:error, "Invalid params"}
  end

  def email, do: "test@example.com"

  def redirect_url, do: "/"

  def url do
    "https://provider.example.com/oauth/authorize"
  end
end
