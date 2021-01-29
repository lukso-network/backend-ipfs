:warning: This setup guide is specifically targeting Google Cloud.

# What you will get:

```
{{release-name}}-ipfs-cluster              Cluster IP
{{release-name}}-ipfs-cluster-gateway      Node Port
                                                :4001 TCP
                                                :8080 TCP
                                                :9095 TCP
{{release-name}}-ipfs-cluster-ingress      Ingress
                                                {{ domain }}/
                                                {{ domain }}/api/v0/add
                                                {{ domain }}/api/v0/block
                                                {{ domain }}/api/v0/get
                                                {{ domain }}/api/v0/dag/put
                                                {{ domain }}/api/v0/object/data
                                                {{ domain }}/api/v0/object/get
```

## Pre-Requisites:

- Enable [application default credentials](https://github.com/mozilla/sops#encrypting-using-gcp-kms)
- Request permission to `sops-key`
  - `projects/lukso-infrastructure/locations/global/keyRings/sops/cryptoKeys/sops-key`
- Install `helm`, `helmfile` and `helm-secrets`

### Steps

- `gcloud auth application-default login`
- `gcloud container clusters get-credentials ipfs-cluster --zone europe-west1-c --project lukso-infrastructure`
- `brew install helm`
- `brew install helmfile`
- `helm plugin install https://github.com/jkroepke/helm-secret`

> For non `brew` users: https://helm.sh/docs/intro/install/ \

# Daily Business

## Deployment

- `helmfile --environment staging sync`

> If it is your initial deployment, read on carefully

# Notes on the Initial Deployment

## Fix the ingress health-checks:

- Go to `Network Services` - `Load balancing`.
- You should see something along the lines of this:

```
{{ domain }}     /*                  k8s-be-31038--2f38519e29c6dda7        # $1
{{ domain }}     /                   k8s-be-31038--2f38519e29c6dda7
{{ domain }}     /api/v0/add         k8s-be-31200--2f38519e29c6dda7        # $2
{{ domain }}     /api/v0/block       k8s-be-31200--2f38519e29c6dda7
```

### Update the health-checks

Copy the `k8s-be-xxxxx--2f38519e29c6dda7` string and subsitute `$1` respectively `$2` with it.

- `gcloud compute health-checks update http $1 --request-path=/ipfs/QmNtZbtuRGoPP51FsAfixK81y1HVD41ifeqkR5DprCtZZF`
- `gcloud compute health-checks update http $2 --request-path=/api/v0/pin/ls`

## Enable CDN:

- `gcloud compute backend-services update $1 --cache-mode=USE_ORIGIN_HEADERS --enable-cdn`

# Secrets

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
