---
title: "Verify with Health Checks"
description: "Fail a deploy when the app is unhealthy during bake time."
type_: guide
weight: 10
aliases: ["/docs/guides/health-checks/"]
---

A [Rollout](/docs/concepts/rollouts/) with health checks marks a deploy succeeded only after its checks stay healthy for the bake time, and fails it when a check turns unhealthy. While a check is unhealthy, new automatic deploys wait.

Works with: Flux Kustomizations (built into rollout-controller), [Datadog](/docs/integrations/datadog/) monitors and incidents (datadog-controller), and [Prometheus](/docs/integrations/prometheus/) alerts (prometheus-controller).

## Add a health check

A [`HealthCheck`](/docs/reference/api/#healthcheck) reports `Healthy`, `Unhealthy` or `Pending` in `status.status`; its `spec.class` names the controller that fills it in. This one follows a Flux Kustomization:

```yaml {filename="healthcheck.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: HealthCheck
metadata:
  name: hello-world
  namespace: hello-world
  labels:
    app: hello-world  # the Rollout selects on this
  annotations:
    healthcheck.kuberik.com/kustomization: "hello-world"
spec:
  class: kustomization
```

The annotation takes the Kustomization's name, or `<namespace>/<name>` for one in another namespace.

## Select health checks from the Rollout

Set `healthCheckSelector` on the `Rollout`, and a bake time the checks must hold:

```yaml {filename="rollout.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: Rollout
metadata:
  name: hello-world
  namespace: hello-world
spec:
  releaseSourceRef:
    name: hello-world
  bakeTime: 10m  # healthy this long after bake starts
  deployTimeout: 15m
  healthCheckSelector:
    selector:
      matchLabels:
        app: hello-world
```

Each deploy, and each retry, then goes through these rules:

| Moment | What happens |
|---|---|
| Deploy starts | Every selected HealthCheck is reset to `Pending` and its `lastErrorTime` is cleared, and the deploy's `bakeStatus` is `Deploying` |
| Every check is `Healthy` again | Bake starts: `bakeStatus` is `InProgress` |
| Any check reports an error after the deploy started | The deploy fails (`bakeStatus` `Failed`, `Ready` reason `BakeTimeFailed`), before or during bake |
| `deployTimeout` passes before bake starts | The deploy fails |
| `bakeTime` passes with no error | The deploy succeeds. Without `bakeTime`, it succeeds as soon as bake starts |

`deployTimeout` fails the deploy if bake has not started by then. A Rollout without `healthCheckSelector` has no checks: bake starts at once.

## Hold deploys on an unhealthy check

You do not configure this: while any selected HealthCheck is `Unhealthy`, the Rollout starts no new automatic deploy and reports `DeploymentBlocked=True` with reason `UnhealthyHealthChecks`. `Pending` does not block. The very first deploy and manual deploys (a pin in `spec.wantedVersion` or `rollout.kuberik.com/force-deploy`) are not held.

After a deploy fails, the Rollout starts no new automatic deploy until you retry it, set `rollout.kuberik.com/unblock-failed: "true"`, or deploy a version by hand ([Operate a Rollout with kubectl](/docs/operate/manual-actions/)).

A manual deploy made while a check is `Unhealthy`, and any deploy that follows one that did not succeed, sets `BakeFailureDisabled=True` (reasons `DeployedWithUnhealthyHealthChecks` and `PreviousBakeFailed`). For that deploy, health-check errors and `deployTimeout` do not fail it, so a fix can land during an incident.

```bash {filename="Terminal"}
kubectl -n hello-world get rollout hello-world -o jsonpath='{range .status.conditions[*]}{.type}={.status} ({.reason}){"\n"}{end}'
```

## Choose how a Kustomization is checked

With `spec.wait: false` (the default) on the Kustomization, the check reads the Kustomization and every resource it manages with kstatus. With `spec.wait: true`, it reads only the Kustomization's `Ready` condition and assumes kustomize-controller runs with the `CancelHealthCheckOnNewRevision` feature gate (Flux 2.7 or later); without it, a failing revision holds the next one until `spec.timeout`.

```yaml {filename="kustomization.yaml"}
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: hello-world
  namespace: hello-world
spec:
  interval: 10m
  prune: true
  wait: true  # health from Ready only
  timeout: 5m
  sourceRef:
    kind: OCIRepository
    name: hello-world
```

[Flux](/docs/integrations/fluxcd/#report-kustomization-health) lists which `Ready` reasons count as unhealthy.

## Select health checks in other namespaces

Add `namespaceSelector` to read HealthChecks from every namespace whose labels match, for example checks a platform team keeps in a shared namespace. It replaces the Rollout's own namespace, so label that namespace too if its checks should still count.

```yaml {filename="rollout-cross-namespace.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: Rollout
metadata:
  name: hello-world
  namespace: hello-world
spec:
  releaseSourceRef:
    name: hello-world
  healthCheckSelector:
    selector:
      matchLabels:
        app: hello-world
    namespaceSelector:
      matchLabels:
        kuberik.com/health-checks: "true"
```

A deploy resets each selected check to `Pending` and clears its `lastErrorTime`. A check that several Rollouts select through `namespaceSelector` resets whenever any of them deploys, so keep the label `selector` narrow enough that each Rollout selects only its own checks.

## Check the result

List the checks and the latest deploy's bake state:

```bash {filename="Terminal"}
kubectl -n hello-world get healthchecks -o custom-columns=NAME:.metadata.name,STATUS:.status.status,MESSAGE:.status.message
kubectl -n hello-world get rollout hello-world -o jsonpath='{.status.history[0].bakeStatus}: {.status.history[0].bakeStatusMessage}{"\n"}'
```

```text {filename="Output"}
NAME          STATUS    MESSAGE
hello-world   Healthy   Kustomization and all managed resources are healthy
InProgress: Bake started, monitoring for errors.
```

A failed deploy lists the checks that failed it in `status.history[0].failedHealthChecks`. The dashboard shows the same checks on the rollout page:

![The Health checks card of a production rollout: a Flux Deployment check and two Prometheus alerts, App Down Alert and High Error Rate Alert, all passing](/images/docs/gates/health-checks.png)

## Troubleshoot

| Symptom | Cause | Fix |
|---|---|---|
| Bake never starts | A selected check stays `Pending` or `Unhealthy` | Read its `status.message`; set `deployTimeout` so the deploy fails instead of waiting |
| New releases are not deployed | `DeploymentBlocked=True`, reason `UnhealthyHealthChecks` | Fix the failing check, or deploy a version by hand |
| New releases are not deployed, and no check is `Unhealthy` | The last deploy failed (`bakeStatus` `Failed`) | Retry it, set `rollout.kuberik.com/unblock-failed: "true"`, or pin a version |
| A check never changes | No controller handles its `spec.class` | Use `kustomization`, or install datadog-controller for the `datadog` classes and prometheus-controller for `prometheus-alert` |

## Next steps

{{< next "/docs/integrations/fluxcd/" "/docs/integrations/datadog/" "/docs/releases/canary/" >}}
