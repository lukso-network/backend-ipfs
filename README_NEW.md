# Setup (from scratch)
- Get a static IP + domain + proper dns records
- Paste IP in nginx-ingress-values.yaml "loadBalancerIP"
```
kubectl create namespace cert-manager

kubectl create clusterrolebinding cluster-admin-binding \
    --clusterrole=cluster-admin \
    --user=$(gcloud config get-value core/account)

helm install \
    cert-manager jetstack/cert-manager \
    --namespace cert-manager \
    --version v1.1.0

helm install -n prod lukso .

***wait until 3/3 pods are running (green checkmarks)***

helm install -n prod -f nginx-ingress-values.yaml ingress-nginx ingress-nginx/ingress-nginx --set 'extraArgs={--dns01-recursive-nameservers-only,--dns01-recursive-nameservers=8.8.8.8:53\,1.1.1.1:53}'
```

## How to update:
```
helm upgrade -n prod $releaseName . 
helm upgrade -n prod -f nginx-ingress-values.yaml ingress-nginx ingress-nginx/ingress-nginx --set 'extraArgs={--dns01-recursive-nameservers-only,--dns01-recursive-nameservers=8.8.8.8:53\,1.1.1.1:53}'
```