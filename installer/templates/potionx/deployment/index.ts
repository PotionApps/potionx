// Copyright 2016-2018, Pulumi Corporation.  All rights reserved.
import * as cloudflare from '@pulumi/cloudflare'
import * as digitalocean from "@pulumi/digitalocean";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

//
// Install Helm?
// https://helm.sh/
///
// install doctl or other
// doctl auth init
// doctl kubernetes cluster kubeconfig
// doctl kubernetes cluster kubeconfig save potionx-do
// Install pulumi
// pulumi login --local
// pulumi stack init <NAME>
// pulumi config set digitalocean:token <YOUR_TOKEN_HERE> --secret
// pulumi config set cloudflare:apiToken <token> --secret
// pulumi config set subdomain <YOUR_SUBDOMAIN_NAME> (optional)
// pulumi config set domain <YOUR_DOMAIN_NAME> (optional)
// pulumi up
// # wait a while (20+mins)
// kubectl get pods --namespace cert-manager
// handle email

// Enable some configurable parameters.
const appNamespace = (s: string) => "<%= @app_name %>" + s
const config = new pulumi.Config();
const appReplicaCount = config.getNumber("appReplicaCount") || 1;
const cloudflareConfig = new pulumi.Config('cloudflare')
const cloudflareApiToken = cloudflareConfig.require("apiToken");
const domain = config.require("domain");
const subdomain = config.get("subdomain") || "www";
const hostname = subdomain + "." + domain
const nodeCount = config.getNumber("nodeCount") || 2;
const tlsSecretName = appNamespace('cert')



/**
 * ==============================
 * Provider-specific Config
 * ================================
 */

// Provision a DigitalOcean Kubernetes cluster and export its resulting
// kubeconfig to make it easy to access from the kubectl command line.
const cluster = new digitalocean.KubernetesCluster(appNamespace('cluster'), {
    name: appNamespace('cluster'),
    region: digitalocean.Regions.NYC3,
    version: digitalocean.getKubernetesVersions().then(p => p.latestVersion),
    nodePool: {
        name: "default",
        size: digitalocean.DropletSlugs.DropletS1VCPU2GB, // 1 vCPU + 2GB RAM is minimum allowed
        nodeCount: nodeCount
    },
});

// The DigitalOcean Kubernetes cluster periodically gets a new certificate,
// so we look up the cluster by name and get the current kubeconfig after
// initial provisioning. You'll notice that the `certificate-authority-data`
// field changes on every `pulumi update`.
const kubeconfig = cluster.status.apply(status => {
    if (status === "running") {
        const clusterDataSource = cluster.name.apply(name => digitalocean.getKubernetesCluster({name}));
        return clusterDataSource.kubeConfigs[0].rawConfig;
    } else {
        return cluster.kubeConfigs[0].rawConfig;
    }
});

// Now lets actually deploy an application to our new cluster. We begin
// by creating a new "Provider" object that uses our kubeconfig above,
// so that any application objects deployed go to our new cluster.
const provider = new k8s.Provider(appNamespace('k8s'), { kubeconfig });


/**
 * ===============================
 * CERT MANAGEMENT
 * ================================
 */

// certManager namespace
const certManagerNamespace = new k8s.core.v1.Namespace('cert-manager', {
    metadata: { 
        name: 'cert-manager'
    }
}, { provider })

const certManager = new k8s.helm.v3.Chart("cert-manager", {
  chart: "cert-manager",
  fetchOpts: {
    repo: 'https://charts.jetstack.io'
  },
  namespace: certManagerNamespace.metadata.name,
  version: "v1.2.0",
  values: {
    installCRDs: true
  },
}, { provider });

const dnsSecret = new k8s.core.v1.Secret(
    'cloudflare-api-token-secret',
    {
        metadata: {
            name: 'cloudflare-api-token-secret',
            namespace: certManagerNamespace.metadata.name
        },
        stringData: {
            apiToken: cloudflareApiToken
        },
        type: 'opaque'
    },
    {
        provider
    }
)

// name: letsencrypt-prod
const certManagerIssuer = new k8s.yaml.ConfigFile(
    appNamespace('cert-issuer'),
    {
        file: "certIssuer.yaml"
    },
    { provider }
);

/**
 * ================================
 * Secrets for Postgres and Redis
 * ================================
*/
const dbSecrets = new k8s.core.v1.Secret(
    'db-secrets',
    {
        metadata: {
            name: 'db-secrets'
        },
        stringData: {
            'redis-password': "AIWv1mw3Za1kp4uFTLMmykHG0T9xkhoZB2YqZXRY",
            'postgresql-password': "r3MCR8M1L4TlsG2Vrqr62CEevZ8TYp",
            'postgresql-replication-password': "W2LQbT44D1ahZx5sXyDh5USWzRS8NZ",
            'postgresql-ldap-password': "TvfTamLRL16GsXrKz2OuSmnTeyiBiA"
        },
        type: 'opaque'
    },
    {
        provider
    }
)


/**
 * ================================
 * Postgres
 * ================================
 */

const postgres = new k8s.helm.v3.Chart("postgresql", {
    chart: "postgresql",
    fetchOpts: {
      repo: 'https://charts.bitnami.com/bitnami'
    },
    values: {
        existingSecret: 'db-secrets',
        'image.tag': '13.2.0' 
    },
  }, { provider });

  
 /**
  * ================================
 * Redis
 * ================================
 */
const redis = new k8s.helm.v3.Chart("redis", {
    chart: "redis",
    fetchOpts: {
      repo: 'https://charts.bitnami.com/bitnami'
    },
    values: {
        existingSecret: 'db-secrets',
        existingSecretPasswordKey: 'redis-password',
        'image.tag': '12.8.1' 
    },
  }, { provider })



  /**
 * ================================
 * Networking
 * ================================
 */

// Now create a Kubernetes Deployment using the "nginx" container
// image from the Docker Hub, replicated a number of times, and a
// load balanced Service in front listening for traffic on port 80.
const appLabels = { "app": "app-nginx" };
const app = new k8s.apps.v1.Deployment(appNamespace("dep"), {
    spec: {
        selector: { matchLabels: appLabels },
        replicas: appReplicaCount,
        template: {
            metadata: { labels: appLabels },
            spec: {
                containers: [{
                    name: "nginx",
                    image: "nginx",
                }],
            },
        },
    },
}, { provider });
const appService = new k8s.core.v1.Service(appNamespace("service"), {
    spec: {
        type: "ClusterIP",
        selector: app.spec.template.metadata.labels,
        ports: [{ port: 80 }],
    },
}, { provider });
const appIngress = new k8s.networking.v1.Ingress(appNamespace("ingress"), {
    kind: "Ingress",
    metadata: {
        annotations: {
        // add an annotation indicating the issuer to use.
            "kubernetes.io/ingress.class": "nginx",
            "cert-manager.io/cluster-issuer": 'letsencrypt-prod'
        }
    },
    spec: {
        rules: [
            {
                host: hostname,
                http: {
                    paths: [
                        {
                            backend: {
                                service: {
                                    name: appService.metadata.name,
                                    port: {
                                        number: 80
                                    }
                                }
                            },
                            path: "/",
                            pathType: "Prefix"
                        }
                    ]
                }
            }
        ],
        tls: [
        {
            hosts: [hostname],
            secretName: tlsSecretName
        }
        ] // < placing a host in the TLS config will indicate a certificate should be created
    }
}, { provider });

// Deploy the NGINX ingress controller using the Helm chart.
const nginxIngress = new k8s.helm.v3.Chart("ingress-nginx",
    {
        chart: "ingress-nginx",
        fetchOpts: {repo: "https://kubernetes.github.io/ingress-nginx"},
        values: {controller: {publishService: {enabled: true}}}
    },
    { provider }
);


/**
 * ================================
 * DNS
 * ================================
*/

export const appIp = nginxIngress.getResourceProperty('v1/Service', 'ingress-nginx-controller', 'status')
    .apply(status => {
        return status.loadBalancer.ingress[0].ip
    });

const cloudflareZone = cloudflare.getZones({
    filter: {
        name: domain,
    }
})

const site = new cloudflare.Record(
    hostname,
    {
      zoneId: cloudflareZone.then(z => {
          return z.zones[0].id
      }),
      name: "test",
      value: appIp,
      type: "A",
      proxied: false
  }
);
