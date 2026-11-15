---
title: "Monitor Rollouts"
description: "Track deploys and rollout state with kube-state-metrics and Prometheus."
type_: guide
weight: 30
aliases: ["/docs/guides/monitoring/"]
---

Export every [Rollout](/docs/concepts/rollouts/)'s latest deploy, bake state and gate state as Prometheus metrics, then chart and alert on them. Kuberik writes this state to the Rollout's `status`; [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics) turns it into metrics.

To fail a deploy when a Prometheus alert fires, use the [Prometheus](/docs/integrations/prometheus/) integration instead.

## Export Rollout status with kube-state-metrics

Add a custom resource configuration for `Rollout` to the kube-state-metrics Helm values, and let it list and watch Rollouts. Every metric reads `status.history[0]`, the latest deploy, or `status.conditions`.

```yaml {filename="values.yaml"}
rbac:
  extraRules:
    - apiGroups: ["kuberik.com"]
      resources: ["rollouts"]
      verbs: ["list", "watch"]
customResourceState:
  enabled: true
  config:
    kind: CustomResourceStateMetrics
    spec:
      resources:
        - groupVersionKind:
            group: kuberik.com
            version: v1alpha1
            kind: Rollout
          metricNamePrefix: kuberik
          labelsFromPath:
            namespace: [metadata, namespace]
            name: [metadata, name]
          metrics:
            - name: rollout_latest_deployment_info
              help: "The latest deploy of the Rollout"
              each:
                type: Info
                info:
                  labelsFromPath:
                    version: [status, history, "0", version, version]
                    tag: [status, history, "0", version, tag]
                    revision: [status, history, "0", version, revision]
                    bake_status: [status, history, "0", bakeStatus]
                    message: [status, history, "0", message]
            - name: rollout_latest_deployment_timestamp
              help: "When the latest deploy started, in Unix seconds"
              each:
                type: Gauge
                gauge:
                  path: [status, history, "0", timestamp]
            - name: rollout_bake_start_timestamp
              help: "When bake time started for the latest deploy, in Unix seconds"
              each:
                type: Gauge
                gauge:
                  path: [status, history, "0", bakeStartTime]
            - name: rollout_bake_end_timestamp
              help: "When bake time ended for the latest deploy, in Unix seconds"
              each:
                type: Gauge
                gauge:
                  path: [status, history, "0", bakeEndTime]
            - name: rollout_bake_status
              help: "Bake status of the latest deploy, 1 for the current state"
              each:
                type: StateSet
                stateSet:
                  labelName: bake_status
                  path: [status, history, "0", bakeStatus]
                  list: [Deploying, InProgress, Succeeded, Failed, Cancelled]
            - name: rollout_available_releases
              help: "Releases in the catalogue of the Rollout's ReleaseSource"
              each:
                type: Gauge
                gauge:
                  path: [status, releaseSource, count]
            - name: rollout_condition
              help: "Rollout conditions, 1 when True and 0 when False"
              each:
                type: Gauge
                gauge:
                  path: [status, conditions]
                  labelsFromPath:
                    type: [type]
                    reason: [reason]
                  valueFrom: [status]
```

```bash {filename="Terminal"}
helm upgrade --install kube-state-metrics prometheus-community/kube-state-metrics \
  --namespace monitoring --create-namespace \
  -f values.yaml
```

kube-state-metrics converts the RFC 3339 times in `status` to Unix seconds, and `True`/`False` condition statuses to 1 and 0.

## Read the metrics

Each metric carries the `namespace` and `name` of the Rollout.

| Metric | Value | Labels |
|--------|-------|--------|
| `kuberik_rollout_latest_deployment_info` | Always 1 | `version`, `tag`, `revision` (git SHA), `bake_status`, `message`, for example `Automatic deployment` or `Manual deployment` |
| `kuberik_rollout_latest_deployment_timestamp` | When the latest deploy started | |
| `kuberik_rollout_bake_start_timestamp` | When every health check first reported healthy and bake time began | |
| `kuberik_rollout_bake_end_timestamp` | When the deploy succeeded, failed, timed out, or was cancelled by a newer deploy | |
| `kuberik_rollout_bake_status` | 1 for the current state, 0 for the others | `bake_status`: `Deploying`, `InProgress`, `Succeeded`, `Failed`, `Cancelled` |
| `kuberik_rollout_available_releases` | Number of releases in the [`ReleaseSource`](/docs/releases/publish/) catalogue, older ones included | |
| `kuberik_rollout_condition` | 1 when the condition is True, 0 when False | `type`, for example `Ready`, `GatesPassing`, `DeploymentBlocked`; `reason` |

`Deploying` means Kuberik has written the new version and waits for the health checks to report healthy; `InProgress` means bake time is running.

## Query deploys

Rollouts deploying or baking right now:

```promql {filename="PromQL"}
kuberik_rollout_bake_status{bake_status=~"Deploying|InProgress"} == 1
```

Rollouts whose latest deploy failed in the last hour:

```promql {filename="PromQL"}
kuberik_rollout_bake_status{bake_status="Failed"} == 1
  and on (namespace, name)
(time() - kuberik_rollout_bake_end_timestamp < 3600)
```

Deploys per Rollout in the last 24 hours. `changes()` counts how often the latest deploy's start time moved; a scrape interval that holds two deploys counts them once.

```promql {filename="PromQL"}
changes(kuberik_rollout_latest_deployment_timestamp[24h])
```

Bake duration of the latest deploy, in seconds:

```promql {filename="PromQL"}
kuberik_rollout_bake_end_timestamp - kuberik_rollout_bake_start_timestamp
```

Rollouts whose gates hold a release:

```promql {filename="PromQL"}
kuberik_rollout_condition{type="GatesPassing"} == 0
```

The `reason` label says which kind of gate: `NoAllowedVersions` when a waiting release is missing from an `allowedVersions` list (approvals, dependencies, environments), `SomeGatesBlocking` when a gate has `passing: false`. Both appear only while a release is waiting, so an up-to-date Rollout behind a closed deployment window does not fire the alert.

## Alert on failed and stuck deploys

These rules fire when a bake fails, when a deploy has waited more than 30 minutes for its health checks, and when gates have held a Rollout for an hour.

```yaml {filename="kuberik-rules.yaml"}
groups:
  - name: kuberik
    rules:
      - alert: RolloutBakeFailed
        expr: kuberik_rollout_bake_status{bake_status="Failed"} == 1
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "Rollout {{ $labels.namespace }}/{{ $labels.name }} failed its bake"
          description: "A health check reported an error, or deployTimeout passed before the bake started. Automatic deploys of this Rollout are stopped."
      - alert: RolloutDeployStuck
        expr: |
          kuberik_rollout_bake_status{bake_status="Deploying"} == 1
            and on (namespace, name)
          (time() - kuberik_rollout_latest_deployment_timestamp > 1800)
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Rollout {{ $labels.namespace }}/{{ $labels.name }} has been deploying for over 30 minutes"
          description: "The health checks have not reported healthy since the deploy started, so bake time has not begun."
      - alert: RolloutGatesBlocked
        expr: kuberik_rollout_condition{type="GatesPassing"} == 0
        for: 1h
        labels:
          severity: info
        annotations:
          summary: "Rollout {{ $labels.namespace }}/{{ $labels.name }} is held by gates"
          description: "A release has waited behind this Rollout's gates for over an hour."
```

A deploy stays in `Deploying` until every selected health check reports healthy, and fails only when a check reports an error or the Rollout's `deployTimeout` passes; without `deployTimeout` it can wait forever. `InProgress` always ends when bake time does, so an alert on it needs a threshold above your longest `bakeTime`.

Load the file with `rule_files` in Prometheus, or wrap the `groups` in a `PrometheusRule` when you run the Prometheus Operator.

## Check the result

Query kube-state-metrics directly to confirm the Rollout metrics are exported.

```bash {filename="Terminal"}
kubectl port-forward -n monitoring svc/kube-state-metrics 8080:8080 &
curl -s localhost:8080/metrics | grep '^kuberik_rollout_bake_status'
```

```text {filename="Output"}
kuberik_rollout_bake_status{bake_status="Cancelled",customresource_group="kuberik.com",customresource_kind="Rollout",customresource_version="v1alpha1",name="hello-world",namespace="hello-world"} 0
kuberik_rollout_bake_status{bake_status="Deploying",customresource_group="kuberik.com",customresource_kind="Rollout",customresource_version="v1alpha1",name="hello-world",namespace="hello-world"} 0
kuberik_rollout_bake_status{bake_status="Failed",customresource_group="kuberik.com",customresource_kind="Rollout",customresource_version="v1alpha1",name="hello-world",namespace="hello-world"} 0
kuberik_rollout_bake_status{bake_status="InProgress",customresource_group="kuberik.com",customresource_kind="Rollout",customresource_version="v1alpha1",name="hello-world",namespace="hello-world"} 0
kuberik_rollout_bake_status{bake_status="Succeeded",customresource_group="kuberik.com",customresource_kind="Rollout",customresource_version="v1alpha1",name="hello-world",namespace="hello-world"} 1
```

The dashboard reads the same fields: its Activity page is the deploy feed across every cluster, and each rollout page shows the bake and health-check state these metrics export.

![The Activity page: no failed deploys, 99 deploys in seven days, a median of 2 minutes to production and a chart of deploys per day](/images/docs/operate/monitoring-activity.png)

## Next steps

{{< next "/docs/gates/health-checks/" "/docs/integrations/datadog/" >}}
