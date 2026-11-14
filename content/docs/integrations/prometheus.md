---
title: "Prometheus"
description: "Fail a deploy when a Prometheus alert fires after it, and hold new deploys while the alert keeps firing."
type_: integration
weight: 40
---

Kuberik reads Prometheus alerts as health checks. An alert that fires after a deploy fails that deploy, and new automatic deploys wait while it keeps firing.

{{< callout type="important" >}}
The `prometheus-alert` class comes from prometheus-controller, which has no release yet. Build it from its main branch as shown below.
{{< /callout >}}

## What you need

| Requirement | Why |
|---|---|
| Kuberik installed | prometheus-controller ships no CRD. It reads and writes the [`HealthCheck`](/docs/gates/health-checks/) resources that rollout-controller defines |
| Go, Docker and a registry you can push to | There is no published image to pull, so you build one |
| A Prometheus server the controller can reach over HTTP | The controller calls its `/api/v1/query_range` and `/api/v1/rules` APIs |
| Alerting rules loaded in that Prometheus | The controller reads the `ALERTS` series Prometheus records for its rules. Alertmanager is not involved |

## Install the controller

The Helm chart does not install prometheus-controller. Setting `integrations.prometheus.enabled` only prints build instructions after `helm install`. Build the image from main, push it, and deploy it with the same tag:

```bash {filename="Terminal"}
git clone https://github.com/kuberik/prometheus-controller
cd prometheus-controller
make docker-build docker-push IMG=ghcr.io/acme/prometheus-controller:main
make deploy IMG=ghcr.io/acme/prometheus-controller:main
```

Always pass `IMG` to `make deploy`. Without it, the Deployment points at `controller:latest`, which no registry serves. The controller runs as `prometheus-controller-controller-manager` in the `kuberik-system` namespace, with a ClusterRole that reads Secrets and updates HealthChecks in every namespace. Wait for it to start:

```bash {filename="Terminal"}
kubectl -n kuberik-system rollout status deployment prometheus-controller-controller-manager
```

## Fail a deploy on a firing alert

A `prometheus-alert` HealthCheck selects alerts by label and turns `Unhealthy` while a selected alert fires:

```yaml {filename="healthcheck-alerts.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: HealthCheck
metadata:
  name: hello-world-alerts
  namespace: hello-world
  labels:
    app: hello-world  # the Rollout selects on this
  annotations:
    healthcheck.kuberik.com/prometheus-url: "http://prometheus.monitoring:9090"
    healthcheck.kuberik.com/prometheus-alert-labels: "alertname=HighErrorRate,service=hello-world"
spec:
  class: prometheus-alert
```

| Annotation | Value |
|---|---|
| `healthcheck.kuberik.com/prometheus-url` | Required. The Prometheus base URL, without `/api/v1` |
| `healthcheck.kuberik.com/prometheus-alert-labels` | Required. Comma-separated `key=value` pairs, including `alertname`. An alert is selected when it carries all of them |
| `healthcheck.kuberik.com/prometheus-credentials-secret` | Optional. A Secret name, or `namespace/name` for a Secret in another namespace |
| `healthcheck.kuberik.com/requeue-interval` | Optional. How often to poll Prometheus. Default `30s`, minimum `5s` |

The labels become an exact-match selector on the `ALERTS` series. The example above queries:

```text {filename="PromQL"}
ALERTS{alertname="HighErrorRate",service="hello-world"}
```

Always include `alertname`, so each HealthCheck follows one alert. If the labels select several series, the worst state wins: one firing series turns the check `Unhealthy` while others are pending. Other labels narrow the alert further, including labels from the alerting series such as `namespace` or `instance`. Values match exactly: regular expressions are not supported. Each poll covers the time since the previous poll, so an alert that fired and resolved between two polls still turns the check `Unhealthy`.

## Authenticate to Prometheus

If Prometheus needs credentials, put them in a Secret and name it in `prometheus-credentials-secret`:

```yaml {filename="prometheus-credentials.yaml"}
apiVersion: v1
kind: Secret
metadata:
  name: prometheus-credentials
  namespace: hello-world
type: Opaque
stringData:
  token: <your-token>  # or username and password for basic auth
```

With a `token` key, the controller sends `Authorization: Bearer <token>`. Without one, it uses `username` and `password` as basic auth. The controller watches the Secret, so a rotated token takes effect on the next poll.

## Read the status

The controller writes one of these into the HealthCheck status. The message lists the labels from `prometheus-alert-labels`, sorted by key, as `key=value` pairs joined by commas:

| Prometheus | Status | Message |
|---|---|---|
| No selected alert is pending or firing | `Healthy` | `No alerts firing for alertname=HighErrorRate, service=hello-world` |
| A selected alert fired since the last poll | `Unhealthy` | `Alert firing for alertname=HighErrorRate, service=hello-world` |
| A selected alert is pending: its `for` duration has not passed | `Pending` | `Alert pending for alertname=HighErrorRate, service=hello-world` |
| Prometheus is unreachable or returns an error | `Unhealthy` | `Failed to query Prometheus: ...` |

The message names your selector, not the labels of the series that fired. To see which series fired, run the `ALERTS` query in Prometheus.

The controller also writes one entry to `status.observations`, which rollout-dashboard newer than v0.9.3-rc.0 draws as the check's figure. While the alert is pending or firing, the entry shows the alert's value against its limit. Declare the limit, because the Prometheus API does not expose it:

| Annotation | Value |
|---|---|
| `healthcheck.kuberik.com/observation-limit` | The rule's limit as a plain decimal, such as `0.05` |
| `healthcheck.kuberik.com/observation-direction` | `Above` or `Below`: the side of the limit that is bad. Required with the limit |
| `healthcheck.kuberik.com/observation-unit` | Optional. A unit such as `Percent` or `Milliseconds` |
| `healthcheck.kuberik.com/observation-name` | Optional. Defaults to the `alertname` label |

Without these annotations, the controller reads the limit from a rule expression of the form `<expr> > N` (or `>=`, `<`, `<=`). When no alert is active there is no value: with a declared limit the entry is a healthy or unhealthy state, otherwise a count named `firing alerts`.

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
  bakeTime: 10m  # the alerts must stay quiet this long
  healthCheckSelector:
    selector:
      matchLabels:
        app: hello-world
```

Check that the HealthCheck reports a status:

```bash {filename="Terminal"}
kubectl -n hello-world get healthchecks -o custom-columns=NAME:.metadata.name,CLASS:.spec.class,STATUS:.status.status,MESSAGE:.status.message
```

## How it works

The controller polls Prometheus at the requeue interval and records each `Unhealthy` result in `status.lastErrorTime`. The Rollout fails a deploy during bake when a selected HealthCheck has a `lastErrorTime` after the deploy started. While a check is `Unhealthy`, the Rollout also holds new automatic deploys and reports `DeploymentBlocked` with reason `UnhealthyHealthChecks`. A missing annotation or an unreachable Prometheus counts as `Unhealthy` too, so a broken check fails the deploy rather than letting it through. See [Verify with Health Checks](/docs/gates/health-checks/) for the full rules.

## Troubleshoot

| Symptom | Cause | Fix |
|---|---|---|
| The HealthCheck has no status | The controller is not running, or `spec.class` is not exactly `prometheus-alert` | Check the Deployment in `kuberik-system` and the class |
| The controller Pod is in `ImagePullBackOff` on `controller:latest` | `make deploy` ran without `IMG` | Run `make deploy IMG=<your image>` again |
| `Unhealthy`: `Failed to query Prometheus: ...` with the chart's `networkPolicy.enabled` | The chart's `kuberik-controllers` NetworkPolicy also selects this controller and allows egress only to DNS and ports 443 and 6443 | Add your Prometheus port to `networkPolicy.extraEgress` in the chart values |
| `Unhealthy`: `annotation healthcheck.kuberik.com/prometheus-url not found or empty` | A required annotation is missing | Add `prometheus-url` and `prometheus-alert-labels` |
| `Unhealthy`: `Failed to get credentials: ...` | The Secret is missing, or has neither a `token` nor a `username` key | Create the Secret with one of the keys |
| `Healthy` while the alert fires in Prometheus | A label value differs from the alert's, or the URL points at another Prometheus | Run the `ALERTS{...}` query in that Prometheus and compare the labels |

## Next steps

{{< next "/docs/gates/health-checks/" "/docs/integrations/datadog/" "/docs/reference/annotations/" >}}
