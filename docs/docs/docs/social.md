# Social Login
Potionx uses [Pow/Pow Assent](https://github.com/pow-auth/pow_assent) for authentication and authorization. 

To set up the providers of your choice from [Assent](https://github.com/pow-auth/assent), you'll need to edit `config/dev.secret.exs` and `config/runtime.exs` with the appropriate credentials. Included below are instructions for how to do this for the Google and Microsoft (Azure) platforms which are included are strategies by default.

Feel free to remove the Google and Microsoft strategies from: `frontend/admin/src/routes/RouteLogin.tsx`, `config/dev.secret.exs` and `config/runtime.exs` if you don't plan on using them.

**Note: In development mode, a bypass provider is added to log in without the need for a social provider**

## Google
Google's instructions can be found [here](https://developers.google.com/identity/protocols/oauth2)

**Steps:**
1. [Log in or create an account](https://console.developers.google.com)
1. Search for "create a project"
1. Create a project
1. Return to the [main page](https://console.developers.google.com) and select `Credentials` from the left menu
1. Select `Create credentials` and choose `OAuth client id`
1. (If this is your first time, it will ask your to fill in the `OAuth consent screen` first. Select the user type (External) and click `create`, then repeat the previous step
1. Fill out the OAuth form and click create:
  - Select type
  - Choose a name
  - Authorized Javascript origins: `http://localhost:4000`
  - Authorized redirect URIs: `http://localhost:4000/api/v1/auth/google/callback`
1. In your Potionx project, navigate to the `dev.secret.exs` file and fill in the missing `google` fields:
  - client_id
  - client_secret
1. Save and refire `mix phx.server`

## Microsoft

Microsoft's instructions can be found [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)

**Steps:**
1. [Log in or create an account](https://portal.azure.com/)
1. Follow the steps to [register an application](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#register-an-application)
1. Follow the steps to [Add a client secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#add-a-client-secret)
1. In your Potionx project, navigate to the `dev.secret.exs` file and fill in the missing `azure_ad` fields:
  - `client_id` is found in your app under `Application (client) ID`
  - `client_secret` is found in Certificates & Secrets under `Client secrets` > `Value`
  - `tenant_id` is found in your app under `Directory (tenant) ID`
- Save and refire `mix phx.server`

<!-- - [Apple instructions](https://developer.apple.com/documentation/authenticationservices) -->
<!-- - [Github instructions](https://docs.github.com/en/developers/apps/authorizing-oauth-apps) -->
<!-- - [Twitter instructions](https://developer.twitter.com/en/docs/authentication/guides) -->