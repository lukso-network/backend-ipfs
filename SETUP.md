:warning: This setup guide is specifically targeting Google Cloud.


# Setup from scratch

- `git clone https://github.com/lukso-network/backend-ipfs.git`
- Create a file called `confmap-secret.yaml` within the folder `templates`

## Cluster Secret
To generate the cluster_secret value which is to be stored in `confmap-secret.yaml`, run the following and insert the output in the appropriate place:

- `od  -vN 32 -An -tx1 /dev/urandom | tr -d ' \n' | base64` (MacOS)
- `od  -vN 32 -An -tx1 /dev/urandom | tr -d ' \n' | base64 -w 0 -` (Linux)

## Bootstrap Peer ID and Private Key

To generate the values for `bootstrap_peer_id` and `bootstrap_peer_priv_key`, install [ipfs-key](https://github.com/whyrusleeping/ipfs-key) and then run the following:

- `ipfs-key | base64` (MacOS)
- `ipfs-key | base64 -w 0` (Linux)

Copy the id into the `values.yaml` file. I.e:
```yaml
...
bootstrap:
  id: <INSERT_PEER_ID>
...
```

Then copy the private key value and run the following with it:

- `echo "<INSERT_PRIV_KEY_VALUE_HERE>" | base64` (MacOS)
- `echo "<INSERT_PRIV_KEY_VALUE_HERE>" | base64 -w 0 -` (Linux)

Copy the output to the `confmap-secret.yaml` file.

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-config
type: Opaque
data:
  cluster-secret: <INSERT_SECRET>
  bootstrap-peer-priv-key: <INSERT_KEY>
```

## Configuration

- Go through the `values.yaml` and adjust the settings to fit your needs.
- Make sure the `managedcertificates` are matching the domain.
- Make sure the global IP address has the correct name
- Ensure the DNS settings are completely propagated

## Initial Deployment
```
helm install -n prod {{ releaseName }} .
```

For example:
```
helm install -n prod lukso .
```

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
:warning: One needs to be patient here, it can take up to 20 minutes until the certificates and the ingress are working properly.

:construction: On the very first start of the pods they yet crash, simply deleting the crashed pod solves the problem.

## Updating Deployment
Make sure you select the correct namespace and name of the perviously installed release.
```
helm upgrade -n prod lukso .
```

## Monitoring

TBD
