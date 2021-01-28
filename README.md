:warning: This setup guide is specifically targeting Google Cloud.

## Pre-Requisites:

- `gcloud container clusters get-credentials ipfs-cluster --zone europe-west1-c --project lukso-infrastructure`
- `brew install helm`
- `brew install helmfile`
- `helm plugin install https://github.com/jkroepke/helm-secret`

> For non `brew` users: https://helm.sh/docs/intro/install/

# Daily Business

## Deployment

:warning: On the initial deployment one needs to be patient here, it can take up to 20 minutes until the certificates and the ingress are working properly. Also the health-checks need to be fixed immediately after deployment, as explained later on.

- `helmfile --environment staging sync`

This will result in the following objects under "Services and Ingress":

```
lukso-ipfs-cluster              Cluster IP
lukso-ipfs-cluster-gateway      Node Port
                                                :4001 TCP
                                                :8080 TCP
                                                :9095 TCP
lukso-ipfs-cluster-ingress      Ingress
                                                example.com/
                                                example.com/api/v0/add
                                                example.com/api/v0/block
                                                example.com/api/v0/get
                                                example.com/api/v0/dag/put
                                                example.com/api/v0/object/data
                                                example.com/api/v0/object/get
```

## Fix the ingress health-checks:

- Goto `Network Services` - `Load balancing`.
- You should see something along the lines of this:

```
example.com     /*                  k8s-be-31038--2f38519e29c6dda7        # $1
example.com     /                   k8s-be-31038--2f38519e29c6dda7
example.com     /api/v0/add         k8s-be-31200--2f38519e29c6dda7        # $2
example.com     /api/v0/block       k8s-be-31200--2f38519e29c6dda7
```

### Update the health-checks

Copy the `k8s-be-xxxxx--2f38519e29c6dda7` string and subsitute `$1` respectively `$2` with it.

- `gcloud compute health-checks update http k8s-be-31388--6ed6b4c9461b904b --request-path=/ipfs/QmNtZbtuRGoPP51FsAfixK81y1HVD41ifeqkR5DprCtZZF`
- `gcloud compute health-checks update http k8s-be-30046--6ed6b4c9461b904b --request-path=/api/v0/pin/ls`

## Enable CDN:

- `gcloud compute backend-services update k8s-be-31388--6ed6b4c9461b904b --cache-mode=USE_ORIGIN_HEADERS --enable-cdn`

## Secrets

Secrets are encrypted via `gcloud kms` (https://cloud.google.com/sdk/gcloud/reference/kms)[https://cloud.google.com/sdk/gcloud/reference/kms].

## Update a secret:

```
helm secrets edit environments/staging/secrets.yaml
```

GCP KMS uses Application Default Credentials. If you already logged in using

```
$ gcloud auth login
```

you can enable application default credentials using the sdk:

```
$ gcloud auth application-default login
```
