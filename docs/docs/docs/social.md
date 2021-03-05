# Social Login

In order to log in, update `config/dev.secret.exs` with the social platform(s) of your choice.

<!-- - [Apple instructions](https://developer.apple.com/documentation/authenticationservices) -->
<!-- - [Github instructions](https://docs.github.com/en/developers/apps/authorizing-oauth-apps) -->
<!-- - [Twitter instructions](https://developer.twitter.com/en/docs/authentication/guides) -->

> We are in the [process](/roadmap.html#social-logins) of adding logins for Apple, Github and Twitter. If you have any requests, let us know on our [Discord](https://discord.gg/sUuDw9Jtxm) or post it to our feedback board on [Hellonext](https://potion.hellonext.co/)

We include them all by default, however, feel free to remove the logins you don't plan on offering in the `frontend/admin/src/routes/RouteLogin.tsx` file under `loginOptions`, so they don't show up when you deploy your project.

## Google
Google's instructions can be found [here](https://developers.google.com/identity/protocols/oauth2)

**Steps:**
- [Log in or create an account](https://console.developers.google.com)
- Search for "create a project"
- Create a project
- Return to the [main page](https://console.developers.google.com) and select `Credentials` from the left menu
- Select `Create credentials` and choose `OAuth client id`
- (If this is your first time, it will ask your to fill in the `OAuth consent screen` first. Select the user type (External) and click `create`, then repeat the previous step
- Fill out the OAuth form and click create:
  - Select type
  - Choose a name
  - Authorized Javascript origins: `http://localhost:4000`
  - Authorized redirect URIs: `http://localhost:4000/api/v1/auth/google/callback`
- In your Potionx project, navigate to the `dev.secret.exs` file and fill in the missing `google` fields:
  - client_id
  - client_secret
- Save and refire `mix phx.server`

## Microsoft

Microsoft's instructions can be found [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)

**Steps:**
- [Log in or create an account](https://portal.azure.com/)
- Follow the steps to [register an application](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#register-an-application)
- Follow the steps to [Add a client secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#add-a-client-secret)
- In your Potionx project, navigate to the `dev.secret.exs` file and fill in the missing `azure_ad` fields:
  - `client_id` is found in your app under `Application (client) ID`
  - `client_secret` is found in Certificates & Secrets under `Client secrets` > `Value`
  - `tenant_id` is found in your app under `Directory (tenant) ID`
- Save and refire `mix phx.server`