defmodule PotionxTest.Mutations do
  use Absinthe.Schema.Notation

  object :auth_mutations do
    field :session_renew, type: :sign_in_provider_result do
      resolve Potionx.Auth.Assent.resolve_renew([
        session_service: PotionxTest.SessionService
      ])
      middleware &Potionx.Auth.Assent.middleware_renew/2
    end

    field :sign_out, type: :sign_in_provider_result do
      resolve Potionx.Auth.Assent.resolve_sign_out([
        session_service: PotionxTest.SessionService
      ])
      middleware &Potionx.Auth.Assent.middleware_sign_out/2
    end
    field :sign_in_provider, type: :sign_in_provider_result do
      arg :provider, non_null(:string)
      
      middleware fn %{context: context} = res, _ ->
        %{
          res |
            context: %{
              context |
                redirect_url: Potionx.Auth.Provider.Test.redirect_url()
            }
        }
      end
      resolve Potionx.Auth.Assent.resolve_sign_in([
        session_service: PotionxTest.SessionService,
        strategies: [
          test: [
            strategy: Potionx.Auth.Provider.Test
          ]
        ]
      ])
      middleware &Potionx.Auth.Assent.middleware_sign_in/2
    end
  end
end