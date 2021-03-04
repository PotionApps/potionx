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

### Pulumi
1. Sign up to Pulumi
2. Select the Kubernetes option
3. Install the Pulumi CLI: [https://www.pulumi.com/docs/get-started/install/](https://www.pulumi.com/docs/get-started/install/)
4. Create a Pulumi access token: [https://app.pulumi.com/account/tokens](https://app.pulumi.com/account/tokens)
5. Save the token somewhere, you'll need it later

## Setting up your Pulumi config
Navigate to your ```deployment``` folder and run the following commands:
```sh
pulumi login # enter your access token from Pulumi step #4 when asked
pulumi stack # Create a new stack when asked
```

## Commit


### Linux
curl -fsSL https://get.pulumi.com | sh
### Mac
brew install pulumi
### Windows
choco install pulumi

## Pick Cloud

### DigitalOcean

#### Mac
```bash
brew install doctl
```

#### Windows
```bash
https://github.com/digitalocean/doctl/releases
doctl-1.57.0-windows-amd64.zip
...add to path

```
Unzip, add to path

```bash
doctl kubernetes cluster kubeconfig save use_your_cluster_name
```

### GKE


### before you start
- Cloudflare account
- Cloudflare Token
- Domain pointing to Cloudflare




- Github account
- Github PAT token
- Digital Ocean account
- Digital Ocean token
- Pulumi account
- Pulumi token


# before you start, need to set up Kubectl

kubectl create namespace cert-manager
helm repo add jetstack https://charts.jetstack.io
helm repo update

helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --version v1.2.0 \
  --create-namespace \
  --set installCRDs=true



### Github
enable improved container support

generate PAT (settings, developer settings)
save PAT in secrets as CR_PAT