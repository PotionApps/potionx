defmodule <%= @web_namespace %>.AuthorizationControllerTest do
  use <%= @web_namespace %>.ConnCase

  @otp_app :<%= @app_name %>

  defmodule TestProvider do
    @moduledoc false
    @behaviour Assent.Strategy

    @impl true
    def authorize_url(config) do
      case config[:error] do
        nil   -> {:ok, %{url: "https://provider.example.com/oauth/authorize", session_params: %{a: 1}}}
        error -> {:error, error}
      end
    end

    @impl true
    def callback(_config, %{"code" => "valid"}), do: {:ok, %{user: %{"sub" => 1, "name" => "name", "email" => "test@example.com"}, token: %{"access_token" => "access_token"}}}
    def callback(_config, _params), do: {:error, "Invalid params"}
  end

  setup do
    Application.put_env(@otp_app, :pow_assent,
      providers: [
        test_provider: [strategy: TestProvider],
        invalid_test_provider: [strategy: TestProvider, error: :invalid]
      ])

    :ok
  end

  describe "new/2" do
    test "with valid config", %{conn: conn} do
      conn = get conn, Routes.api_v1_authorization_path(conn, :new, :test_provider)

      assert json = json_response(conn, 200)
      assert json["data"]["url"] == "https://provider.example.com/oauth/authorize"
      assert json["data"]["session_params"] == %{"a" => 1}
    end

    test "with error", %{conn: conn} do
      conn = get conn, Routes.api_v1_authorization_path(conn, :new, :invalid_test_provider)

      assert json = json_response(conn, 500)
      assert json["error"]["message"] == "An unexpected error occurred"
      assert json["error"]["status"] == 500
    end
  end

  describe "callback/2" do
    @valid_params   %{"code" => "valid", "session_params" => %{"a" => 1}}
    @invalid_params %{"code" => "invalid", "session_params" => %{"a" => 2}}

    setup do
      %<%= @app_module %>.Users.User{
        email: "test@example.com",
        roles: [:admin]
      }
      |> <%= @app_module %>.Users.User.changeset(%{})
      |> <%= @app_module %>.Repo.insert!
      {:ok, []}
    end

    test "with valid params", %{conn: conn} do
      conn = post conn, Routes.api_v1_authorization_path(conn, :callback, :test_provider, @valid_params)

      assert Map.get(conn.cookies, Potionx.ApiAuthPlug.cookie_names([]).access_token)
      assert Map.get(conn.cookies, Potionx.ApiAuthPlug.cookie_names([]).renewal_token)

      assert json = json_response(conn, 200)
      assert json["data"]["access_token"]
    end

    test "with invalid params", %{conn: conn} do
      conn = post conn, Routes.api_v1_authorization_path(conn, :callback, :test_provider, @invalid_params)

      assert json = json_response(conn, 500)
      assert json["error"]["message"] == "An unexpected error occurred"
      assert json["error"]["status"] == 500
    end
  end
end
