---
title: "Operate with kubectl"
description: "Pin a version, roll back, deploy a specific build, let a build past its gates, or resume after a failed bake."
type_: guide
weight: 20
---

Each action below is one field or annotation on the [Rollout](/docs/concepts/rollouts/); the dashboard writes the same ones.

| Goal | Set on the Rollout |
|------|-----|
| Stay on one version | `spec.wantedVersion` |
| Roll back to the previous build | `spec.wantedVersion` |
| Deploy a build now | `rollout.kuberik.com/force-deploy` |
| Let one build past the gates | `rollout.kuberik.com/bypass-gates` (+ `bypass-gates-only`) |
| Resume after a failed bake | `rollout.kuberik.com/unblock-failed` |
| Bake the same build again | `rollout.kuberik.com/retry` |

## Pin a version

Set `spec.wantedVersion` to hold the Rollout on one tag. It deploys at once, past gates, unhealthy health checks and a failed bake, and newer releases wait until you clear the field.

```yaml {filename="rollout.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: Rollout
metadata:
  name: hello-world
  namespace: hello-world
spec:
  releaseSourceRef:
    name: hello-world
  wantedVersion: "1.4.1"  # remove to unpin
```

```bash {filename="Terminal"}
kubectl -n hello-world patch rollout hello-world --type=merge -p '{"spec":{"wantedVersion":null}}'
```

After you unpin, the Rollout deploys the newest release the gates allow that is newer than the pinned one. Pin a tag from the [`ReleaseSource`](/docs/releases/publish/) catalogue: a tag outside it deploys, but after unpinning the Rollout deploys nothing on its own.

{{< callout type="warning" >}}
A pin also skips the Environment gate that waits for the earlier tier's bake. Pin staging to a release that development never baked, or failed, and it deploys to staging at once; when staging's bake succeeds, production's gate allows it too.
{{< /callout >}}

In the dashboard, **Change version** with **Pin build** turned on sets the pin, and **Clear pin** removes it. Both are disabled while another field manager, such as Flux, owns `spec.wantedVersion`.

## Roll back to the previous version

To go back, pin the build deployed before the current one: `status.history[0]` is the current deploy, `status.history[1]` the one before it. Print its tag.

```bash {filename="Terminal"}
kubectl -n hello-world get rollout hello-world -o jsonpath='{.status.history[1].version.tag}{"\n"}'
```

Then pin the tag it printed.

```bash {filename="Terminal"}
kubectl -n hello-world patch rollout hello-world --type=merge -p '{"spec":{"wantedVersion":"<previous-tag>"}}'
```

**Roll back** in the dashboard (the failure banner or the rollout header) writes the same pin. Clear it as in [Pin a version](#pin-a-version) once a fixed release is out.

## Deploy a specific version

To ship a fix past a bad release, set `rollout.kuberik.com/force-deploy` to deploy that one build now. It skips the gates, the unhealthy health-check hold and the failed-bake hold.

```bash {filename="Terminal"}
kubectl -n hello-world annotate rollout hello-world --overwrite \
  rollout.kuberik.com/force-deploy=1.4.2 \
  rollout.kuberik.com/deploy-message="Ship the checkout timeout fix" \
  rollout.kuberik.com/deploy-user=emma.clarke
```

The tag must be in the `ReleaseSource` catalogue, or the Rollout reports `Ready=False` ("force deploy version … is not in available releases"). A pin wins over `force-deploy`. `deploy-message` and `deploy-user` fill the history entry's message and `triggeredBy` ([defaults](/docs/reference/annotations/#rollout-action-annotations)). The controller removes all three once the build is deployed.

A force-deploy does not hold an older build: once its bake succeeds, the Rollout deploys the newest release the gates allow, the bad release again if it is still newer. To stay on an older build, pin it as in [Roll back to the previous version](#roll-back-to-the-previous-version).

In the dashboard, **Change version** with **Pin build** off writes these annotations with your login and clears any pin. **Deploy** on a held build opens the same dialog.

## Let one build past the gates

Set `rollout.kuberik.com/bypass-gates` to let one held build through every gate, once. Health checks and a failed bake still hold it.

```bash {filename="Terminal"}
kubectl -n hello-world annotate rollout hello-world --overwrite rollout.kuberik.com/bypass-gates=1.4.1
```

The tag must be a candidate, a release newer than the deployed one; for any other tag nothing happens. The history message reads "Automatic deployment, with gate bypass", and the controller removes the annotation after the next deploy.

To skip only some gates, add `rollout.kuberik.com/bypass-gates-only` with a comma-separated list of [`RolloutGate`](/docs/concepts/gates/) names. The build then deploys once every gate not named allows it. A name that matches no gate of the Rollout raises a `BypassGatesUnknown` warning event, and the annotation does nothing without `bypass-gates`.

Schedules, approval policies and dependencies name their gates `schedule-gate-<suffix>`, `approval-gate-<suffix>` and `dependency-<name>`. List the Rollout's gate names first.

```bash {filename="Terminal"}
kubectl -n hello-world get rollout hello-world -o jsonpath='{.status.gates[*].name}'
```

```bash {filename="Terminal"}
kubectl -n hello-world annotate rollout hello-world --overwrite \
  rollout.kuberik.com/bypass-gates=1.4.1 \
  rollout.kuberik.com/bypass-gates-only=schedule-gate-x7k2p,approval-gate-9fqzt
```

Both annotations are removed when that build deploys. The dashboard's **Skip once** on a gate writes them for that rule's gates.

## Resume after a failed bake

After a failed bake the Rollout deploys nothing on its own. To let the next automatic deploy through, set `rollout.kuberik.com/unblock-failed` to `"true"`.

```bash {filename="Terminal"}
kubectl -n hello-world annotate rollout hello-world --overwrite rollout.kuberik.com/unblock-failed=true
```

Gates and the unhealthy health-check hold still apply. Its history message reads "Automatic deployment, with failed bake unblock", and the controller removes the annotation after it. The dashboard has no button for this.

## Retry a failed bake

Set `rollout.kuberik.com/retry` (any value) to bake the same build again. If the latest bake status is `Failed`, the controller resets it to `Deploying` and records `lastRetryTimestamp`: health-check errors from before the retry no longer count and [`deployTimeout`](/docs/gates/health-checks/#select-health-checks-from-the-rollout) starts again. It removes the annotation either way.

```bash {filename="Terminal"}
kubectl -n hello-world annotate rollout hello-world --overwrite rollout.kuberik.com/retry=true
```

For an OpenKruise canary, `rollouttest.kuberik.com/retry-mode=skip` marks failed RolloutTests as skipped instead of re-running them: see [Retry or skip a failed test](/docs/releases/canary/#retry-or-skip-a-failed-test).

In the dashboard, **Retry** on the **Deployment failed** banner sets `retry`; when RolloutTests failed it offers **Retry tests** or **Skip tests**.

## Check the result

The latest history entry shows what deployed, why and by whom:

```bash {filename="Terminal"}
kubectl -n hello-world get rollout hello-world \
  -o jsonpath='{.status.history[0].version.tag} {.status.history[0].message} {.status.history[0].bakeStatus}{"\n"}'
```

A deploy that follows a failed or cancelled bake, or a hand deploy made while a health check is `Unhealthy`, runs with `BakeFailureDisabled=True`: health-check errors and `deployTimeout` do not fail it ([When a bake fails](/docs/concepts/rollouts/#when-a-bake-fails)).

## Next steps

{{< next "/docs/concepts/rollouts/" "/docs/gates/approvals/" "/docs/reference/annotations/#rollout-action-annotations" >}}
