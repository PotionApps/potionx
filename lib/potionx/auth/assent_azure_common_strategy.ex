defmodule Potionx.Auth.Assent.AzureADCommonStrategy do
    @moduledoc false
    use Assent.Strategy.OIDC.Base

    alias Assent.{Config, Strategy.OIDC}

    @impl true
    def default_config(config) do
      [
        authorization_params: [scope: "email profile", response_mode: "form_post"],
        client_auth_method: :client_secret_post,
        site: "https://login.microsoftonline.com/common/v2.0"
      ]
    end

    @impl true
    def normalize(_config, user), do: {:ok, user}

    @impl true
    def fetch_user(config, token) do
      with {:ok, issuer} <- fetch_iss(token["id_token"], config),
           {:ok, config} <- update_issuer_in_config(config, issuer),
           {:ok, jwt}    <- OIDC.validate_id_token(config, token["id_token"]) do
        Helpers.normalize_userinfo(jwt.claims)
      end
    end

    defp fetch_iss(encoded, config) do
      with [_, encoded, _] <- String.split(encoded, "."),
           {:ok, json}     <- Base.url_decode64(encoded, padding: false),
           {:ok, claims}   <- Config.json_library(config).decode(json) do
        Map.fetch(claims, "iss")
      else
        {:error, error} -> {:error, error}
        _any            -> {:error, "The ID Token is not a valid JWT"}
      end
    end

    defp update_issuer_in_config(config, issuer) do
      openid_configuration = Map.put(config[:openid_configuration], "issuer", issuer)
      {:ok, Keyword.put(config, :openid_configuration, openid_configuration)}
    end
  end
end
