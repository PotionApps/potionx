# Deployment
Potionx includes a ```deployment``` folder which contains the recipe for a [Pulumi](https://www.pulumi.com/) deployment to Digital Ocean's Kubernetes service.
Recipes for the other major Kubernestes platforms are planned and the current recipe can be easily adapted to other providers

## Architecture
The recipe generates the following cloud architecture:

## Prerequisites
The following prerequisites are required for a success

### Cloudflare
1. Sign up for Cloudflare if you do not have an account
2. Add a domain that you already own (we recommend [DNSimple](https://dnsimple.com/) or [Hover](https://www.hover.com/) if you need to purchase one)
3. Navigate to [https://dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
4. Create a token that has ```Edit zone DNS``` permissions
5. Save the token somewhere, you'll need it later

### Digital Ocean
1. Sign up to [DigitalOcean](https://digitalocean.com) (you'll need a credit card)
2. Create a token with read/write scope here: [https://cloud.digitalocean.com/account/api/tokens](https://cloud.digitalocean.com/account/api/tokens)
3. Save the token somewhere, you'll need it later

### Github
1. Sign up to Github
2. Set up a repository to push your code to
3. Grab a personal access token here with ```read/write``` permissions for ```packages```: [https://github.com/settings/tokens](https://github.com/settings/tokens)
4. Save the token somewhere, you'll need it later
5. Navigate to your project's actions secrets settings page https://github.com/USERNAME-OR-ORG/PROJECT-NAME/settings/secrets/actions
6. Create a new repository secret called ```CR_PAT``
7. Add your token from step #5 to it

### Pulumi
1. Sign up to Pulumi
2. Select the Kubernetes option
3. Install the Pulumi CLI: [https://www.pulumi.com/docs/get-started/install/](https://www.pulumi.com/docs/get-started/install/)
4. Create a Pulumi access token: [https://app.pulumi.com/account/tokens](https://app.pulumi.com/account/tokens)
5. Save the token somewhere, you'll need it later
6. Back in Github, navigate to your project's actions secrets settings page https://github.com/USERNAME-OR-ORG/PROJECT-NAME/settings/secrets/actions
7. Create a new repository secret called ```PULUMI_TOKEN```
8. Add your token from step #4 or create a new token and add it to the Github secret

## Setting up your Pulumi config
Navigate to your ```deployment``` folder and run the following commands:
```sh
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
pulumi config set --path "authProviders.azureAd.tenantId" YOUR-AZURE-SOCIAL-LOGIN-TENANT-ID --secret
pulumi config set --path "authProviders.google.clientId" YOUR-GOOGLE-SOCIAL-LOGIN-CLIENT-ID --secret
pulumi config set --path "authProviders.google.clientSecret" YOUR-GOOGLE-SOCIAL-LOGIN-CLIENT-SECRET --secret
```
Then, add your Pulumi ```stack``` name to https://github.com/USERNAME-OR-ORG/PROJECT-NAME/settings/secrets/actions in a variable called ```PULUMI_STACK```.

## Push your code to Github
