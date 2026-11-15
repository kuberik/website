---
title: "Install with Helm"
description: "Install the controllers, the dashboard and dashboard sign-in from one Helm release."
type_: guide
icon: cube
weight: 10
---

Install Kuberik from its Helm chart: one release installs the rollout-controller, the release-controller {{< needs "Next release" >}}, the integration controllers you turn on, and the dashboard.

Before you start, you need Helm 3 and Flux 2.7 or later in the cluster ([install Flux](https://fluxcd.io/flux/installation/)): Kuberik picks the version and [Flux](/docs/integrations/fluxcd/) applies it. The rollout-controller the chart installs does not start without Flux's `ImagePolicy` CRD (`image.toolkit.fluxcd.io/v1`), and a default `flux install` leaves out the image-reflector-controller that serves it. Add it:

```bash {filename="Terminal"}
flux install --components-extra=image-reflector-controller
```

## Install the chart

Add the chart repository and install the release into `kuberik-system`. Helm creates the namespace, so the chart leaves it alone.

```bash {filename="Terminal"}
helm repo add kuberik https://kuberik.github.io/kuberik
helm repo update
helm install kuberik kuberik/kuberik \
  --namespace kuberik-system --create-namespace \
  --set createNamespace=false
```

The chart is also published as an OCI artifact, `oci://ghcr.io/kuberik/charts/kuberik`; use it in place of `kuberik/kuberik` with the same flags. The release-controller, which serves the `ReleaseSource` objects your Rollouts read their releases from, is on by default and needs no values {{< needs "Next release" >}}.

## Turn on integration controllers

Each integration controller is off by default. Turn on the ones you use in your values file:

```yaml {filename="values.yaml"}
integrations:
  datadog:
    enabled: true       # Datadog monitors as health checks
  openkruise:
    enabled: true       # canary steps with OpenKruise Rollout
  environment:
    enabled: true       # promotion across clusters via GitHub
```

[Datadog](/docs/integrations/datadog/), [Roll Out with a Canary](/docs/releases/canary/) and [GitHub](/docs/integrations/github/) cover the resources each controller reads. The prometheus-controller has no release yet, so the chart does not install it; [Prometheus](/docs/integrations/prometheus/) shows how to build and deploy it.

## Expose the dashboard

The dashboard is off by default. Turn it on with an Ingress or a Gateway API HTTPRoute; set one, not both. Sign-in needs the Gateway API route.

```yaml {filename="values.yaml"}
dashboard:
  enabled: true
  gateway:
    enabled: true
    parentRef:
      name: eg
      namespace: envoy-gateway-system
    hostname: dashboard.kuberik.example.com
```

For an Ingress, set `dashboard.ingress.enabled`, `host` and `className` (plus `annotations` and `tls` as your controller needs) in place of `dashboard.gateway`.

## Turn on dashboard sign-in

The chart installs oauth2-proxy in `auth-system` and attaches an Envoy Gateway `SecurityPolicy` to the dashboard route, so every action runs as the signed-in user, subject to RBAC. Add to the values from the previous section:

```yaml {filename="values.yaml"}
dashboard:
  gateway:
    auth: true            # attach the SecurityPolicy
auth:
  enabled: true
  oidc:
    issuerUrl: https://idp.example.com
    clientId: kuberik-cluster
    existingSecret: kuberik-oidc    # keys client-secret and cookie-secret
  canonicalHost: dashboard.kuberik.example.com
  cookieDomain: .example.com
  gateway:
    name: eg
    namespace: envoy-gateway-system
```

A Secret keeps the client secret out of the rendered manifest and the cookie secret stable across upgrades; `auth.oidc.clientSecret` sets it inline instead. The chart's defaults answer `/api/` requests with 401 instead of a sign-in redirect, and serve the dashboard's static files (`^/_app/`, favicon, icons, manifest) without sign-in, so a stale session does not break polling or the page bundle {{< needs "Next release" >}}. The API itself still needs a signed-in user. [Set Up Dashboard Sign-in](/docs/installation/dashboard-auth/) covers the OIDC client and the kube-apiserver flags.

## Connect several clusters

A dashboard finds the dashboards of other clusters on its own, from the `environmentUrl` of each entry in an `Environment`'s `status.environmentInfos`. Name the cluster, and run every dashboard but one as a spoke that serves only `/api/` and sends the browser to the hub:

```yaml {filename="values.yaml"}
dashboard:
  enabled: true
  url: https://dashboard.staging.example.com
  clusterName: staging
  hubUrl: https://dashboard.production.example.com   # leave empty on the hub
```

The chart writes these values to the `kuberik-cluster-info` ConfigMap. `insecureSkipTLSVerify: true` skips TLS checks on hub-to-spoke calls; set it only for self-signed development clusters.

## Use the production values

The chart ships `values-production.yaml`: three controller replicas with a PodDisruptionBudget, the restricted Pod Security level on the namespace, a ServiceMonitor, a NetworkPolicy, the dashboard behind an Ingress, and the Datadog and environment integrations. The chart owns the namespace there, so install into `default` without `--create-namespace`:

```bash {filename="Terminal"}
helm pull oci://ghcr.io/kuberik/charts/kuberik --untar
helm install kuberik oci://ghcr.io/kuberik/charts/kuberik \
  --namespace default -f kuberik/values-production.yaml
```

Edit `dashboard.ingress.host` and `metrics.serviceMonitor.namespace` in the file first.

## Upgrade

```bash {filename="Terminal"}
helm repo update kuberik
helm upgrade kuberik kuberik/kuberik --namespace kuberik-system -f values.yaml
```

The CRDs are chart resources since chart 0.7.0, so `helm upgrade` installs new CRDs and updates existing ones. Coming from chart 0.6.1 or earlier, hand the existing CRDs to the release once, or Helm stops with `invalid ownership metadata`:

```bash {filename="adopt-crds.sh"}
kubectl get crd -o name | grep -E 'kuberik\.com$' | xargs -I{} kubectl label --overwrite {} app.kubernetes.io/managed-by=Helm
kubectl get crd -o name | grep -E 'kuberik\.com$' | xargs -I{} kubectl annotate --overwrite {} meta.helm.sh/release-name=kuberik meta.helm.sh/release-namespace=kuberik-system
```

Use your own release name and namespace; Helm 3.17 and later can do the same with `helm upgrade --take-ownership`.

{{< callout type="important" >}}
After chart 0.7.0, Rollouts get releases only from a `ReleaseSource`: create one per app and set `spec.releaseSourceRef`. A Rollout without it reports `ReleaseSourceRequired`, and `spec.releasesImagePolicy` is ignored.
{{< /callout >}}

## Uninstall

```bash {filename="Terminal"}
helm uninstall kuberik --namespace kuberik-system
```

The CRDs stay, with every Rollout and gate in them (`crds.keep`). To remove them too (`releasesources` and `releaseslices` come with the release-controller {{< needs "Next release" >}}; `--ignore-not-found` skips them before that):

```bash {filename="Terminal"}
kubectl delete crd --ignore-not-found \
  rollouts.kuberik.com rolloutgates.kuberik.com healthchecks.kuberik.com \
  rolloutschedules.kuberik.com clusterrolloutschedules.kuberik.com \
  rolloutdependencies.kuberik.com releasesources.kuberik.com releaseslices.kuberik.com \
  rollouttests.rollout.kuberik.com environments.environments.kuberik.com
```

{{< callout type="warning" >}}
Deleting the CRDs deletes every `Rollout`, `RolloutGate`, `HealthCheck`, `ReleaseSource` and `Environment` in the cluster.
{{< /callout >}}

## Check the result

```bash {filename="Terminal"}
kubectl -n kuberik-system get deployments
```

The `rollout-controller` Deployment is ready, plus `release-controller` {{< needs "Next release" >}}, `rollout-dashboard` and one Deployment per integration you turned on.

## Troubleshoot {#troubleshooting}

| Symptom | Cause | Fix |
|---|---|---|
| `namespaces "kuberik-system" already exists` | `--create-namespace` and the chart's `createNamespace: true` both create it | Add `--set createNamespace=false`, or drop `--create-namespace` |
| `auth.oidc.issuerUrl is required when auth.enabled is true` | Sign-in is on without the OIDC details | Set `auth.oidc.issuerUrl`, `auth.canonicalHost` and `auth.gateway.name` |
| `dashboard.gateway.auth is true but auth.enabled is false` | The route asks for sign-in that is not installed | Set `auth.enabled: true` with the OIDC values, or `dashboard.gateway.auth: false` |
| Sign-in redirects in a loop | The redirect URI or cookie domain does not match the host | Register `https://<canonicalHost>/oauth2/callback`; make `auth.cookieDomain` a parent of the host |
| Prometheus does not scrape the controller | The ServiceMonitor is in `kuberik-system` | Set `metrics.serviceMonitor.namespace` to the Prometheus Operator's namespace |

## Next steps

{{< next "/docs/getting-started/" "/docs/installation/dashboard-auth/" >}}
