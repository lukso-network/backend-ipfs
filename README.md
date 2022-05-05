# IPFS-Cluster

We are running an IPFS-Cluster with the following endpoints publicly available:

- IPFS-Gateway

  - ![GET](https://img.shields.io/badge/-GET-blue) https://ipfs.lukso.network/ipfs/QmbK51iHKSDsEHdALnjrQMtb87drBFZFHRbme1fCJsEePg

- IPFS-Cluster

  - ![POST](https://img.shields.io/badge/-POST-green "POST") `https://api.ipfs.lukso.network`[/api/v0/add](https://docs.ipfs.io/reference/http/api/#api-v0-add)
  - ![POST](https://img.shields.io/badge/-POST-green "POST") `https://api.ipfs.lukso.network`[/api/v0/block](https://docs.ipfs.io/reference/http/api/#api-v0-add)
  - ![POST](https://img.shields.io/badge/-POST-green "POST") `https://api.ipfs.lukso.network`[/api/v0/get](https://docs.ipfs.io/reference/http/api/#api-v0-get)
  - ![POST](https://img.shields.io/badge/-POST-green "POST") `https://api.ipfs.lukso.network`[/api/v0/dag/put](https://docs.ipfs.io/reference/http/api/#api-v0-dag-put)
  - ![POST](https://img.shields.io/badge/-POST-green "POST") `https://api.ipfs.lukso.network`[/api/v0/object/data](https://docs.ipfs.io/reference/http/api/#api-v0-object-data)
  - ![POST](https://img.shields.io/badge/-POST-green "POST") `https://api.ipfs.lukso.network`[/api/v0/object/get](https://docs.ipfs.io/reference/http/api/#api-v0-object-get)

## Upload manually to LUKSO IPFS

You can use the website bellow to manually upload files to LUKSO IPFS:

- <https://anarkrypto.github.io/upload-files-to-ipfs-from-browser-panel/public/>
- Node address: `api.ipfs.lukso.network`
- API Port: `443`
- Gateway Port: `443`

Then click on "Node online" to connect to the node

# Usage

The IPFS API endpoints mentioned above are public and do **not** require an API key.

> Keep in mind the available endpoints are limited to the ones mentioned above. Should you require an additional endpoint, feel free to open an issue here on github, and we can look into it.

```javascript
import ipfsClient from "ipfs-http-client";

const ipfs = ipfsClient({
  protocol: "https",
  host: "api.ipfs.lukso.network",
  port: 443,
});
```

If you require more in-depth examples, head over to the [IPFS docs](https://docs.ipfs.io/reference/).

# Environments

By default, there are two environments available:

- Staging aka `staging`
  - https://staging.ipfs.lukso.network
  - https://staging.api.ipfs.lukso.network
- Production aka `prod`
  - https://ipfs.lukso.network
  - https://api.ipfs.lukso.network

They both are located on the same cluster, each within their own namespace (`staging`|`prod`).

# Setup

If you would like to setup a cluster from scratch, checkout out the [setup instructions](./SETUP.md).

# Resources

- <https://cluster.ipfs.io/documentation/guides/k8s/>