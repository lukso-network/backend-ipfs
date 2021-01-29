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

## Environments

By default there are two environments available:

- staging
- prod

They both are located on the same cluster, each within their own `namespace` (staging|prod).

# Pre-Requisites:

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
