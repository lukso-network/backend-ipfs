# Setup Instructions for Google Cloud

- Get two named static IP addresses + proper dns records
    - ipfs.lukso.network (34.102.180.196)
    - api.ipfs.lukso.network (35.241.51.34)

```
metadata:
  annotations:
    kubernetes.io/ingress.global-static-ip-name: ipfs.lukso.network
```

```
helm install -n prod lukso .

***wait until 3/3 pods are running (green checkmarks)***
On the very first start of the pods they yet crash, simply deleting the crashed pod solves the problem.

TODO: avoid pod crash on initial startup
```

## How to update:
```
helm upgrade -n prod lukso .
```

# Backup

The tool used to do the backups is `velero`:
Setup: https://github.com/vmware-tanzu/velero-plugin-for-gcp/tree/main

Docs: https://velero.io/docs/v1.5/

A daily backup is configured to take place at 08:00 CET.

This is backing up the *whole* cluster.
