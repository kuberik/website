---
title: "Operate a Rollout by Hand"
description: "Pin a version, deploy a specific build, let a build past its gates, or get a Rollout moving again after a failed bake."
type_: guide
weight: 20
---

Pin a [Rollout](/docs/concepts/rollouts/) to one version, deploy a build now, let a held build past its gates, or resume after a failed bake. Each action is one field or annotation on the Rollout, and the dashboard writes the same ones.

| Goal | Set on the Rollout | Removed by |
|------|-----|------------|
| Stay on one version | `spec.wantedVersion` | You |
| Deploy a build now | `rollout.kuberik.com/force-deploy` | The controller, after the deploy |
| Let one build past the gates | `rollout.kuberik.com/bypass-gates` (+ `bypass-gates-only`) | The controller, after the deploy |
| Resume after a failed bake | `rollout.kuberik.com/unblock-failed` | The controller, after the next deploy |
| Bake the same build again | `rollout.kuberik.com/retry` | The controller, at once |

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
  wantedVersion: "v1.2.3"  # remove to unpin
```

```bash {filename="Terminal"}
kubectl -n hello-world patch rollout hello-world --type=merge -p '{"spec":{"wantedVersion":null}}'
```

After you unpin, the Rollout deploys the newest release the gates allow that is newer than the pinned one. Pin a tag from the `ReleaseSource` catalogue: a tag outside it deploys, but after unpinning the Rollout cannot tell which releases are newer and deploys nothing on its own.

In the dashboard, **Change version** with **Pin build** turned on sets the pin, and **Clear pin** removes it. Both are disabled while another field manager, such as Flux applying the Rollout from Git, owns `spec.wantedVersion`.

## Deploy a specific version

Set `rollout.kuberik.com/force-deploy` to deploy one build now, newer or older than the running one. It skips the gates, the unhealthy health-check hold and the failed-bake hold.

```bash {filename="Terminal"}
kubectl -n hello-world annotate rollout hello-world --overwrite \
  rollout.kuberik.com/force-deploy=v1.2.3 \
  rollout.kuberik.com/deploy-message="Back to v1.2.3 while checkout timeouts are fixed" \
  rollout.kuberik.com/deploy-user=emma.clarke
```

The tag must be in the `ReleaseSource` catalogue, or the Rollout reports `Ready=False` ("force deploy version … is not in available releases"). A pin wins over `force-deploy`. `deploy-message` becomes the history entry's message and `deploy-user` its `triggeredBy` user; without them the entry reads "Manual deployment, with force deploy". The controller removes all three once the build is deployed.

In the dashboard, **Change version** with **Pin build** off writes these annotations with your login and clears any pin. **Deploy** on a held build and **Roll back** on the **Deployment failed** banner open the same dialog.

## Let one build past the gates

Set `rollout.kuberik.com/bypass-gates` to let one held build through every gate, once. Health checks and a failed bake still hold it, and the next build meets the gates as before.

```bash {filename="Terminal"}
kubectl -n hello-world annotate rollout hello-world --overwrite rollout.kuberik.com/bypass-gates=v1.2.3
```

The tag must be a candidate, a release newer than the deployed one; for any other tag nothing happens. The history message reads "Automatic deployment, with gate bypass", and the controller removes the annotation after the next deploy.

To skip only some gates, add `rollout.kuberik.com/bypass-gates-only` with a comma-separated list of `RolloutGate` names (available from the next rollout-controller release). The build then deploys once every gate not named allows it. A name that matches no gate of the Rollout raises a `BypassGatesUnknown` warning event, and the annotation does nothing without `bypass-gates`.

```bash {filename="Terminal"}
kubectl -n hello-world annotate rollout hello-world --overwrite \
  rollout.kuberik.com/bypass-gates=v1.2.3 \
  rollout.kuberik.com/bypass-gates-only=weekend-freeze,production-approval
```

Both annotations are removed when that build deploys. **Skip once** on a gate's tile in the rollout's **Gates** tab writes them for the gates of that rule.

## Resume after a failed bake

After a failed bake the Rollout deploys nothing on its own. Pinning or deploying by hand moves it on; to let the next automatic deploy through instead, set `rollout.kuberik.com/unblock-failed` to `"true"`.

```bash {filename="Terminal"}
kubectl -n hello-world annotate rollout hello-world --overwrite rollout.kuberik.com/unblock-failed=true
```

Gates and the unhealthy health-check hold still apply. The deploy's history message reads "Automatic deployment, with failed bake unblock", and the controller removes the annotation after it. The dashboard has no button for this.

## Retry a failed bake

Set `rollout.kuberik.com/retry` (any value) to bake the same build again. If the latest bake status is `Failed`, the controller resets it to `Deploying` and records `lastRetryTimestamp`: health-check errors from before the retry no longer count and `deployTimeout` starts again. It removes the annotation either way.

```bash {filename="Terminal"}
kubectl -n hello-world annotate rollout hello-world --overwrite rollout.kuberik.com/retry=true
```

For an OpenKruise canary, add `rollouttest.kuberik.com/retry-mode=skip` to mark failed RolloutTests as skipped instead of re-running them (`retry`, the default). The openkruise-controller removes it after the retry.

In the dashboard, **Retry** on the **Deployment failed** banner sets `retry`; when RolloutTests failed it offers **Retry tests** or **Skip tests**.

## Fail deploys that never turn healthy

Set `spec.deployTimeout` so a deploy whose health checks do not become healthy in time fails instead of waiting forever. The timer runs from the deploy, or the last retry, until the bake starts.

```yaml {filename="rollout.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: Rollout
metadata:
  name: hello-world
  namespace: hello-world
spec:
  releaseSourceRef:
    name: hello-world
  deployTimeout: 10m  # healthy within 10m or the deploy fails
  bakeTime: 15m
```

When it runs out, the bake status becomes `Failed` ("Deploy timeout reached before bake could start") and the failed-bake hold applies.

## Check the result

The latest history entry shows what deployed, why and who started it:

```bash {filename="Terminal"}
kubectl -n hello-world get rollout hello-world \
  -o jsonpath='{.status.history[0].version.tag} {.status.history[0].message} {.status.history[0].bakeStatus}{"\n"}'
```

A deploy that follows a failed or cancelled bake, or a hand deploy that starts while a health check is `Unhealthy`, runs with `BakeFailureDisabled=True` (reason `PreviousBakeFailed` or `DeployedWithUnhealthyHealthChecks`). Health-check errors and `deployTimeout` do not fail that deploy: it succeeds `bakeTime` after every check first turns healthy, even if a check reports an error during that window.

## Next steps

- [Rollouts](/docs/concepts/rollouts/): gating, the bake and the failed-bake hold
- [Manual Approvals](/docs/guides/manual-approvals/): gates that wait for a person
- [Annotations Reference](/docs/reference/annotations/#rollout-action-annotations): every annotation on this page
