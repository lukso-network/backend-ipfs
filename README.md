# IPFS-Cluster on GKE (Google Kubernetes Engine)

This is a `helm` chart combined with a `helmfile`. When deployed, it will create an `Ingress` named `{{release-name}}-ipfs-cluster-ingress` with the following endpoints publicly available for you:

IPFS:

- /ipfs/{{ hash }} # Google Cloud CDN

IPFS-Cluster:

- /api/v0/add
- /api/v0/block
- /api/v0/get
- /api/v0/dag/put
- /api/v0/object/data
- /api/v0/object/get

## Environments

By default, there are two environments available:

- `staging`
- `prod`

They both are located on the same cluster, each within their own namespace (`staging`|`prod`).

# Prerequisites:

- Enable [application default credentials](https://github.com/mozilla/sops#encrypting-using-gcp-kms)
- Request permission to `sops-key`
  - `projects/lukso-infrastructure/locations/global/keyRings/sops/cryptoKeys/sops-key`
- Install `helm`, `helmfile` and `helm-secrets`

## Steps

- `gcloud auth application-default login`
- `gcloud container clusters get-credentials ipfs-cluster --zone europe-west1-c --project lukso-infrastructure`
- `brew install helm`
- `brew install helmfile`
- `helm plugin install https://github.com/jkroepke/helm-secret`

> For non `brew` users: https://helm.sh/docs/intro/install/ \

# Deployment

Before deploying, always have a look at the generated `yaml` files:

- `helmfile --environment staging template`

To actually deploy:

- `helmfile --environment staging sync`

> If it is your initial deployment:
>
> - Read through [Initial Setup](SETUP.md) and follow the instructions

# Secrets

Update a secret:

- `helm secrets edit environments/staging/secrets.yaml`

Encrypt a secret:

- Create the file with the desired contents
- `helm secrets enc {{ path/to/secrets.yaml }}`

> Any secret value that needs to be encrypted needs to be stored within a file named `secrets.yaml`.\
> Secrets are encrypted via `gcloud kms` (https://cloud.google.com/sdk/gcloud/reference/kms)[https://cloud.google.com/sdk/gcloud/reference/kms].
