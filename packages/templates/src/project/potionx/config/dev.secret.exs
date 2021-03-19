import Config

# Configure your database
config :<%= appName %>,
  admin_email: "<%= email %>"

config :<%= appName %>, <%= appModule %>.Repo,
  username: "<%= localDbUser %>",
  password: "<%= localDbPassword %>",
  database: "<%= appName %>",
  hostname: "localhost",
  show_sensitive_data_on_connection_error: true,
  pool_size: 10

  
config :potionx,
  auth: [
    strategies: [
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
  ]
