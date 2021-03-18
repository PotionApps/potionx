// Copyright 2016-2018, Pulumi Corporation.  All rights reserved.
import * as cloudflare from '@pulumi/cloudflare'
import * as digitalocean from "@pulumi/digitalocean";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

interface AuthProviders {
  azureAd: {
    clientId: string
    clientSecret: string
    tenantId: string
  },
  google: {
    clientId: string
    clientSecret: string
  }
}

const appNamespace = (s: string) => "<%= appName %>" + s
const config = new pulumi.Config();
const appImageName = config.require('appImage')
const appReplicaCount = config.getNumber("appReplicaCount") || 1;
const cloudflareConfig = new pulumi.Config('cloudflare')
const cloudflareApiToken = cloudflareConfig.require("apiToken");
const dbName = config.get("dbName") || "<%= appName %>";
const domain = config.require("domain");
const subdomain = config.get("subdomain") || "www";
const hostname = subdomain + "." + domain
const nodeCount = config.getNumber("nodeCount") || 2;
const passwordDb = config.requireSecret('passwordDb')
const passwordRedis = config.requireSecret('passwordRedis')
const authProviders = config.requireSecretObject<AuthProviders>("authProviders");
const secretKeyBase = config.requireSecret('secretKeyBase')
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

const certManagerNamespace = 'cert-manager'
const certManager = new k8s.yaml.ConfigFile(
    appNamespace('cert-manager'),
    {
        file: "https://github.com/jetstack/cert-manager/releases/download/v1.2.0/cert-manager.yaml"
    },
    { provider }
);


const dnsSecret = new k8s.core.v1.Secret(
    'cloudflare-api-token-secret',
    {
        metadata: {
            name: 'cloudflare-api-token-secret',
            namespace: certManagerNamespace
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
    { provider, dependsOn: certManager }
);

/**
 * ================================
 * Secrets for Postgres and Redis
 * ================================
*/
let passwordDbEncoded = pulumi.all([passwordDb]).
    apply(([passwordDb]) => encodeURIComponent(passwordDb));
let passwordRedisEncoded = pulumi.all([passwordRedis]).
    apply(([passwordRedis]) => encodeURIComponent(passwordRedis));
const dbSecrets = new k8s.core.v1.Secret(
    'db-secrets',
    {
        metadata: {
            name: 'db-secrets'
        },
        stringData: {
            'redis-password': passwordRedis,
            'postgresql-password': passwordDb,
            'postgresql-replication-password': passwordDb,
            'postgresql-ldap-password': passwordDb,
            'DATABASE_URL': pulumi.interpolate `ecto://postgres:${passwordDbEncoded}@postgresql-headless/${dbName}`,
            "REDIS_URL": pulumi.interpolate `redis://:${passwordRedisEncoded}@redis-headless`,
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
        existingSecret: dbSecrets.metadata.name,
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
        existingSecret: dbSecrets.metadata.name,
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
const ghcrAuth = Buffer.from(process.env.GHCR_USERNAME + ":" + process.env.GHCR_PASSWORD).toString('base64')
const imagePullSecrets = new k8s.core.v1.Secret(
    "ghcr",
    {
        metadata: {
            name: 'ghcr-secret'
        },
        type: "kubernetes.io/dockerconfigjson",
        stringData: {
            ".dockerconfigjson": `{"auths":{"https://ghcr.io":{"auth":"${ghcrAuth}"}}}`
        },
    },
    {
        provider
    }
);
const appSecrets = new k8s.core.v1.Secret(
    'app-secrets',
    {
        metadata: {
            name: 'app-secrets'
        },
        stringData: {
            "AUTH_CALLBACK_ORIGIN": pulumi.interpolate`https://${hostname}`,
            "ASSENT_GOOGLE_CLIENT_ID": authProviders.google.clientId, 
            "ASSENT_GOOGLE_CLIENT_SECRET": authProviders.google.clientSecret,
            "ASSENT_AZURE_CLIENT_ID": authProviders.azureAd.clientId, 
            "ASSENT_AZURE_CLIENT_SECRET": authProviders.azureAd.clientSecret, 
            "ASSENT_AZURE_TENANT_ID": authProviders.azureAd.tenantId, 
            "SECRET_KEY_BASE": secretKeyBase
        },
        type: 'opaque'
    },
    {
        provider
    }
)
const appLabels = { "app": "main-app" };
const app = new k8s.apps.v1.Deployment(appNamespace("main-app"), {
    spec: {
        selector: { matchLabels: appLabels },
        replicas: appReplicaCount,
        template: {
            metadata: { labels: appLabels },
            spec: {
                containers: [
                    {
                        name: "main-app",
                        image: appImageName,
                        envFrom: [
                            {
                                secretRef: {
                                    name: appSecrets.metadata.name,
                                    optional: false
                                }
                            },
                            {
                                secretRef: {
                                    name: dbSecrets.metadata.name,
                                    optional: false
                                }
                            }
                        ],
                        livenessProbe: {
                            httpGet: {
                                path: '/_k8s/liveness',
                                port: 4000
                            },
                            periodSeconds: 10,
                            failureThreshold: 10
                        },
                        ports: [
                            {
                                name: 'http',
                                containerPort: 4000, 
                                protocol: 'TCP'
                            }
                        ],
                        readinessProbe: {
                            httpGet: {
                                path: "/_k8s/readiness",
                                port: 4000
                            },
                            periodSeconds: 10,
                            failureThreshold: 3
                        },
                        startupProbe: {
                            httpGet: {
                                path: "/_k8s/startup",
                                port: 4000
                            },
                            periodSeconds: 10,
                            failureThreshold: 1
                        }
                    }
                ],
                imagePullSecrets: [
                    {
                        name: imagePullSecrets.metadata.name
                    }
                ]
            },
        },
    },
}, { provider });
const appService = new k8s.core.v1.Service(appNamespace("service"), {
    metadata: {
        name: 'app-service'
    },
    spec: {
        type: "ClusterIP",
        selector: app.spec.template.metadata.labels,
        ports: [{
            port: 4000,
            targetPort: 4000
        }],
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
                                        number: 4000
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
      name: subdomain,
      value: appIp,
      type: "A",
      proxied: true
  }
);
