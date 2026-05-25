---
title: "Dashboard Authentication"
weight: 2
---

Put the Rollout Dashboard behind your OIDC provider. A single [oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/) deployment in `auth-system` gates the dashboard via [Envoy Gateway](https://gateway.envoyproxy.io) extAuth.

{{< callout type="info" >}}
Installing via the [Helm chart](helm/)? Set `auth.enabled: true` and `dashboard.gateway.auth: true` — every manifest below is templated for you. The steps here are the manual path for non-Helm installs.
{{< /callout >}}

## Register One OIDC Client

At your OIDC provider:

- **Client ID**: `kuberik-cluster`
- **Redirect URI**: `https://<dashboard-host>/oauth2/callback`
- **Scopes**: `openid email profile groups`

The same client id is reused by kube-apiserver, so the id_token authenticates against both.

## Configure kube-apiserver

```text {filename="kube-apiserver flags"}
--oidc-issuer-url=https://<your-oidc-issuer>
--oidc-client-id=kuberik-cluster
--oidc-username-claim=email
```

## Deploy the Auth Gate

```bash
kubectl create namespace auth-system
kubectl create secret generic oauth2-proxy-secrets -n auth-system \
  --from-literal=client-secret="<client-secret>" \
  --from-literal=cookie-secret="$(openssl rand -base64 32 | tr -- '+/' '-_' | head -c 32)"
```

```yaml {filename="auth-system.yaml"}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: oauth2-proxy
  namespace: auth-system
spec:
  selector:
    matchLabels: { app: oauth2-proxy }
  template:
    metadata:
      labels: { app: oauth2-proxy }
    spec:
      containers:
        - name: oauth2-proxy
          image: quay.io/oauth2-proxy/oauth2-proxy:v7.7.1
          args:
            - --provider=oidc
            - --oidc-issuer-url=https://<your-oidc-issuer>
            - --client-id=kuberik-cluster
            - --email-domain=*
            - --upstream=static://200
            - --http-address=0.0.0.0:4180
            - --redirect-url=https://<dashboard-host>/oauth2/callback
            - --scope=openid email profile groups
            - --set-authorization-header=true
            - --pass-access-token=true
            - --set-xauthrequest=true
            - --skip-provider-button=true
            - --cookie-secure=true
            - --cookie-samesite=lax
            - --reverse-proxy=true
            - --skip-jwt-bearer-tokens=true
          env:
            - { name: OAUTH2_PROXY_CLIENT_SECRET, valueFrom: { secretKeyRef: { name: oauth2-proxy-secrets, key: client-secret } } }
            - { name: OAUTH2_PROXY_COOKIE_SECRET, valueFrom: { secretKeyRef: { name: oauth2-proxy-secrets, key: cookie-secret } } }
          ports:
            - containerPort: 4180
---
apiVersion: v1
kind: Service
metadata: { name: oauth2-proxy, namespace: auth-system }
spec:
  selector: { app: oauth2-proxy }
  ports: [{ port: 4180, targetPort: 4180 }]
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata: { name: oauth2-proxy, namespace: auth-system }
spec:
  parentRefs:
    - { name: <gateway-name>, namespace: <gateway-namespace> }
  rules:
    - matches: [{ path: { type: PathPrefix, value: /oauth2 } }]
      backendRefs: [{ name: oauth2-proxy, port: 4180 }]
---
apiVersion: gateway.networking.k8s.io/v1beta1
kind: ReferenceGrant
metadata: { name: oauth2-proxy-from-all, namespace: auth-system }
spec:
  from:
    - { group: gateway.envoyproxy.io, kind: SecurityPolicy, namespace: kuberik-system }
  to:
    - { group: "", kind: Service, name: oauth2-proxy }
```

## Attach the Dashboard

```yaml {filename="dashboard-auth.yaml"}
apiVersion: gateway.envoyproxy.io/v1alpha1
kind: SecurityPolicy
metadata:
  name: rollout-dashboard-auth
  namespace: kuberik-system
spec:
  targetRefs:
    - { group: gateway.networking.k8s.io, kind: HTTPRoute, name: rollout-dashboard }
  extAuth:
    http:
      backendRefs:
        - { name: oauth2-proxy, namespace: auth-system, port: 4180 }
      headersToBackend:
        - Authorization
        - X-Auth-Request-User
        - X-Auth-Request-Email
        - X-Auth-Request-Access-Token
```

Gate another service by applying the same `SecurityPolicy` shape in its namespace and extending the `ReferenceGrant` `from` list.

{{< callout type="info" >}}
For multi-cluster (hub fans out to spokes), deploy this gate in every cluster pointing at the same OIDC issuer. `--skip-jwt-bearer-tokens=true` lets the hub forward the user's id_token to spokes without a per-cluster login.
{{< /callout >}}
