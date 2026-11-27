---
title: "Install with Helm"
description: "Install the controllers, the dashboard and dashboard sign-in from one Helm release."
keywords: ["multiple clusters#connect-several-clusters", "hub#connect-several-clusters", "spoke#connect-several-clusters", "control plane#connect-several-clusters", "multicluster#connect-several-clusters", "multi-cluster#connect-several-clusters"]
type_: guide
icon: cube
weight: 10
---

Install Kuberik from its Helm chart: one release installs the rollout-controller, the release-controller, the integration controllers you turn on, and the dashboard.

Before you start, you need Kubernetes 1.30 or later, Helm 3, and Flux 2.6 or later in the cluster ([install Flux](https://fluxcd.io/flux/installation/)): Kuberik picks the version and [Flux](/docs/integrations/fluxcd/) applies it. The rollout-controller ships ValidatingAdmissionPolicies (`admissionregistration.k8s.io/v1`), which Kubernetes serves from 1.30.

## Install the chart

Add the chart repository and install the release into `kuberik-system`. Helm creates the namespace, so the chart leaves it alone.

```bash {filename="Terminal"}
helm repo add kuberik https://kuberik.github.io/kuberik
helm repo update
helm install kuberik kuberik/kuberik \
  --namespace kuberik-system --create-namespace \
  --set createNamespace=false
```

The chart is also published as an OCI artifact, `oci://ghcr.io/kuberik/charts/kuberik`; use it in place of `kuberik/kuberik` with the same flags. The release-controller, which serves the `ReleaseSource` objects your Rollouts read their releases from, is on by default and needs no values.

## Turn on integration controllers

Each integration controller is off by default. Turn on the ones you use in your values file:

```yaml {filename="values.yaml"}
integrations:
  datadog:
    enabled: true       # Datadog monitors as health checks
  openkruise:
    enabled: true       # canary steps with OpenKruise Rollout
  environment:
    enabled: true       # promotion between environments via GitHub
```

Promotion between environments always goes through GitHub deployments, even when every environment runs in one cluster. [Datadog](/docs/integrations/datadog/), [Roll Out with a Canary](/docs/releases/canary/) and [GitHub](/docs/integrations/github/) cover the resources each controller reads. The chart does not install the prometheus-controller; [Prometheus](/docs/integrations/prometheus/) shows how to build and deploy it.

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

A Secret keeps the client secret out of the rendered manifest and the cookie secret stable across upgrades; `auth.oidc.clientSecret` sets it inline instead. The chart's defaults answer `/api/` requests with 401 instead of a sign-in redirect, and serve the dashboard's static files (`^/_app/`, favicon, icons, manifest) without sign-in, so a stale session does not break polling or the page bundle. The API itself still needs a signed-in user. [Set Up Dashboard Sign-in](/docs/installation/dashboard-auth/) covers the OIDC client and the kube-apiserver flags.

## Connect several clusters

To run Kuberik in multiple clusters, install the chart in every cluster. Each cluster's controllers deploy its own Rollouts, and clusters coordinate only through GitHub deployments ([Sites and waves](/docs/concepts/environments/#sites-and-waves)).

The hub is the dashboard people open. It reads and acts on the other clusters, the spokes, through their `/api/`, and deploys do not depend on it.

A dashboard finds the dashboards of other clusters on its own, from the `environmentUrl` of each entry in an `Environment`'s `status.environmentInfos`. Name the cluster, and run every dashboard but one as a spoke that serves only `/api/` and sends the browser to the hub:

```yaml {filename="values.yaml"}
dashboard:
  enabled: true
  url: https://dashboard.staging.example.com
  clusterName: staging
  hubUrl: https://dashboard.production.example.com   # leave empty on the hub
```

The `environmentUrl` comes from the environment integration: on each cluster, the environment-controller publishes the host of the dashboard's Ingress or HTTPRoute from [Expose the dashboard](#expose-the-dashboard), not `dashboard.url`. So every cluster needs `integrations.environment.enabled` and an exposed dashboard.

The chart writes these values to the `kuberik-cluster-info` ConfigMap. `insecureSkipTLSVerify: true` skips TLS checks on hub-to-spoke calls; set it only for self-signed development clusters.

### List the spokes the hub trusts

The hub sends the viewer's sign-in to a spoke only when the spoke's origin is listed in `dashboard.spokeUrlAllowlist`. Set it on the hub:

```yaml {filename="values.yaml"}
dashboard:
  spokeUrlAllowlist:
    - https://dashboard.staging.example.com
    - https://*.spokes.example.com
```

| Rule | Detail |
|---|---|
| Format | A list, or one comma-separated string, of origins: `scheme://host[:port]`, no path |
| Wildcard | `https://*.example.com` matches any subdomain, never `example.com` itself |
| `http://` | Only when the origin is listed with `http://` |
| Unset | **The hub shows no spokes.** It drops every discovered spoke and logs each once |
| Spokes | Leave it unset on spokes and on a single cluster |

Spoke URLs come from GitHub deployment statuses, which anyone who can post a deployment status can set, so the list is the hub's trust boundary. Calls to a listed spoke carry only the `Accept`, `Content-Type` and `If-None-Match` headers, the bearer token and the `gh_token` cookie, and the hub never follows a redirect from a spoke.

## Use the production values

The chart ships `values-production.yaml`: three controller replicas with a PodDisruptionBudget, the restricted Pod Security level on the namespace, a ServiceMonitor, a NetworkPolicy, the dashboard behind an Ingress, and the Datadog and environment integrations. The chart owns the namespace there, so install into `default` without `--create-namespace`:

```bash {filename="Terminal"}
helm pull oci://ghcr.io/kuberik/charts/kuberik --untar
helm install kuberik oci://ghcr.io/kuberik/charts/kuberik \
  --namespace default -f kuberik/values-production.yaml
```

Edit `dashboard.ingress.host` and `metrics.serviceMonitor.namespace` in the file first.

## Upgrade

[Upgrade Kuberik](/docs/installation/upgrade/) lists what changes in chart 0.10.0 and what to change in Git before you run these commands.

First, write a [ReleaseSource](/docs/releases/publish/) for each Rollout. Rollouts read releases only from a ReleaseSource: until a Rollout's `spec.releaseSourceRef` names one, it deploys nothing new and reports [No release source](/docs/operate/troubleshooting/#no-release-source). The ReleaseSource kind and the field come with the upgrade, so apply them right after it.

```bash {filename="Terminal"}
helm repo update kuberik
helm upgrade kuberik kuberik/kuberik --namespace kuberik-system -f values.yaml
kubectl apply -f releasesource.yaml
kubectl patch rollout hello-world -n hello-world --type merge \
  -p '{"spec":{"releaseSourceRef":{"name":"hello-world"}}}'
```

After a [production install](#use-the-production-values), delete the old `kuberik/` directory and pull the chart again (`helm pull` refuses to untar over it), so `kuberik/values-production.yaml` matches the new version. Then upgrade from the OCI chart: `helm upgrade kuberik oci://ghcr.io/kuberik/charts/kuberik --namespace default -f kuberik/values-production.yaml`.

The CRDs are chart resources, so `helm upgrade` installs new CRDs and updates existing ones. If the CRDs were installed outside this release, hand them to it once, or Helm stops with `invalid ownership metadata`:

```bash {filename="adopt-crds.sh"}
kubectl get crd -o name | grep -E 'kuberik\.com$' | xargs -I{} kubectl label --overwrite {} app.kubernetes.io/managed-by=Helm
kubectl get crd -o name | grep -E 'kuberik\.com$' | xargs -I{} kubectl annotate --overwrite {} meta.helm.sh/release-name=kuberik meta.helm.sh/release-namespace=kuberik-system
```

Use your own release name and namespace; Helm 3.17 and later can do the same with `helm upgrade --take-ownership`.

## Uninstall

```bash {filename="Terminal"}
helm uninstall kuberik --namespace kuberik-system
```

After a production install, use `--namespace default`. The chart owns `kuberik-system` there, so the uninstall deletes the namespace and every Secret in it, such as `github-app-credentials` and `datadog-credentials`.

The CRDs stay, with every Rollout and gate in them (`crds.keep`). To remove them too:

```bash {filename="Terminal"}
kubectl delete crd --ignore-not-found \
  rollouts.kuberik.com rolloutgates.kuberik.com healthchecks.kuberik.com \
  rolloutschedules.kuberik.com clusterrolloutschedules.kuberik.com \
  rolloutdependencies.kuberik.com releasesources.kuberik.com releaseslices.kuberik.com \
  approvalpolicies.kuberik.com clusterapprovalpolicies.kuberik.com rolloutapprovals.kuberik.com \
  rollouttests.rollout.kuberik.com environments.environments.kuberik.com
```

{{< callout type="warning" >}}
Deleting the CRDs deletes every `Rollout`, `RolloutGate`, `HealthCheck`, `ReleaseSource` and `Environment` in the cluster.
{{< /callout >}}

## Check the result

```bash {filename="Terminal"}
kubectl -n kuberik-system get deployments
```

The `rollout-controller` Deployment is ready, plus `release-controller`, `rollout-dashboard` if you turned the dashboard on, and one Deployment per integration you turned on.

## Troubleshoot {#troubleshooting}

| Symptom | Cause | Fix |
|---|---|---|
| `namespaces "kuberik-system" already exists` | `--create-namespace` and the chart's `createNamespace: true` both create it | Add `--set createNamespace=false`, or drop `--create-namespace` |
| `auth.oidc.issuerUrl is required when auth.enabled is true` | Sign-in is on without the OIDC details | Set `auth.oidc.issuerUrl`, `auth.canonicalHost` and `auth.gateway.name` |
| `dashboard.gateway.auth is true but auth.enabled is false` | The route asks for sign-in that is not installed | Set `auth.enabled: true` with the OIDC values, or `dashboard.gateway.auth: false` |
| Sign-in redirects in a loop | The redirect URI or cookie domain does not match the host | Register `https://<canonicalHost>/oauth2/callback`; make `auth.cookieDomain` a parent of the host |
| Prometheus does not scrape the controller | The ServiceMonitor is in `kuberik-system` | Set `metrics.serviceMonitor.namespace` to the Prometheus Operator's namespace |
| No ServiceMonitor exists | The Prometheus Operator CRDs were not in the cluster when the chart was installed | Run `helm upgrade` after installing the Prometheus Operator |
| The hub shows no other clusters; its log reads `dropping discovered spoke "…" (origin not in SPOKE_URL_ALLOWLIST)` | The spoke's origin is not in `dashboard.spokeUrlAllowlist` | [List the spokes the hub trusts](#list-the-spokes-the-hub-trusts) |
| The dashboard does not load inside an iframe | The dashboard refuses to be framed by any site (`frame-ancestors 'none'`) | Open it in its own tab |

## Next steps

{{< next "/docs/getting-started/" "/docs/installation/dashboard-auth/" >}}
