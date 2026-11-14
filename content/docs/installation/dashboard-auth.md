---
title: "Set Up Dashboard Sign-in"
linkTitle: "Dashboard Sign-in"
description: "Put the dashboard behind your OIDC provider with one oauth2-proxy and an Envoy Gateway SecurityPolicy."
type_: guide
weight: 2
---

Put the Kuberik dashboard behind your OIDC provider, so people sign in with their own identity. One [oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/) in `auth-system` checks every request through [Envoy Gateway](https://gateway.envoyproxy.io) external authorization.

This page is the manual path. It needs Envoy Gateway and the dashboard's `rollout-dashboard` HTTPRoute in `kuberik-system`.

{{< callout type="important" >}}
With the [Helm chart](/docs/installation/helm/), set `auth.enabled` and `dashboard.gateway.auth` instead and the chart renders these manifests. On chart 0.7.0, add the two `--skip-auth-route` flags below through `auth.extraArgs`; charts after 0.7.0 set them by default with `auth.staticRoutes`.
{{< /callout >}}

## Register one OIDC client

Create one client at your OIDC provider. kube-apiserver reuses the same client ID, so one id_token signs the user in to both the dashboard and the Kubernetes API.

| Setting | Value |
|---|---|
| Client ID | `kuberik-cluster` |
| Redirect URI | `https://<dashboard-host>/oauth2/callback` |
| Scopes | `openid email profile groups` |

## Configure kube-apiserver

Point kube-apiserver at the same issuer and client, so the dashboard's Kubernetes calls run as the signed-in user:

```text {filename="kube-apiserver flags"}
--oidc-issuer-url=https://<your-oidc-issuer>
--oidc-client-id=kuberik-cluster
--oidc-username-claim=email
```

## Deploy the sign-in proxy

Create the namespace and the Secret with the client secret and a cookie secret:

```bash {filename="Terminal"}
kubectl create namespace auth-system
kubectl create secret generic oauth2-proxy-secrets -n auth-system \
  --from-literal=client-secret="<client-secret>" \
  --from-literal=cookie-secret="$(openssl rand -base64 32 | tr -- '+/' '-_' | head -c 32)"
```

Apply oauth2-proxy, its Service, the `/oauth2` route and the grant that lets the dashboard's SecurityPolicy call it:

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
            - --api-route=^/api/  # answer 401, never redirect, on api calls
            - --skip-auth-route=^/_app/
            - --skip-auth-route=^/(favicon\.(ico|png)|apple-touch-icon\.png|icon-(192|512)\.png|logo\.svg|manifest\.json)$
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

The dashboard refreshes every few seconds and holds a change stream open. `--api-route` makes those background requests get a `401` when the session is stale, instead of a redirect to your provider that the browser cannot follow. The `--skip-auth-route` lines serve the dashboard's compiled, content-hashed bundle and icons without sign-in, so the page can load and show its session-expired state. All data still comes over `/api/`, which stays behind sign-in. `--skip-jwt-bearer-tokens` lets a hub cluster forward the user's id_token to spoke clusters without a second sign-in.

## Attach the dashboard

Apply a SecurityPolicy on the dashboard's HTTPRoute, so every request goes through oauth2-proxy first:

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

To put another service behind the same sign-in, apply the same SecurityPolicy in its namespace and add that namespace to the ReferenceGrant's `from` list. For several clusters, deploy this in every cluster with the same OIDC issuer.

## Check the result

Open `https://<dashboard-host>/` in a private window. The browser goes to your provider's sign-in page and then back to the dashboard. An API call without a session gets `401`, not a redirect:

```bash {filename="Terminal"}
curl -s -o /dev/null -w '%{http_code}\n' https://<dashboard-host>/api/
```

```text {filename="Output"}
401
```

## Troubleshoot

| Symptom | Cause | Fix |
|---|---|---|
| A page goes blank after a while. The console shows `Failed to fetch dynamically imported module` for `_app/immutable/chunks/*.js` and requests to your provider's `/authorize`. A reload fixes it | The session went stale and the bundle is behind sign-in. The browser does not follow a cross-origin redirect for a script or stylesheet | Add both `--skip-auth-route` lines. `--api-route` does not help here: a `401` on a chunk still fails to load it |
| One person's browser cannot reach the dashboard host (`ERR_HTTP2_PROTOCOL_ERROR`) while `curl` works. Clearing site data fixes it until it comes back | The `Cookie` header outgrew the proxy's header limit (60 KiB in Envoy). `--cookie-csrf-per-request` keeps one uniquely named CSRF cookie per sign-in attempt for 15 minutes | Set `--api-route=^/api/` and the `--skip-auth-route` lines, so background requests start no sign-in. If you keep `--cookie-csrf-per-request`, add `--cookie-csrf-per-request-limit=3`, which needs oauth2-proxy v7.11.0 or later |
| `invalid_grant: PKCE verification failed` on sign-in | Parallel background requests started competing sign-ins ([oauth2-proxy#2155](https://github.com/oauth2-proxy/oauth2-proxy/issues/2155)) | Set `--api-route=^/api/` |

To confirm cookie growth, open DevTools, then Application, then Cookies for the dashboard host, and count the `_oauth2_proxy*` entries. Several kilobytes and climbing is this problem.

## Next steps

{{< next "/docs/installation/helm/" "/docs/integrations/github/" "/docs/operate/troubleshooting/" >}}
