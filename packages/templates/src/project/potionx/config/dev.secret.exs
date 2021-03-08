import Config

config :<%= appName %>, :pow_assent,
  providers: [
    azure_ad: [
      client_id: "",
      client_secret: "",
      id_token_signed_response_alg: "RS256",
      strategy: Assent.Strategy.AzureAD,
      tenant_id: ""
    ],
    google: [
      strategy: Assent.Strategy.Google,
      client_id: "",
      client_secret: "",
      authorization_params: [
        access_type: "offline",
        scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
      ]
    ]
  ]
