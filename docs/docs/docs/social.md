# Social Login
Potionx uses [Pow/Pow Assent](https://github.com/pow-auth/pow_assent) for authentication and authorization. 

To set up the providers of your choice from [Assent](https://github.com/pow-auth/assent), you'll need to edit `config/dev.secret.exs` with the appropriate credentials. Included below are instructions for how to do this for the Google and Microsoft (Azure) platforms which are included are strategies by default.

You'll have to remove the providers you don't plan on using from: `deployment/index.ts`, `frontend/admin/src/routes/RouteLogin.tsx`, `config/dev.secret.exs` and `config/runtime.exs`.

**Note: In development mode, a bypass provider is added to log in without the need for a social provider**

## Google
Google's instructions can be found [here](https://developers.google.com/identity/protocols/oauth2)

**Steps:**
1. [Log in or create an account](https://console.developers.google.com)
2. Search for "create a project"
3. Create a project
4. Return to the [main page](https://console.developers.google.com) and select `Credentials` from the left menu
5. Select `Create credentials` and choose `OAuth client id`
6. (If this is your first time, it will ask your to fill in the `OAuth consent screen` first. Select the user type (External) and click `create`, then repeat the previous step
7. Fill out the OAuth form and click create:
    - Select type
    - Choose a name
    - Authorized Javascript origins: `http://localhost:4000`
    - Authorized redirect URIs: `http://localhost:4000/api/v1/auth/google/callback`
    - Authorized redirect URIs: `https://YOUR_DOMAIN_URL/api/v1/auth/google/callback` \
    > Don't forget to edit your domain name in the URL provided
8. In your Potionx project, navigate to the `dev.secret.exs` file and fill in the missing `google` fields:
    - client_id
    - client_secret
9. Save and refire `mix phx.server`

## Microsoft

Microsoft's instructions can be found [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)

**Steps:**
1. [Log in or create an account](https://portal.azure.com/)
2. Follow the steps to [register an application](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#register-an-application)
  - Select a name
  - Once it is created, in the left menu select `Authentication` and click `Add platform` and add:
    - `http://localhost:4000/api/v1/auth/azure_ad/callback`
    - `https://YOUR_DOMAIN_URL/api/v1/auth/azure_ad/callback`
    > Don't forget to edit your domain name in the URL provided
3. In your Potionx project, navigate to the `dev.secret.exs` file and fill in the missing `azure_ad` fields:
  - `client_id` is found in your app under `Application (client) ID`
3. Follow the steps to [Add a client secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#add-a-client-secret)
4. In your Potionx project, navigate to the `dev.secret.exs` file and add the secret you just created (`Client secrets` > `Value`)
5. Back in the home dashboard, select `Subscriptions` and select your current subscription (You'll need to set one up if you do not currently have one on your live account)
6. In the left menu, scroll down to `Resource providers` and search for `Microsoft.AzureActiveDirectory`. Select it and press `Register` above the list (Microsoft [instructions](https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-tenant))
7. In the left menu, scroll down to `Resources` and click `Create resource`. Search and select `Azure Active Directory B2C`, and then click `Create`.
8. Select `Create a new Azure AD B2C Tenant` and fill out the fields. Click `Create and review` and then `Create`. It should take a few minutes to confirm in your notifications.
