# Kubernetes IPFS-Cluster
## Ports overview
### IPFS
```
4001:tcp    public      // swarm                todo: needs to be exposed for each pod 
4002:UDP    public      // swarm                todo: needs to be exposed for each pod
5001:tcp    internal    // ipfs-api
8080:tcp    public      // ipfs-gateway 
8081:ws     internal    // websocket            todo: do we need it?  
```
### IPFS-CLUSTER
```
9094:tcp    internal    // cluster-rest-api     todo: do we need it? 
9095:tcp    public      // ipfs-proxy-api       todo: expose on port 5001:tcp  
9096:tcp    internal    // cluster-swarm 
```
## Problems with Proxy-API
### /api/v0/add
There is a difference in the response:
```
{
    "Name":"",
    "Hash":"QmZnrPBqsrNg5iuHuFzhWg9bxwHFAcH3ojWFALyURhTotM",
    "Size":"435731"
}
vs
{
    "Name":"QmNeBhZtFGamp7dXHRh6wsJBPmHBiNwpUD1kqHgmtkYqsL",
    "Hash":"QmNeBhZtFGamp7dXHRh6wsJBPmHBiNwpUD1kqHgmtkYqsL",
    "Size":"434675"
}
```

### Solution: TBD
Investigate https://github.com/ipfs-cluster/js-cluster-client/issues/3

## Cluster peer visibility (solved)
The ipfs-cluster pods could not see any peers:
```
❯ kubectl exec --stdin --tty ipfs-cluster-1 -c ipfs-cluster  -- /bin/sh
/ # ipfs-cluster-ctl id
12D3KooWJqfyU6rTvamvmPY3ajvurGmS1a9Z1XhsRZVpJeJfb8uS | ipfs-cluster-1 | Sees 0 other peers
```

### Solution
To be able to resolve pod IPs via the name of the pods, one needs to create a `headless` service. 
E.g. [templates/service-headless.yaml](templates/service-headless.yaml)

```
spec:
  clusterIP: None
```

Source: [https://stackoverflow.com/a/46638059/1219080](https://stackoverflow.com/a/46638059/1219080)

## Access via ipfs.lukso.network
We tried to achieve this via Ingress, but we hit a wall because the healthchecks are failing and they are not customizable. Ingress expects all the "backends" to have 200 status code on the "/" path.

### Solution
It's possible to deploy another implementation of the ingress, our choice NGINX:

```
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx
```
On your ingress definition you need to add the following annotation:

```
annotations:
  kubernetes.io/ingress.class: "nginx"
```

E.g. [templates/ingress.yaml](templates/ingress.yaml)

Source: [https://cloud.google.com/community/tutorials/nginx-ingress-gke](https://cloud.google.com/community/tutorials/nginx-ingress-gke)

## HTTPS via Let's Encrypt
Install certmanager
```
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.1.0/cert-manager.yaml
```

Create Issuer:
E.g. [config/certificate-issuer.yaml](config/certificate-issuer.yaml)

```
kubectl apply -f config/certificate-issuer.yaml
```

Relevant Parts:
```
metadata:
  annotations:
    ...
    cert-manager.io/issuer: "letsencrypt-prod"
    acme.cert-manager.io/http01-edit-in-place: "true" 
spec:
  tls:
    - hosts:
      - ipfs.lukso.network
      secretName: letsencrypt-prod
```

Source: [https://cert-manager.io/docs/installation/kubernetes/](https://cert-manager.io/docs/installation/kubernetes/)

## Endpoints (WIP)
### IFPS
- Gateway: https://ipfs.lukso.network/ipfs/{CID}

### Cluster
- https://ipfs.lukso.network/id
- https://ipfs.lukso.network/version
- https://ipfs.lukso.network/pins
