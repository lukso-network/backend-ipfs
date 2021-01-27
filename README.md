:warning: This setup guide is specifically targeting Google Cloud.

## Pre-Requisites:
### Select the correct cluster:
- `gcloud container clusters get-credentials ipfs-cluster --zone europe-west1-c --project lukso-infrastructure`
### Install Helm
  - https://helm.sh/docs/intro/install/
# Setup from scratch

- `helm repo add lukso-helm-charts https://lukso-helm-charts.storage.googleapis.com`
- `touch confmap-secret.yaml`

Paste content below into `confmap-secret.yaml`:

```yaml
# confmap-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-config
type: Opaque
data:
  cluster-secret: <INSERT_SECRET>
  bootstrap-peer-priv-key: <INSERT_KEY>
```

## Cluster Secret
To generate the cluster_secret value which is to be stored in `confmap-secret.yaml`, run the following

- `od  -vN 32 -An -tx1 /dev/urandom | tr -d ' \n' | base64` (MacOS)
- `od  -vN 32 -An -tx1 /dev/urandom | tr -d ' \n' | base64 -w 0 -` (Linux)

 Replace `<INSERT_SECRET>` with the output from above.
## Bootstrap Peer ID and Private Key
- `touch values.yaml`
- Paste the following content into `values.yaml`

```yaml
bootstrap:
  id: <INSERT_PEER_ID>

certificates:
  gateway:
    name: <INSERT_NAME_OF_DOMAIN>
    domain: <INSERT_DOMAIN>

ingress:
  nameOfGlobalIP: <INSERT_NAME_OF_GLOBAL_IP>
```

- Install [ipfs-key](https://github.com/whyrusleeping/ipfs-key)
- Generate the values for `bootstrap_peer_id` and `bootstrap_peer_priv_key`
  - `ipfs-key | base64` (MacOS)
  - `ipfs-key | base64 -w 0` (Linux)
- Replace `<INSERT_PEER_ID>` with the ID of the generated key.
- Copy the private key value and run the following with it:
  - `echo "<INSERT_PRIV_KEY_VALUE_HERE>" | base64` (MacOS)
  - `echo "<INSERT_PRIV_KEY_VALUE_HERE>" | base64 -w 0 -` (Linux)
- Replace `<INSERT_KEY>` with the output from above

## Configuration
- Make sure the `certificates.gateway.domain` in `values.yaml` is correct
- Make sure the global IP address has the correct name
- Ensure the DNS settings are propagated
## Initial Deployment

The following command will be used: 
```
helm install {{ releaseName }} lukso-helm-charts/ipfs-cluster -f values.yaml -n prod
```

:warning: One needs to be patient here, it can take up to 20 minutes until the certificates and the ingress are working properly.

:construction: On the very first start of the pods they yet crash, simply deleting the crashed pod solves the problem.

For example:
- `kubectl create namespace prod`
- `helm install lukso lukso-helm-charts/ipfs-cluster -f values.yaml -n prod`

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

- `gcloud compute health-checks update http {{ $1 }} --request-path=/ipfs/QmNtZbtuRGoPP51FsAfixK81y1HVD41ifeqkR5DprCtZZF`
- `gcloud compute health-checks update http {{ $2 }} --request-path=/api/v0/pin/ls`

## Enable CDN:
- `gcloud compute backend-services update {{ $1 }} --cache-mode=USE_ORIGIN_HEADERS --enable-cdn`

## Updating Deployment
Make sure you select the correct namespace and name of the perviously installed release.
```
helm upgrade lukso lukso-helm-charts/ipfs-cluster -f values.yaml -n prod
```

# Validate Setup
```
curl -I https://ipfs.lukso.network/ipfs/QmdmZ6cvZ2F8ypY4mg8qa34nGVQpShukDZTuiU6QzA8VxV
HTTP/2 200
...
```

```
curl -X POST "https://ipfs.lukso.network/api/v0/add"
{"Message":"error reading request: request Content-Type isn't multipart/form-data"}
```

It's important that the `ipfs-cluster-ctl id` command returns the correct amount of peers. <br> It should be `# of replicas -1`.
````
kubectl exec -n prod --stdin --tty lukso-ipfs-cluster-0 -c ipfs-cluster  -- /bin/sh
/ # ipfs-cluster-ctl id
Qmd7vkP2JFQDJmFm5zENEQGahsCdN8UeNWCxJq8Y3C8Ged | lukso-ipfs-cluster-0 | Sees 2 other peers
````
