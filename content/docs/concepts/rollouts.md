---
title: "Rollouts"
description: "How a Rollout picks a version, gates it, deploys it and verifies it during bake time."
type_: concept
weight: 20
---

A **Rollout** deploys the builds of one OCI artifact into one environment, one build at a time, and holds further deploys when a build fails its health checks. The artifact is either your container image or the rendered manifests for that environment.

## How a build is chosen

A Rollout reads its releases from a [`ReleaseSource`](/docs/reference/api/), which lists the tags of an OCI repository. Every release newer than the deployed one is a candidate in `status.candidates`. The Rollout deploys the newest candidate that every [gate](#when-a-deploy-is-held) allows, by writing the version to the Flux source it owns: a `Kustomization` substitution variable or an `OCIRepository` tag. It then [bakes](#how-a-deploy-is-verified) the build and records the outcome in `status.history`.

Kuberik deploys one version at a time. If `v1.2.0` is deploying or baking when `v1.3.0` and `v1.4.0` arrive, both wait as candidates. When `v1.2.0` succeeds, the Rollout deploys the newest candidate the gates allow, `v1.4.0`, and skips `v1.3.0`.

## Rollout resource

```yaml {filename="rollout.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: Rollout
metadata:
  name: hello-world
  namespace: hello-world
spec:
  releaseSourceRef:
    name: hello-world
  versionHistoryLimit: 5
  deployTimeout: 10m  # healthy within 10m or the deploy fails
  bakeTime: 15m       # then no errors for 15m
  healthCheckSelector:
    selector:
      matchLabels:
        app: hello-world
```

| Field | Purpose |
|-------|---------|
| `releaseSourceRef` | The `ReleaseSource` that provides new versions, in the Rollout's namespace. |
| `releasesImagePolicy` | Deprecated and ignored. Use `releaseSourceRef`. |
| `versionHistoryLimit` | How many past deployments to keep in `status.history` (default `10`). |
| `bakeTime` | How long the build must stay free of health-check errors once the bake starts (e.g., `5m`, `1h`). |
| `deployTimeout` | How long to wait for the health checks to become healthy after a deploy. When it passes before the bake starts, the deploy fails. Unset means wait indefinitely. |
| `healthCheckSelector` | Label selector (and optional namespace selector) for the HealthCheck resources to evaluate. |
| `wantedVersion` | Pins the Rollout to one tag: it deploys that tag and nothing else until you clear the field. See [Operate a Rollout by Hand](/docs/operate/manual-actions/#pin-a-version). |

## Rollout status

![Rollout history in the dashboard: each deployment with the commits it shipped, who triggered it and how long it took](/screenshots/dashboard/history.png)

```bash {filename="Terminal"}
kubectl -n hello-world get rollout hello-world -o yaml
```

- `history`: deployments, newest first. `history[0].version.tag` is the running version; each entry records its `message`, `triggeredBy` and `bakeStatus` (`Deploying`, `InProgress`, `Succeeded`, `Failed` or `Cancelled`).
- `candidates`: releases newer than the deployed one. `gated: true` means every gate lets the release through; `blockedBy` names the gates that hold it.
- `gates`: each gate that targets this Rollout, whether it is passing, and the versions it allows.
- `conditions`: `Ready`, `GatesPassing`, `DeploymentBlocked` (a health check is unhealthy) and `BakeFailureDisabled` (see [When a bake fails](#when-a-bake-fails)).

## What a Rollout propagates

A Rollout does not care what its versions point at. Annotate a `Kustomization` and Kuberik substitutes the version into it; annotate an `OCIRepository` and Kuberik moves its tag. Gating, health checks and bake time work the same way in both cases. See [Propagation Modes](/docs/concepts/propagation/) for the trade-offs and for running both at once.

## When a deploy is held

Before an automatic deploy, the build must be allowed by every gate that targets the Rollout. A gate either lets a build through or holds it; a held build is evaluated again whenever a gate changes, and nothing is rejected for good. Gates do not apply to a Rollout's first deploy (if no release passes them, the newest release deploys) or to deploys you start by hand.

Automatic deploys also wait while any selected health check reports `Unhealthy`. The Rollout then sets `DeploymentBlocked=True` with the name of the check. A check that is still `Pending` holds nothing, and a Rollout's first deploy and deploys you start by hand go ahead regardless.

## How a deploy is verified

After a deploy, the history entry starts in `Deploying`. The bake starts (`InProgress`) once every selected health check is `Healthy` and has changed state since the deploy, so a check that was healthy before the deploy does not count until it reports on the new build. The deploy:

- succeeds when `bakeTime` passes after the bake started, with no error;
- fails when a health check reports an error at any point after the deploy, before or during the bake;
- fails when `deployTimeout` passes before the bake starts;
- is cancelled when a deploy you start by hand replaces it.

A Rollout with no `bakeTime`, `deployTimeout` or `healthCheckSelector` marks each deploy `Succeeded` straight away.

## When a bake fails

Kuberik does not roll back. When a bake fails, the failed build keeps running, the Rollout sets `Ready=False`, and no newer build deploys automatically until a person pins a version, deploys a build by hand, sets `rollout.kuberik.com/unblock-failed`, or retries the bake. [Operate a Rollout by Hand](/docs/operate/manual-actions/) shows each of these.

![The Change Version dialog: the commits the build ships, the rules it would override, a required note and a typed confirmation](/screenshots/dashboard/change-version.png)

When a deploy starts, the Rollout sets the `BakeFailureDisabled` condition for it. The condition is `True`, and health-check errors and `deployTimeout` do not fail that deploy, in two cases:

| Reason | When |
|--------|------|
| `PreviousBakeFailed` | The previous deploy did not end with a successful bake: it failed, or this deploy cancelled its bake. |
| `DeployedWithUnhealthyHealthChecks` | A deploy you started by hand began while a selected health check was `Unhealthy`. |

The deploy still has to bake: it succeeds once the checks are healthy for `bakeTime`. If they never recover, it stays in `Deploying` and the next build has to be deployed by hand. The condition holds until the next deploy starts.

## Related

- [Propagation Modes](/docs/concepts/propagation/): image tag or rendered manifests
- [Health Checks](/docs/gates/health-checks/): configure verification
- [Manual Approvals](/docs/gates/approvals/): add approval gates
- [Deployment Schedules](/docs/gates/schedules/): control deployment time windows
- [Operate a Rollout by Hand](/docs/operate/manual-actions/): pin, deploy, bypass gates and recover from a failed bake
