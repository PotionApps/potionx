# Deployment
Potionx includes a `deployment` folder which contains the recipe for a [Pulumi](https://www.pulumi.com/) deployment to Digital Ocean's Kubernetes service.
Recipes for the other major Kubernetes platforms are planned and the current recipe can be easily adapted to other providers.

The recipe is deployed and created updated on every push to Github.

## Architecture
The recipe generates the following cloud architecture:

![architecture](./deployment.svg)

*A non-highly available PostgreSQL setup is used by default, but can easily be swapped out for a HA setup in `deployment/index.ts`.*

## Prerequisites
The following prerequisites are required:

### Cloudflare
1. Sign up/in to Cloudflare
2. Add a domain that you already own (we recommend [DNSimple](https://dnsimple.com/) or [Hover](https://www.hover.com/) if you need to purchase one)
3. If your subdomain will be `www`, remove the `www` type from the DNS management table
4. Copy the `Custom Nameserves` to your domain provider under `custom DNS`
5. Navigate to [https://dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
6. Create a token that has `Edit zone DNS` permissions
7. Save the token somewhere, you'll need it later

### Digital Ocean
1. Sign up/in to [DigitalOcean](https://digitalocean.com) (You'll need a credit card)
2. Create a token with read/write scope here: [https://cloud.digitalocean.com/account/api/tokens](https://cloud.digitalocean.com/account/api/tokens)
3. Save the token somewhere, you'll need it later

### Github
1. Sign up/in to Github
2. Set up a repository to push your code to
3. Grab a personal access token here with `read/write` permissions for `packages`: [https://github.com/settings/tokens](https://github.com/settings/tokens)
4. Save the token somewhere, you'll need it later
5. Navigate to your project's actions secrets settings page https://github.com/USERNAME-OR-ORG/PROJECT-NAME/settings/secrets/actions
6. Create a new repository secret called `CR_PAT`
7. Add your token from step #5 to it
8. Hover the account dropdown on the top right and select "feature preview"
9. Enable `Improved container support`

### Pulumi
1. Sign up/in to Pulumi
2. Create a new project and select the Kubernetes + typescript options
3. Install the Pulumi [CLI](https://www.pulumi.com/docs/get-started/install/)
4. Create a Pulumi [access token](https://app.pulumi.com/account/tokens)
5. Save the token somewhere, you'll need it later
6. Back in Github, navigate to your project's actions secrets settings page https://github.com/USERNAME-OR-ORG/PROJECT-NAME/settings/secrets/actions
7. Create a new repository secret called `PULUMI_TOKEN` and add your Pulumi secret token from step #4

## Setting up your Pulumi config
1. Navigate to your `deployment` folder and run the following commands:

> Don't forget to change the commands with the appropriate information as marked, including the Digital Ocean and Cloudflare tokens

```bash
pulumi login # enter your access token from Pulumi step #4 when asked
pulumi stack # Create a new stack when asked in the format organization-name/stack, where organization-name is your username by default
pulumi config set domain YOUR-DOMAIN --secret # the domain you added to Cloudflare
pulumi config set subdomain YOUR-SUBDOMAIN --secret # www for example
pulumi config set cloudflare:apiToken YOUR-CLOUDFLARE-TOKEN --secret # from step 5 of the Cloudflare set up
pulumi config set digitalocean:token YOUR-DIGITALOCEAN-TOKEN --secret # from step 3 of the DigitalOcean set up
pulumi config set passwordDb A-STRONG-PASSWORD --secret # Choose a very strong password for your database user, mix phx.gen.secret can help
pulumi config set passwordRedis A-STRONG-PASSWORD --secret # Choose a very strong password for your Redis user, mix phx.gen.secret can help
pulumi config set secretKeyBase A-STRONG-PASSWORD --secret # Choose a very strong password for your Redis user, mix phx.gen.secret can help
pulumi config set --path "authProviders.azureAd.clientId" YOUR-AZURE-SOCIAL-LOGIN-CLIENT-ID --secret
pulumi config set --path "authProviders.azureAd.clientSecret" YOUR-AZURE-SOCIAL-LOGIN-CLIENT-SECRET --secret
pulumi config set --path "authProviders.google.clientId" YOUR-GOOGLE-SOCIAL-LOGIN-CLIENT-ID --secret
pulumi config set --path "authProviders.google.clientSecret" YOUR-GOOGLE-SOCIAL-LOGIN-CLIENT-SECRET --secret
```
2. Then, back in Github, add a secret called `PULUMI_STACK` with the value of your Pulumi stack to https://github.com/USERNAME-OR-ORG/PROJECT-NAME/settings/secrets/actions.

> Remember to add the right callback URLs to your authentication providers

## Push your code to Github
Pushing your code to Github will run your tests, build a Docker image for your app and create your deplyoment. Subsequent pushes will update the app image used in your deployment.

Your first deploy may fail due to the certificate manager and certificate issuer being out of sync initially. Simply running the workflow in Github again or pushing again should solve the issue.
The issue is detailed here:
https://cert-manager.io/docs/concepts/webhook/#webhook-connection-problems-shortly-after-cert-manager-installation
