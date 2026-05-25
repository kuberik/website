---
title: "Installation"
weight: 1
sidebar:
  open: true
---

Install Kuberik in your Kubernetes cluster.

{{< callout type="info" >}}
**Prerequisites:** You'll need a Kubernetes cluster and `kubectl` access. Kuberik requires a GitOps tool like FluxCD to function.
{{< /callout >}}

## Resource Reconciler

Kuberik relies on a resource reconciler to apply manifests to your cluster.

{{< tabs >}}
  {{< tab name="FluxCD" >}}
  Install [FluxCD](https://fluxcd.io/flux/installation/) v2.0+:

  ```bash
  flux check
  ```

  See [FluxCD Integration](/docs/integrations/fluxcd/) for configuration details.
  {{< /tab >}}

  {{< tab name="Argo CD" disabled=true >}}
  Argo CD support is planned but not yet available.
  {{< /tab >}}
{{< /tabs >}}

---

## Install Kuberik Controller

Deploy the rollout controller:

```bash
kubectl apply -f https://github.com/kuberik/rollout-controller/releases/download/v0.7.0/install.yaml
```

{{< callout type="default" >}}
**Verify Installation:**

```bash
kubectl get pods -n kuberik-system
# Expected output:
# rollout-controller-xxxxx   1/1     Running
```
{{< /callout >}}

---

## Optional Controllers

{{< callout type="warning" >}}
These controllers are **optional** and add specific functionality. Install only what you need for your use case.
{{< /callout >}}

{{% details title="OpenKruise Controller" %}}

Enables canary deployments and advanced traffic shifting.

```bash
kubectl apply -f https://github.com/kuberik/openkruise-controller/releases/download/v0.3.3/install.yaml
```

{{< badge content="Canary Deployments" >}} {{< badge content="Traffic Shifting" >}}

See [FluxCD Integration](/docs/integrations/fluxcd/) for image automation setup.

{{% /details %}}

{{% details title="Datadog Controller" %}}

Uses Datadog monitors as health check sources during rollouts.

```bash
kubectl apply -f https://github.com/kuberik/datadog-controller/releases/download/v0.1.0/install.yaml
```

{{< badge content="Health Checks" >}} {{< badge content="Monitoring" >}}

{{< callout type="info" >}}
You'll need a Datadog API key configured. See [Datadog Integration](/docs/integrations/datadog/) for monitor configuration.
{{< /callout >}}

{{% /details %}}

{{% details title="Environment Controller" %}}

Coordinates multi-cluster promotions via GitHub Environments and Deployments APIs.

```bash
kubectl apply -f https://github.com/kuberik/environment-controller/releases/download/v0.1.5/install.yaml
```

{{< badge content="Multi-cluster" >}} {{< badge content="GitHub Integration" >}}

See [GitHub Integration](/docs/integrations/github/) for setup.

{{% /details %}}

---

## Authenticate the Dashboard

Put the Rollout Dashboard behind your OIDC provider. A single [oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/) deployment in `auth-system` gates the dashboard via [Envoy Gateway](https://gateway.envoyproxy.io) extAuth.

### Register One OIDC Client

At your OIDC provider:

- **Client ID**: `kuberik-cluster`
- **Redirect URI**: `https://<dashboard-host>/oauth2/callback`
- **Scopes**: `openid email profile groups`

The same client id is reused by kube-apiserver, so the id_token authenticates against both.

### Configure kube-apiserver

```text {filename="kube-apiserver flags"}
--oidc-issuer-url=https://<your-oidc-issuer>
--oidc-client-id=kuberik-cluster
--oidc-username-claim=email
```

### Deploy the Auth Gate

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

### Attach the Dashboard

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
