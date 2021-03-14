defmodule PotionxTest.Schema do
  use Absinthe.Schema

  import_types Potionx.Types

  query do
  end

  mutation do
    # def session_renew do
    # end
    # def sign_in_provider do
    # end
    # def sign_out do
    # end
    field :sign_in_provider, type: :sign_in_provider_result do
      arg :provider, non_null(:string)

      middleware fn %{context: context} = res, _ ->
        %{
          res |
            context: %{context | redirect_uri: PotionxTest.TestProvider.redirect_uri()}
        }
      end
      resolve Potionx.Auth.Assent.resolve_sign_in([
        session_service: PotionxTest.SessionService,
        strategies: [
          test: [
            strategy: PotionxTest.TestProvider
          ]
        ]
      ])
      middleware &Potionx.Auth.Assent.middleware_sign_in/2
    end
  end
end