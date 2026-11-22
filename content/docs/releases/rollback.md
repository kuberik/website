---
title: "Roll Back Automatically"
linkTitle: "Automatic Rollback"
description: "Deploy the last good build again when a new build fails its bake, and choose which failures do that."
type_: guide
weight: 40
---

When a build fails its bake, the [Rollout](/docs/concepts/rollouts/) deploys the last build that baked successfully, records why, and keeps the failed build from deploying again on its own. You choose which failures roll back: per health check by kind of failure, and per test or workload with an annotation.

Works with: [health checks](/docs/gates/health-checks/) selected by the Rollout. Without a `bakeTime`, `deployTimeout` or `healthCheckSelector`, a bake never fails and nothing rolls back.

## Turn on automatic rollback

Set `spec.autoRollback.enabled` on the Rollout. It is off by default.

```yaml {filename="rollout.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: Rollout
metadata:
  name: hello-world
  namespace: hello-world
spec:
  releaseSourceRef:
    name: hello-world
  bakeTime: 10m
  deployTimeout: 15m
  healthCheckSelector:
    selector:
      matchLabels:
        app: hello-world
  autoRollback:
    enabled: true  # off by default
```

From then on, every bake that ends `Failed` is checked against the rules below, once, in the reconcile that marks it failed. Gates are not evaluated for the rollback: it deploys during a schedule freeze and needs no approval.

## Choose which failures roll back

Each failed check records what failed and its kind. A [`kustomization`](/docs/integrations/fluxcd/#report-kustomization-health) check names every failed object in the Kustomization's inventory:

| Kind | Recorded for |
|---|---|
| `TestFailed` | A failed `RolloutTest` or `Job`, or an OpenKruise Rollout stalled on a failed test that is not in the inventory |
| `NotReady` | A Deployment past its progress deadline, an OpenKruise step past its ready timeout, a check not `Healthy` at `deployTimeout` |
| `ApplyFailed` | The Kustomization could not build or apply (`BuildFailed`, `ReconciliationFailed`, `PruneFailed` and similar) |
| `Alert`, `Incident` | A firing alert, an open incident. No check records these yet: alert and incident failures count as `Unclassified` |
| `CheckError` | The check itself could not run. It never rolls back |
| `Unclassified` | Anything else, and every failure of a check that records no kinds |

The check's `spec.rollbackOn` lists the kinds that roll back. Unset, the class default applies; `[]` means the check never rolls back.

| Class | Default `rollbackOn` |
|---|---|
| `kustomization` | `ApplyFailed`, `NotReady`, `TestFailed`, `Unclassified` |
| `prometheus-alert`, `datadog`, `datadog-monitor-crd` | `Alert`, `Unclassified` |
| `datadog-incidents` | None |
| Any other class | `Alert`, `ApplyFailed`, `NotReady`, `TestFailed`, `Unclassified` |

This check rolls back on failed tests and apply errors, not on pods that are slow to become ready:

```yaml {filename="healthcheck.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: HealthCheck
metadata:
  name: hello-world
  namespace: hello-world
  labels:
    app: hello-world
  annotations:
    healthcheck.kuberik.com/kustomization: "hello-world"
spec:
  class: kustomization
  rollbackOn: [ApplyFailed, TestFailed]  # NotReady fails the bake only
```

## Opt one test in or out

Annotate the object that fails, in the manifests Flux applies, with `rollout.kuberik.com/rollback: "false"` to keep its failure from rolling back, or `"true"` to make it roll back whatever the check's `rollbackOn` says. It works on any object a `kustomization` check reads: a RolloutTest, a Job, a Deployment, or the Kustomization itself. Other values are ignored.

```yaml {filename="smoke-test.yaml"}
apiVersion: rollout.kuberik.com/v1alpha1
kind: RolloutTest
metadata:
  name: smoke-test
  namespace: hello-world
  annotations:
    rollout.kuberik.com/rollback: "false"  # fails the bake, never rolls back
spec:
  rolloutName: hello-world  # the OpenKruise Rollout
  stepIndex: 1
  jobTemplate:
    backoffLimit: 0
    template:
      spec:
        restartPolicy: Never
        containers:
          - name: test
            image: curlimages/curl
            command: ["curl", "--fail", "http://hello-world-canary"]
```

The most specific rule decides each failure: `CheckError` never rolls back, then the annotation on the failed object, then the check's `rollbackOn`, then the class default. The bake rolls back if any one failure does.

### When the tests have not reported yet

A `kustomization` check can fail because an OpenKruise Rollout is waiting on its RolloutTests before any test has reported. The check then has no failed object to name, so it marks the failure as deferred (`status.failuresDeferred: true`). With automatic rollback on, the Rollout waits up to 2 minutes, counted from when it starts waiting, before it decides the bake. Meanwhile the bake message reads `Waiting up to 2m for the RolloutTests of HealthCheck <namespace>/<name> to report the failure.` and the `AutoRollback` condition is `Unknown` with reason `WaitingForTests`.

When a test reports its failure, that test's annotation decides as above: `"false"` keeps the build, `"true"` rolls back, and without the annotation the check's `rollbackOn` decides (the `kustomization` default includes `TestFailed`). If no test reports within 2 minutes, the failure counts as `Unclassified` and the check's `rollbackOn` decides. Without automatic rollback the Rollout does not wait.

## What a rollback does

The Rollout redeploys the newest build in its history whose bake succeeded, other than the failed build and any held build. The new history entry has `deployKind: AutoRollback`, `rollbackOf` set to the failed entry's ID, `triggeredBy` the `rollout-controller`, and a message that names the failures:

```text {filename="Output"}
Automatic rollback: 1.4.1 failed bake (RolloutTest hello-world/checkout-test)
```

The rollback deploys like a deploy that follows a failed bake (`BakeFailureDisabled=True`, reason `PreviousBakeFailed`): check errors do not fail it, so it is never rolled back in turn. The Rollout sets the `AutoRollback` condition to `True`, reason `RolledBack`, and emits an `AutoRollback` event.

When a failed bake does not roll back, the condition is `False` with the reason, and an `AutoRollbackSkipped` warning event repeats it:

| Reason | Why nothing rolled back |
|---|---|
| `NotATrigger` | No failure rolls back (each is listed with its rule), or the failed deploy was itself a rollback |
| `ManualDeploy` | The failed build was pinned or force-deployed, or deployed before the upgrade that records `deployKind` |
| `ManualIntent` | A pin, `force-deploy`, `unblock-failed` or a gate bypass for another build was waiting |
| `NoTarget` | No earlier build in the history baked successfully |
| `DeployError` | The rollback could not be written to Flux; the controller retries it |

Automatic deploys, gate-bypass deploys and `unblock-failed` deploys roll back. Pins and force deploys never do: a build you named stays until you change it. Each history entry's `deployKind` says which it was (`Automatic`, `GateBypass`, `Unblock`, `Pin`, `ForceDeploy` or `AutoRollback`).

## Release a held build

A build whose bake failed on a Rollout is held there, with automatic rollback on or off: automatic deploys skip it, and `status.candidates[].failedBake` is `true` for it. Newer builds are not affected. The hold ends when a deploy of that build succeeds on this Rollout, so name the build to try it again: pin it in `spec.wantedVersion`, or set `rollout.kuberik.com/force-deploy` or `rollout.kuberik.com/bypass-gates` to its tag ([Operate with kubectl](/docs/operate/manual-actions/)). A pin that is cancelled before its bake ends keeps the hold.

```bash {filename="Terminal"}
kubectl -n hello-world get rollout hello-world -o jsonpath='{range .status.candidates[?(@.failedBake==true)]}{.tag}{"\n"}{end}'
```

The history keeps the failed entry that holds a build past `versionHistoryLimit`, up to 10 such entries, so a hold does not end when the entry gets old.

In the dashboard, the rollout's **Overview** shows a **Rolled back automatically** banner that names the failed build, the target and each failure with whether it rolls back and why. **Deploy anyway**, on the banner or on the held build's row under **Newer builds**, opens **Change version** for that build. The **History** tab marks the entries the same way.

## Check the result

```bash {filename="Terminal"}
kubectl -n hello-world get rollout hello-world \
  -o jsonpath='{range .status.conditions[?(@.type=="AutoRollback")]}{.status} {.reason}: {.message}{"\n"}{end}'
```

```text {filename="Output"}
True RolledBack: 1.4.1 failed bake (RolloutTest hello-world/checkout-test); rolled back to 1.4.0.
```

`status.history[1].failedHealthChecks[].failures` lists every failure of the failed deploy with `rollsBack` and `why` (`CheckRollbackOn`, `NotInRollbackOn`, `SourceOptedOut`, `SourceOptedIn` or `CheckErrorNever`).

## Known limitations

- Only `kustomization` checks name what failed. A failure of any other check (`prometheus-alert`, `datadog`, `helmrelease`) counts as one `Unclassified` failure, so the annotation cannot opt out one alert. Split the check, or set `rollbackOn: []` on it.
- While one check waits for its tests, the whole bake decision waits too, even if another check has already failed, for at most 2 minutes.
- The decision is made once, when the bake turns `Failed`. If the controller stops before it records the decision, that failure does not roll back.
- A rollback is not verified. Check errors do not fail it, and if the earlier build is now unhealthy too, nothing rolls back further.
- A rollback skips every gate, dependencies included, and holds count per Rollout: a build that failed in staging is not held in production.
- While a rollback is pending or being retried (`AutoRollback` `Unknown` with reason `RollbackPending`, or `DeployError`), the dashboard shows the plain **Deployment failed** banner. Read the condition with the command above.

## Next steps

{{< next "/docs/gates/health-checks/" "/docs/operate/manual-actions/" "/docs/releases/canary/" >}}
