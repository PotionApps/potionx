# Social Login

In order to log in, update `config/dev.secret.exs` with the social platform(s) of your choice.
<!-- - [Apple instructions](https://developer.apple.com/documentation/authenticationservices) -->
<!-- - [Github instructions](https://docs.github.com/en/developers/apps/authorizing-oauth-apps) -->
<!-- - [Twitter instructions](https://developer.twitter.com/en/docs/authentication/guides) -->
<!-- - [Google instructions](https://developers.google.com/identity/protocols/oauth2) -->

## Google
Google's instructions can be found [here](https://developers.google.com/identity/protocols/oauth2)

**Steps:**
- Log in or create an account
- Search for "create a project"
- Create a project
- Return to the [main page](https://console.developers.google.com) and select `Credentials` from the left menu
- Select `Create credentials` and choose `OAuth client id`
- (If this is your first time, it will ask your to fill in the `OAuth consent screen` first. Select the user type (External) and click `create`, then repeat the previous step
- Fill out the OAuth form:
  - Select the type
  - Choose a name
  - Authorized Javascript origins: `http://localhost:4000`
  - Authorized redirect URIs: `http:localhost:4000/api/v1/auth/google/callback`
- Click create, and fill in the `google` section of the `dev.secret.exs` file:
  - client_id
  - client_secret

## Microsoft

Microsoft's instructions can be found [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)

**Steps:**
- Log in or create an account
- Follow the steps to [register an application](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#register-an-application)
- Follow the steps to [Add a client secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#add-a-client-secret)
- Fill in the `azure_ad` section of the `dev.secret.exs` file
  - `client_id` is found in your app under `Application (client) ID`
  - `client_secret` is found in Certificates & Secrets under `Client secrets` > `Value`
  - `tenant_id` is found in your app under `Directory (tenant) ID`
- Save and refire `mix phx.server`