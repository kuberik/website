---
title: "Rollouts"
description: "How a Rollout picks a version, gates it, deploys it and verifies it during bake time."
type_: concept
weight: 20
---

A **Rollout** deploys the builds of one OCI artifact into one environment, one build at a time, and holds further deploys when a build fails its health checks. The artifact is either your container image or the rendered manifests for that environment.

## How a build is chosen

A [Rollout](/docs/reference/api/#rollout) reads its releases from a [ReleaseSource](/docs/releases/publish/), which lists the tags of an OCI repository. Every release newer than the deployed one is a candidate. The Rollout deploys the newest candidate that every [gate](#when-a-deploy-is-held) allows, by writing the version to the Flux source it owns: a Kustomization substitution variable or an OCIRepository tag. It then [bakes](#how-a-deploy-is-verified) the build and records the outcome in `status.history`.

Kuberik deploys one version at a time. If 1.2.0 is deploying or baking when 1.3.0 and 1.4.0 arrive, both wait as candidates. When 1.2.0 succeeds, the Rollout deploys the newest candidate the gates allow, 1.4.0, and skips 1.3.0.

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
  deployTimeout: 10m  # healthy within 10m
  bakeTime: 15m
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
| `healthCheckSelector` | Label selector (and optional namespace selector) for the [HealthCheck](/docs/gates/health-checks/) resources to evaluate. |
| `wantedVersion` | Pins the Rollout to one tag: it deploys that tag and nothing else until you clear the field. See [Operate with kubectl](/docs/operate/manual-actions/#pin-a-version). |

## Rollout status

![The History tab of a staging rollout: the Deploys card groups each deploy by day, with its build, its commit message, when it turned healthy and how long ago it ran](/images/docs/concepts/rollouts-history.png)

```bash {filename="Terminal"}
kubectl -n hello-world get rollout hello-world -o yaml
```

- `history`: deployments, newest first. `history[0].version.tag` is the running version; each entry records its `message`, `triggeredBy` and `bakeStatus` (`Deploying`, `InProgress`, `Succeeded`, `Failed` or `Cancelled`).
- `candidates`: the newest releases newer than the deployed one (20 by default, set by the controller flag `--release-candidates`), plus any tag a gate, the pin or an action annotation names, up to 64. Gates and selection see every release; this list is what the status shows. `gated: true` means every gate lets the release through; `blockedBy` names the gates that hold it.
- `gates`: each gate that targets this Rollout, whether it is passing, and the versions it allows.
- `conditions` include `Ready`, `GatesPassing`, `DeploymentBlocked` (a health check is unhealthy), `BakeFailureDisabled` (see [When a bake fails](#when-a-bake-fails)), and `ReleasesUpdated` and `ReleaseSourceReady` (whether releases can be read from the ReleaseSource).

## What a Rollout propagates

A Rollout does not care what its versions point at. Annotate a Kustomization and Kuberik substitutes the version into it; annotate an OCIRepository and Kuberik moves its tag. Gating, health checks and bake time work the same way in both cases. See [Propagation Modes](/docs/concepts/propagation/) for the trade-offs and for running both at once.

## When a deploy is held

Before an automatic deploy, the build must be allowed by every gate that targets the Rollout. A gate either lets a build through or holds it; a held build is evaluated again whenever a gate changes, and nothing is rejected for good. Gates never hold deploys you start by hand. On a Rollout's first deploy they never hold either: it deploys the newest release the gates allow, or the newest release if they allow none.

Automatic deploys also wait while any selected health check reports `Unhealthy`. The Rollout then sets `DeploymentBlocked=True` with the name of the check. A check that is still `Pending` holds nothing, and a Rollout's first deploy and deploys you start by hand go ahead regardless.

{{< fig id="rollout-gating" caption="RolloutGates filter the release candidates; the newest allowed one deploys, otherwise the Rollout is held until a gate changes." >}}

## How a deploy is verified

After a deploy, the history entry starts in `Deploying`. The bake starts (`InProgress`) once every selected health check is `Healthy` and has changed state since the deploy, so a check that was healthy before the deploy does not count until it reports on the new build. The deploy:

- succeeds when the bake clock has run for `bakeTime` with no error and every check is `Healthy`; the clock stops while any check is not `Healthy`;
- fails when a health check reports an error at any point after the deploy, before or during the bake;
- fails when `deployTimeout` passes before the bake starts, or while the bake clock is stopped;
- is cancelled when a deploy you start by hand replaces it.

{{< fig id="rollout-bake" caption="The bake status of the newest deploy: health starts the bake, bakeTime ends it, any HealthCheck error fails it." >}}

A Rollout with no `bakeTime`, `deployTimeout` or `healthCheckSelector` marks each deploy `Succeeded` straight away.

## When a bake fails

When a bake fails, the Rollout sets `Ready=False` and holds the failed build: automatic deploys skip it from then on, until a deploy of it you start by name succeeds. With `spec.autoRollback.enabled`, the Rollout then redeploys the last build that baked successfully, if the failure is one that rolls back ([Roll Back Automatically](/docs/releases/rollback/)). Otherwise the failed build keeps running, and no newer build deploys automatically until a person pins a version, deploys a build by hand, sets `rollout.kuberik.com/unblock-failed`, or retries the bake. [Operate with kubectl](/docs/operate/manual-actions/) shows each of these.

![Part of the Change version dialog deploying the held build 4.45.0-45 of checkout-api to production: the rule it would override, After staging, the four commits to deploy, the Pin build switch, a required reason, the typed confirmation and the Deploy button](/images/docs/dashboard/change-version.png)

When a deploy starts, the Rollout sets the `BakeFailureDisabled` condition for it. The condition is `True`, and health-check errors and `deployTimeout` do not fail that deploy, in two cases:

| Reason | When |
|--------|------|
| `PreviousBakeFailed` | The previous deploy did not end with a successful bake: it failed, or this deploy cancelled its bake. |
| `DeployedWithUnhealthyHealthChecks` | A deploy you started by hand began while a selected health check was `Unhealthy`. |

The bake still has to start: it starts the first time every check is `Healthy` after the deploy, and the deploy succeeds `bakeTime` later. Errors during that window do not fail it, so a recovery deploy is not verified the way a normal one is. If the checks never turn healthy, it stays in `Deploying` and the next build has to be deployed by hand. The condition holds until the next deploy starts.

## Related

{{< next "/docs/concepts/propagation/" "/docs/concepts/gates/" "/docs/operate/manual-actions/" >}}
