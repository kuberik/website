---
title: "Roll Back Automatically"
linkTitle: "Automatic Rollback"
description: "Deploy the last good build again when a new build fails its bake, for the failures you choose."
type_: guide
weight: 40
---

When a build fails its bake with a failure severe enough, the [Rollout](/docs/concepts/rollouts/) deploys the newest earlier build that baked successfully. Guards can stop it, or send it to an older build.

Works with: [health checks](/docs/gates/health-checks/) selected by the Rollout. Without a `bakeTime`, `deployTimeout` or `healthCheckSelector`, a bake never fails and nothing rolls back.

## Turn on automatic rollback

Add `spec.autoRollback` to the Rollout. Without it, nothing rolls back. `minSeverity` is the lowest failure severity that rolls back.

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
  healthCheckSelector:
    selector:
      matchLabels:
        app: hello-world
  autoRollback:
    minSeverity: Critical  # default; or Warning
```

| `spec.autoRollback` | Rolls back on |
|---|---|
| Absent | Nothing |
| `{}` or `minSeverity: Critical` | Critical failures |
| `minSeverity: Warning` | Critical and warning failures |

The decision is made once, when the bake turns `Failed`. A failure that does not roll back still fails the bake: the failed build stays, and automatic deploys skip it.

## Mark a flaky test as a warning

Every failure is critical unless it says otherwise. Annotate a test, a Job or any other object in the manifests Flux applies with `kuberik.com/severity`:

```yaml {filename="ui-test.yaml"}
apiVersion: rollout.kuberik.com/v1alpha1
kind: RolloutTest
metadata:
  name: ui-test
  namespace: hello-world
  annotations:
    kuberik.com/severity: Warning  # flaky
spec:
  rolloutName: hello-world
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

What happens when `ui-test` is the only failure:

| Rollout `minSeverity` | Result |
|---|---|
| `Critical` | Not rolled back. The bake fails, the build stays, and automatic deploys skip it |
| `Warning` | Rolls back |

The same annotation on a HealthCheck sets the severity of all its failures. An annotation on the failed object wins over the HealthCheck's.

```yaml {filename="healthcheck.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: HealthCheck
metadata:
  name: incidents
  namespace: hello-world
  labels:
    app: hello-world
  annotations:
    kuberik.com/severity: Warning  # never rolls back on Critical
spec:
  class: datadog-incidents
```

A check that cannot run (a query error, an unreachable Prometheus) never rolls back, whatever its severity. A failure that started before the deploy does not count.

## What a rollback deploys

The Rollout tries the earlier builds whose bake succeeded, newest first, and deploys the first one no guard rejects.

| Guard | Rejects a target when |
|---|---|
| Rollback barrier | A build between the target and the failed build, inclusive, carries `com.kuberik.rollout.rollback-barrier: "true"` |
| Service dependency | A consumer's running build needs a newer version of this service, and its [dependency](/docs/gates/dependencies/#when-the-provider-rolls-back) sets `providerRollback: Block` |
| Target requirement | The target needs a version of another service that it no longer serves |
| Rollback gate | A [RolloutGate](/docs/concepts/gates/#gates-that-guard-rollbacks) with `appliesTo: [Rollback]` does not allow the target |

If no build is left, nothing deploys: the failed build stays, and the `AutoRollback` condition names the guards.

Example: 2.4.0 fails, and 2.3.0 and 2.2.0 baked successfully.

| Guards | Result |
|---|---|
| None | Deploys 2.3.0 |
| 2.4.0 carries the rollback barrier | Not rolled back: nothing older may replace 2.4.0 |
| 2.3.0 carries the rollback barrier | Deploys 2.3.0; 2.2.0 would be rejected |
| A rollback gate with `allowedVersions: ["2.3.0"]` | Deploys 2.3.0 |
| A rollback gate with `allowedVersions: ["2.2.0"]` | Deploys 2.2.0 |
| A rollback gate with `passing: false` | Not rolled back: 2.4.0 stays |

### Mark a build that cannot be rolled back

A build with a forward-only migration declares it on the image, so nothing older replaces it automatically:

```bash {filename="Terminal"}
docker buildx build --push -t ghcr.io/acme/hello-world:2.4.0 \
  --annotation "index:org.opencontainers.image.version=2.4.0" \
  --annotation "index:com.kuberik.rollout.rollback-barrier=true" .
```

## Which deploys roll back

| Deploy | Rolls back |
|---|---|
| Automatic, including through an approval or after a gate bypass | Yes |
| Pin (`spec.wantedVersion`), `rollout.kuberik.com/force-deploy` or `rollout.kuberik.com/unblock-failed` | Never |
| An automatic rollback | Never: there is one attempt and no chain |

A rollback runs during a schedule freeze and needs no approval, because the build already ran there.

## Deploy a failed build again

Automatic deploys skip a build whose bake failed on that Rollout, and `status.candidates[].failedBake` is `true` for it. To try it again, name it: pin it, or set `rollout.kuberik.com/force-deploy` or `rollout.kuberik.com/bypass-gates` to its tag ([Operate with kubectl](/docs/operate/manual-actions/)). In the dashboard, press **Deploy anyway** on the rollout's banner or on the build's row under **Newer builds**.

## Check the result

```bash {filename="Terminal"}
kubectl -n hello-world get rollout hello-world \
  -o jsonpath='{range .status.conditions[?(@.type=="AutoRollback")]}{.status} {.reason}: {.message}{"\n"}{end}'
```

```text {filename="Output"}
True RolledBack: smoke-test failed (Critical); rolled back 2.4.0 to 2.3.0.
```

| Reason | Meaning |
|---|---|
| `RolledBack` | A rollback was deployed |
| `NotATrigger` | No failure reached the Rollout's `minSeverity`, or the failed deploy was itself a rollback |
| `Blocked` | Guards rejected every earlier build; the message names them |
| `NoTarget` | No earlier build baked successfully |
| `ManualDeploy` | The failed build was pinned, force-deployed or deployed with `unblock-failed` |
| `ManualIntent` | A pin or force deploy for another build was waiting |
| `DeployError` | The rollback could not be written to Flux; the controller retries |
| `WaitingForGateRefresh` (`Unknown`) | The Rollout asked its [rollback gates](/docs/concepts/gates/#keep-a-controllers-rollback-gate-current) to refresh and waits up to 2 minutes for them |

`status.history[].failedHealthChecks[].failures` lists each failure with its `severity`, `rollsBack` and `why`: `AtOrAboveThreshold`, `BelowThreshold`, `CheckErrorNever` or `PredatesDeploy`.

## Next steps

{{< next "/docs/gates/health-checks/" "/docs/concepts/gates/" "/docs/gates/dependencies/" >}}
