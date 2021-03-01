# Deployment
We are actively working on deployment recipes for [Render.com](https://render.com/) and for Kubernetes providers with [Pulumi](https://www.pulumi.com/)

Step #1: Install Pulumi here: https://www.pulumi.com/docs/get-started/kubernetes/begin/

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