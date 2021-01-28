## Cluster Secret

To generate the cluster_secret value which is to be stored in `confmap-secret.yaml`, run the following

- `od -vN 32 -An -tx1 /dev/urandom | tr -d ' \n' | base64` (MacOS)
- `od -vN 32 -An -tx1 /dev/urandom | tr -d ' \n' | base64 -w 0 -` (Linux)

## Bootstrap Peer ID and Private Key

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

## Configuration

- Make sure the `certificates.gateway.domain` in `values.yaml` is correct
- Make sure the global IP address has the correct name
- Ensure the DNS settings are propagated

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

```
kubectl exec -n prod --stdin --tty lukso-ipfs-cluster-0 -c ipfs-cluster  -- /bin/sh
/ # ipfs-cluster-ctl id
Qmd7vkP2JFQDJmFm5zENEQGahsCdN8UeNWCxJq8Y3C8Ged | lukso-ipfs-cluster-0 | Sees 2 other peers
```
