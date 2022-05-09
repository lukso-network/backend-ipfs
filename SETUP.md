# Getting Ready

This is a `helm` chart combined with a `helmfile`.

:warning: This guide is only applicable for Google Kubernetes Engine (GKE)

## Prerequisites

- Enable [application default credentials](https://github.com/mozilla/sops#encrypting-using-gcp-kms)
- Request permission to `sops-key`
  - `projects/lukso-infrastructure/locations/global/keyRings/sops/cryptoKeys/sops-key`
- Install `helm`, `helmfile` and `helm-diff`

### Steps

- `gcloud auth application-default login`
- `gcloud container clusters get-credentials ipfs-cluster --zone europe-west1-c --project lukso-infrastructure`
- `brew install helm`
- `brew install helmfile`
- `helm plugin install https://github.com/databus23/helm-diff`

### Instructions for any OS or users without `brew`:

> https://helm.sh/docs/intro/install/

# Deployment

Having setup everything, you are now ready to deploy a change to the cluster.

:warning: Before deploying, always have a look at the generated `yaml` files:

- `helmfile --environment prod template`

To actually deploy:

- `helmfile --environment prod sync`

> If it is your initial deployment:
>
> - Read on and follow the instructions

# Initial Setup

## Kong

```
helm repo add kong https://charts.konghq.com
helm repo update
kubectl create namespace kong
helm install kong kong/kong -n kong --set ingressController.installCRDs=false --set proxy.loadBalancerIP={{ IP }}
```

## Cert-Manager:

```
helm repo add jetstack https://charts.jetstack.io
helm repo update
kubectl create namespace cert-manager

helm install \
    cert-manager jetstack/cert-manager \
    --namespace cert-manager \
    --version v1.1.0 \
    --set installCRDs=true
```

# Cluster Secret

To generate the cluster_secret value which is to be stored in `confmap-secret.yaml`, run the following

- `od -vN 32 -An -tx1 /dev/urandom | tr -d ' \n' | base64` (MacOS)
- `od -vN 32 -An -tx1 /dev/urandom | tr -d ' \n' | base64 -w 0 -` (Linux)

# Bootstrap Peer ID and Private Key

- `touch values.yaml`
- Paste the following content into `values.yaml`

```yaml
bootstrap:
  id: <INSERT_PEER_ID>
```

- Install [ipfs-key](https://github.com/whyrusleeping/ipfs-key)
- Generate the values for `bootstrap_peer_id` and `bootstrap_peer_priv_key`
  - `ipfs-key | base64` (MacOS)
  - `ipfs-key | base64 -w 0` (Linux)
- Replace `<INSERT_PEER_ID>` with the ID of the generated key.
- Copy the private key value and run the following with it:
  - `echo "<INSERT_PRIV_KEY_VALUE_HERE>" | base64` (MacOS)
  - `echo "<INSERT_PRIV_KEY_VALUE_HERE>" | base64 -w 0 -` (Linux)

# Checks

- Make sure the `certificates.gateway.domain` in `values.yaml` is correct
- Make sure the global IP address has the correct name
- Ensure the DNS settings are propagated

# Deployment

Before deploying, always have a look at the generated `yaml` files:

- `helmfile --environment prod template`

To actually deploy:

- `helmfile --environment prod sync`

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

# Validate Setup

```
curl -I https://ipfs.lukso.network/ipfs/QmdmZ6cvZ2F8ypY4mg8qa34nGVQpShukDZTuiU6QzA8VxV
HTTP/2 200
...
```

```
curl -X POST "https://api.ipfs.lukso.network/api/v0/add"
{"Message":"error reading request: request Content-Type isn't multipart/form-data"}
```

It's important that the `ipfs-cluster-ctl id` command returns the correct amount of peers. It should be `# of replicas -1`.

```
$ kubectl exec -n prod --stdin --tty lukso-ipfs-cluster-0 -c ipfs-cluster  -- ipfs-cluster-ctl id
> Qmd7vkP2JFQDJmFm5zENEQGahsCdN8UeNWCxJq8Y3C8Ged | lukso-ipfs-cluster-0 | Sees 2 other peers
```

# Secrets

This repo was previously using `helm-secret` and then attempted to use SealedSecret. However, the SealedSecrets were only generated for the staging env (which has been deleted now) and never deployed to the prod env. To fix memory issues quick, the SeadledSecret yaml file has been commented and the related secrets were injected as environements variables in the stateful set. The commit version does not contain these values of course. The values are stored in the DevOps top secret shared folder in the password manager. This is a temporary solution until SealedSecrets is properly setup or we move to something else.
