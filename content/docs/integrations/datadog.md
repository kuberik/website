---
title: "Datadog"
description: "Fail a deploy when a Datadog monitor alerts, and hold deploys while a Datadog incident is open."
type_: integration
weight: 30
---

Kuberik reads Datadog monitors and incidents as health checks. A monitor that alerts after a deploy fails that deploy, and an open incident holds new deploys until it is resolved.

## What you need

| Requirement | Why |
|---|---|
| datadog-controller | Turns monitors and incidents into [`HealthCheck`](/docs/gates/health-checks/) status |
| A Datadog API key and application key | For the `datadog` and `datadog-incidents` classes. The application key needs `monitors_read`, plus `incident_read` for incidents and `timeseries_query` for the values the dashboard draws |
| The [Datadog Operator](https://docs.datadoghq.com/containers/datadog_operator/) (optional) | Only for `DatadogMonitor` resources |

## Give the controller credentials

The controller reads one set of credentials for the whole cluster, from a Secret named `datadog-credentials` in the `kuberik-system` namespace. With the [Helm chart](/docs/installation/helm/#turn-on-integration-controllers), turn the controller on in your values:

```yaml {filename="values.yaml"}
integrations:
  datadog:
    enabled: true
```

Without the chart, apply the controller on its own. Its `install.yaml` has no Namespace object, so `kuberik-system` must already exist:

```bash {filename="Terminal"}
kubectl apply -f https://github.com/kuberik/datadog-controller/releases/latest/download/install.yaml
```

Then create the Secret and restart the controller so it reads it. Both install paths name the Deployment the same:

```bash {filename="Terminal"}
kubectl -n kuberik-system create secret generic datadog-credentials \
  --from-literal=api-key=<your-api-key> \
  --from-literal=app-key=<your-app-key> \
  --from-literal=site=datadoghq.eu
kubectl -n kuberik-system rollout restart deployment datadog-controller-controller-manager
```

The controller maps the keys to `DD_API_KEY`, `DD_APP_KEY` and `DD_SITE`. Leave out `site` if your account is on `datadoghq.com`. The chart reads the Secret named in `integrations.datadog.existingSecret` (default `datadog-credentials`). Without credentials, every `datadog` and `datadog-incidents` HealthCheck stays `Pending` with the message `datadog API credentials are not configured: set DD_API_KEY and DD_APP_KEY`.

## Fail a deploy on alerting monitors

A `datadog` HealthCheck selects monitors by tag, by ID, or both, and turns `Unhealthy` while any selected monitor alerts. Tag the monitors that should gate deploys, for example with `service:hello-world` and `deploy-gate:true`:

```yaml {filename="healthcheck-monitors.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: HealthCheck
metadata:
  name: hello-world-monitors
  namespace: hello-world
  labels:
    app: hello-world  # the Rollout selects this
  annotations:
    healthcheck.kuberik.com/datadog-monitor-tags: "service:hello-world,deploy-gate:true"
    healthcheck.kuberik.com/datadog-group-tags: "env:production"
spec:
  class: datadog
```

| Annotation | Value |
|---|---|
| `healthcheck.kuberik.com/datadog-monitor-tags` | Comma-separated tags. A monitor is selected when it carries all of them |
| `healthcheck.kuberik.com/datadog-monitor-ids` | Comma-separated monitor IDs, such as `"123456,234567"` |
| `healthcheck.kuberik.com/datadog-group-tags` | Optional. Narrows a multi-group monitor to the groups that match, such as the `env:production` group of a monitor grouped by `env` |
| `healthcheck.kuberik.com/requeue-interval` | Optional. How often to poll Datadog. Default `60s`; values under `10s` are ignored |

Set at least one of `datadog-monitor-tags` and `datadog-monitor-ids`. Selecting by tag means a new monitor joins the gate when you tag it, and no monitor ever blocks a deploy by being missing: if no monitor carries the tags, the HealthCheck is `Healthy` and its message says nothing was evaluated.

## Hold deploys during an incident

A `datadog-incidents` HealthCheck is `Unhealthy` while any active or stable Datadog incident matches a search query. It does not depend on any monitor.

```yaml {filename="healthcheck-incidents.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: HealthCheck
metadata:
  name: hello-world-incidents
  namespace: hello-world
  labels:
    app: hello-world
  annotations:
    healthcheck.kuberik.com/datadog-incident-query: "services:hello-world AND severity:(SEV-1 OR SEV-2)"
spec:
  class: datadog-incidents
```

The controller sends `state:(active OR stable) AND <your query>` to Datadog's incident search. Join facets with `AND`, and put parentheses only around one facet's values.

## Use DatadogMonitor resources

If you manage monitors with the Datadog Operator, annotate a `DatadogMonitor` with `kuberik.com/health-check: "true"`. The controller creates a HealthCheck named `datadog-check-<monitor name>` in the same namespace, with class `datadog-monitor-crd` and a copy of the monitor's labels.

```yaml {filename="datadogmonitor.yaml"}
apiVersion: datadoghq.com/v1alpha1
kind: DatadogMonitor
metadata:
  name: hello-world-error-rate
  namespace: hello-world
  labels:
    app: hello-world  # copied to the HealthCheck
  annotations:
    kuberik.com/health-check: "true"
spec:
  name: "hello-world error rate"
  type: metric alert
  query: "sum(last_5m):sum:hello_world.errors{env:production}.as_count() > 10"
  message: "hello-world returns errors after a deploy"
```

Removing the annotation deletes the generated HealthCheck. This path needs no Datadog credentials, because the Datadog Operator syncs the monitor state into the resource. The controller checks for the `DatadogMonitor` CRD once, at startup: if you install the Operator after the controller, restart the controller.

## Select the checks from the Rollout

The [`Rollout`](/docs/concepts/rollouts/) picks up every HealthCheck whose labels match `healthCheckSelector`, in its own namespace unless you add a `namespaceSelector`:

```yaml {filename="rollout.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: Rollout
metadata:
  name: hello-world
  namespace: hello-world
spec:
  releaseSourceRef:
    name: hello-world
  bakeTime: 10m  # clear this long
  healthCheckSelector:
    selector:
      matchLabels:
        app: hello-world
```

Check that the HealthChecks report a status:

```bash {filename="Terminal"}
kubectl -n hello-world get healthchecks -o custom-columns=NAME:.metadata.name,CLASS:.spec.class,STATUS:.status.status,MESSAGE:.status.message
```

## How it works

{{< fig id="datadog-health-paths" caption="datadog-controller turns monitors and incidents into HealthChecks; the Rollout reads only the HealthChecks." >}}

The controller writes Datadog's state into the HealthCheck status:

| Datadog state | `datadog` class | `datadog-monitor-crd` class |
|---|---|---|
| `OK` | `Healthy` | `Healthy` |
| `Alert` | `Unhealthy` | `Unhealthy` |
| `Warn`, `No Data`, `Skipped`, `Ignored` | `Healthy` | `Pending` |
| API error or unknown monitor ID | `Pending` | Not applicable |

A `datadog` check also writes one entry per monitor to `status.observations`: for a metric monitor, its current value against the critical threshold (the controller runs the monitor's query again), otherwise the monitor's state. A `datadog-incidents` check writes the count of open incidents and names each one. The dashboard shows these entries on the check's card, and a check that cannot run writes none.

The Rollout starts the bake once every selected HealthCheck is `Healthy`, and fails the deploy if any of them turns `Unhealthy` after the deploy started. While a check is `Unhealthy`, the Rollout also holds new automatic deploys and reports `DeploymentBlocked` with reason `UnhealthyHealthChecks`. See [Verify with Health Checks](/docs/gates/health-checks/) for the full rules.

## Troubleshoot

| Symptom | Cause | Fix |
|---|---|---|
| No `datadog-check-*` HealthCheck appears, and the controller log says `DatadogMonitor CRD not installed` | The Datadog Operator was installed after the controller started | Run `kubectl -n kuberik-system rollout restart deployment datadog-controller-controller-manager` |
| HealthCheck `Pending`: `datadog API credentials are not configured` | No `datadog-credentials` Secret in the controller's namespace | Create the Secret, then restart the controller so it reads the new environment |
| HealthCheck `Healthy`: `No Datadog monitors carry tags [...]` | No monitor has every listed tag | Tag the monitors in Datadog, or fix the annotation |
| HealthCheck `Pending`: `get monitor <id>: ...` | The monitor ID does not exist, or the application key lacks `monitors_read` | Check the ID and the key's scopes |
| No `datadog-check-*` HealthCheck appears | The `DatadogMonitor` has no `kuberik.com/health-check: "true"` annotation | Add the annotation with the value in quotes |

## Next steps

{{< next "/docs/gates/health-checks/" "/docs/reference/annotations/" >}}
