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

## Working Endpoints
### IPFS
http://146.148.16.48:8080/ipfs/QmXNoej4PJzZB5bSfRo4AbCXwwpopwSBvHhtbr91Ktdaq5 - pic of reto, sorry

### CLUSTER IPFS-PROXY
http://146.148.16.48:9095/api/v0/*
