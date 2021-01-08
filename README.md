# LUKSO IPFS-Cluster on Kubernetes

## Ports overview
### IPFS
```
4001:TCP  PUBLIC      swarm - needed to connect to the swarm?
4002:UDP  PUBLIC      swarm - same
5001:TCP  INTERNAL    IPFS API
8080:TCP  PUBLIC      used to read via http
8081:WS   PUBLIC      do we need it?

```
### IPFS-CLUSTER

```
9094:TCP INTERNAL         cluster-rest-api - maybe exposed for just us?
9095:TCP PUBLIC         ipfs-cluster-proxy - this will be exposed instead of the IPFS:5001
9096:TCP INTERNAL       cluster-swarm 

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

## Problems with the cluster in general
As of right now, somehow the cluster can not see any peers:
```
❯ kubectl exec --stdin --tty ipfs-cluster-1 -c ipfs-cluster  -- /bin/sh
/ # ipfs-cluster-ctl id
12D3KooWJqfyU6rTvamvmPY3ajvurGmS1a9Z1XhsRZVpJeJfb8uS | ipfs-cluster-1 | Sees 0 other peers
  > Addresses:
    - /ip4/10.0.1.3/tcp/9096/p2p/12D3KooWJqfyU6rTvamvmPY3ajvurGmS1a9Z1XhsRZVpJeJfb8uS
    - /ip4/127.0.0.1/tcp/9096/p2p/12D3KooWJqfyU6rTvamvmPY3ajvurGmS1a9Z1XhsRZVpJeJfb8uS
  > IPFS: 12D3KooWDvwhrSXLTcYui3nU9AjmNZ1P56W47S28YmQHrLiguDCo
    - /ip4/127.0.0.1/tcp/4001/p2p/12D3KooWDvwhrSXLTcYui3nU9AjmNZ1P56W47S28YmQHrLiguDCo
    - /ip4/127.0.0.1/udp/4001/quic/p2p/12D3KooWDvwhrSXLTcYui3nU9AjmNZ1P56W47S28YmQHrLiguDCo
    - /ip4/34.78.218.158/tcp/4001/p2p/12D3KooWDvwhrSXLTcYui3nU9AjmNZ1P56W47S28YmQHrLiguDCo
    - /ip4/34.78.218.158/udp/4001/quic/p2p/12D3KooWDvwhrSXLTcYui3nU9AjmNZ1P56W47S28YmQHrLiguDCo
```

## Access via domain
Access via Domain (ipfs.lukso.network) not yet possible. I tried to achieve this via Ingress, but we hit a wall because the healthchecks are failing and they are not customizable. Ingress expects all the "backends" to have 200 status code on the "/" path. Maybe we need to work around this somehow. For now I removed ingress.

## Working Endpoints
### IPFS
http://146.148.16.48:8080/ipfs/QmXNoej4PJzZB5bSfRo4AbCXwwpopwSBvHhtbr91Ktdaq5 - pic of reto, sorry

### CLUSTER IPFS-PROXY
http://146.148.16.48:9095/api/v0/*
