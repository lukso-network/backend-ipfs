# Setup Instructions for Google Cloud

- Get a named static IP addresse + proper dns records
    - ipfs.lukso.network (34.102.180.196)

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

# Velero (Backup)

Docs: https://velero.io/docs/v1.5/

A daily backup is configured to take place at 08:00 CET in the morning.

This is backing up the *whole* cluster.

## Local Installation
- Install the command line tool: https://velero.io/docs/v1.5/basic-install/
- Generate a `service-key` to be able to perform actions on behalf of the service account:
    ```
    gcloud iam service-accounts keys create credentials-velero \
        --iam-account velero@lukso-infrastructure.iam.gserviceaccount.com
    ```
## Disaster-Recovery:
1. Update your backup storage location to read-only mode (this prevents backup objects from being created or deleted in the backup storage location during the restore process):

    ```
    kubectl patch backupstoragelocation <STORAGE LOCATION NAME> \
        --namespace velero \
        --type merge \
        --patch '{"spec":{"accessMode":"ReadOnly"}}'
    ```
2. Create a restore with your most recent Velero Backup:

    ```
    velero restore create --from-backup <SCHEDULE NAME>-<TIMESTAMP>
    ```

3. When ready, revert your backup storage location to read-write mode:

    ```
    kubectl patch backupstoragelocation <STORAGE LOCATION NAME> \
    --namespace velero \
    --type merge \
    --patch '{"spec":{"accessMode":"ReadWrite"}}'
    ```