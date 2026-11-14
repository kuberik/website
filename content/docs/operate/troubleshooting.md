---
title: "Troubleshoot"
description: "Find why a release does not deploy, a deploy hangs, a bake fails or an environment does not promote, and fix it with kubectl."
type_: guide
weight: 90
---

Find the condition that holds your Rollout and apply the fix under it. Every example uses the Rollout, ReleaseSource and Environment `hello-world` in namespace `hello-world`.

The symptoms below are named by the condition types and reasons this command prints.

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world \
  -o jsonpath='{range .status.conditions[*]}{.type}{"\t"}{.status}{"\t"}{.reason}{"\t"}{.message}{"\n"}{end}'
```

Events on the Rollout add detail, such as `HealthCheckBlocking` and `BakeTimeFailed`.

```bash {filename="Terminal"}
kubectl events -n hello-world --for rollout/hello-world
```

## A new release does not deploy

### `ReleasesUpdated` is False with reason `ReleaseSourceRequired`

The Rollout has no `spec.releaseSourceRef`, so it reads no releases. Point it at the [ReleaseSource](/docs/releases/publish/) for the app.

```bash {filename="Terminal"}
kubectl patch rollout hello-world -n hello-world --type merge \
  -p '{"spec":{"releaseSourceRef":{"name":"hello-world"}}}'
```

### `ReleasesUpdated` is False with reason `ReleaseCatalogueUnavailable`

The release-controller CRDs are not installed. Once they are, the Rollout picks them up without a restart.

```bash {filename="Terminal"}
kubectl get crd releasesources.kuberik.com releaseslices.kuberik.com
```

### `ReleaseSourceReady` is False

With reason `ReleaseSourceNotFound`, the name in `spec.releaseSourceRef` does not exist in the Rollout's namespace. With `ReleaseSourceNotReady`, the ReleaseSource exists but is not `Ready`: see [The ReleaseSource is not Ready](#the-releasesource-is-not-ready).

```bash {filename="Terminal"}
kubectl get releasesource -n hello-world
```

### `Ready` is False with reason `NoReleases`

The ReleaseSource lists no releases. Its `Count` column shows how many tags it admitted.

```bash {filename="Terminal"}
kubectl get releasesource hello-world -n hello-world
```

### `GatesPassing` is False with reason `SomeGatesBlocking`

A gate has `passing: false`, often a closed deployment window. List the gates and schedules, or bypass the gates for one build.

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world -o jsonpath='{.status.gates}'
kubectl get rolloutschedules -n hello-world
kubectl annotate rollout hello-world -n hello-world rollout.kuberik.com/bypass-gates=1.4.1 --overwrite
```

### `GatesPassing` is False with reason `NoAllowedVersions`

No newer release is allowed by every gate; an up-to-date Rollout shows this too. `status.candidates` lists newer releases, with `blockedBy` naming the gates that hold each. An approval gate lets a release through once a `RolloutApproval` names it.

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world -o jsonpath='{range .status.candidates[*]}{.tag}{"\t"}{.blockedBy}{"\n"}{end}'
kubectl apply -f - <<EOF
apiVersion: kuberik.com/v1alpha1
kind: RolloutApproval
metadata:
  name: hello-world-1-4-1
  namespace: hello-world
spec:
  rolloutRef:
    name: hello-world
  version: "1.4.1"
EOF
```

A `dependency-…` gate in `blockedBy` means the provider has not deployed the contract version yet: see [Wait for Service Dependencies](/docs/gates/dependencies/).

### `DeploymentBlocked` is True with reason `UnhealthyHealthChecks`

A selected HealthCheck is `Unhealthy`; the message names it. Fix the workload, or deploy a known build by hand, which skips this check.

```bash {filename="Terminal"}
kubectl get healthchecks -n hello-world
```

### `DeploymentBlocked` reason is `ManualDeployment`

`spec.wantedVersion` pins the Rollout to one build, and new releases wait. Remove the pin to resume automatic deploys.

```bash {filename="Terminal"}
kubectl patch rollout hello-world -n hello-world --type json \
  -p '[{"op":"remove","path":"/spec/wantedVersion"}]'
```

### The last bake failed

A failed bake stops automatic deploys until someone acts. See [The bake failed](#the-bake-failed).

### `Ready` is False with reason `RolloutFailed`, "force deploy version … is not in available releases"

The `force-deploy` annotation names a tag the ReleaseSource does not list. Set a listed tag, or pin any tag with `spec.wantedVersion`.

```bash {filename="Terminal"}
kubectl annotate rollout hello-world -n hello-world rollout.kuberik.com/force-deploy=1.4.1 --overwrite
```

### A `bypass-gates` annotation has no effect

A bypass for a build not newer than the deployed one is ignored (log: "Gate bypass requested for version not in candidates"). With `bypass-gates-only`, unnamed gates still hold the build, and the Event `BypassGatesUnknown` names gates the Rollout does not have. A bypass never skips an `Unhealthy` HealthCheck or a failed bake.

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world -o jsonpath='{.status.gates[*].name}'
```

## A deploy is stuck in Deploying

`bakeStatus` stays `Deploying` until every selected HealthCheck is `Healthy` and has changed since the deploy. Without `deployTimeout`, it waits forever.

### A HealthCheck stays Pending or Unhealthy

For a Kustomization HealthCheck, the message names the resources Flux has not finished (`Pending resources: …`).

```bash {filename="Terminal"}
kubectl get healthchecks -n hello-world -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.status}{"\t"}{.status.message}{"\n"}{end}'
```

### A Kustomization with `wait: true` stays `Pending (ProgressingWithRetry)`

With `wait: true`, Kuberik reads the Kustomization's `Ready` condition, which needs kustomize-controller's `CancelHealthCheckOnNewRevision` feature gate (Flux 2.7 or later); without it, a failing revision holds the next one until `spec.timeout`. Enable the gate, or set `wait: false` so Kuberik checks each managed resource.

```bash {filename="Terminal"}
kubectl patch kustomization hello-world -n hello-world --type merge -p '{"spec":{"wait":false}}'
```

See [Flux](/docs/integrations/fluxcd/) for the HealthCheck setup.

### The deploy never fails

Set `deployTimeout` so a deploy whose health checks never turn healthy fails instead of waiting.

```bash {filename="Terminal"}
kubectl patch rollout hello-world -n hello-world --type merge -p '{"spec":{"deployTimeout":"15m"}}'
```

## The bake failed

`Ready` is False with reason `BakeTimeFailed`. The message says whether a HealthCheck reported an error or the deploy timeout passed; `failedHealthChecks` records each failing check.

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world -o jsonpath='{.status.history[0].bakeStatusMessage}{"\n"}{.status.history[0].failedHealthChecks}'
```

### Retry the same build

The retry annotation resets the bake to `Deploying` and ignores errors from before the retry. The controller removes it; on a bake that is not `Failed` it logs "Retry annotation ignored".

```bash {filename="Terminal"}
kubectl annotate rollout hello-world -n hello-world rollout.kuberik.com/retry=true --overwrite
```

### Let the next release deploy

`unblock-failed` lets automatic deploys continue past the failed build; the controller removes it after the next deploy. That deploy runs with `BakeFailureDisabled=True`, so health check errors do not fail it.

```bash {filename="Terminal"}
kubectl annotate rollout hello-world -n hello-world rollout.kuberik.com/unblock-failed=true --overwrite
```

### A HealthCheck failed but the bake did not

`BakeFailureDisabled` is True until the next deploy: this deploy followed a failed bake (`PreviousBakeFailed`) or was made by hand during an incident (`DeployedWithUnhealthyHealthChecks`).

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world -o jsonpath='{.status.conditions[?(@.type=="BakeFailureDisabled")]}'
```

## Environments do not promote

The Environment sets `allowedVersions` on its RolloutGate and reports why in `WaveReady` and `LockstepConsistent`.

```bash {filename="Terminal"}
kubectl get environment hello-world -n hello-world \
  -o jsonpath='{range .status.conditions[*]}{.type}{"\t"}{.status}{"\t"}{.reason}{"\t"}{.message}{"\n"}{end}'
```

| Reason | Cause | Fix |
|---|---|---|
| `WaitingFor` | An earlier wave or tier has not baked the release, or its bake failed. The message names the site. | Wait, or fix that bake. |
| `WaitingForCandidate` | The revision the wave leader picked has no tag in this cluster's ReleaseSource. | Make both clusters read the same releases. |
| `Pinned` | `spec.wantedVersion` on the Rollout differs from the wave's pick. | Remove the pin (see `ManualDeployment` above). |
| `InvalidTopology`, `UnknownTier` | Tier names or wave numbers do not form one valid order. | Fix `spec.environment` and `spec.wave`. |
| `DuplicateSite` | Another Environment owns this name, tier and site. | Give the cluster its own `spec.site`, or take the site over (below). |
| `LockstepWaiting`, `LockstepMismatch` | A lockstep wave waits for every site to bake, or the sites disagree on `lockstep`. | Wait, or set the same `lockstep` on every site. |
| `CandidatesUnresolved` | The ReleaseSlice CRD is not served. | Install the release-controller. |

```bash {filename="Terminal"}
kubectl annotate environment hello-world -n hello-world environments.kuberik.com/take-over-site=true --overwrite
```

See [Promote Across Environments](/docs/releases/promote/) and [Environments](/docs/concepts/environments/).

## The ReleaseSource is not Ready

```bash {filename="Terminal"}
kubectl get releasesource hello-world -n hello-world \
  -o jsonpath='{range .status.conditions[*]}{.type}{"\t"}{.status}{"\t"}{.reason}{"\t"}{.message}{"\n"}{end}'
```

| Condition and reason | Cause | Fix |
|---|---|---|
| `Ready=False`, `ConfigInvalid` | The spec cannot be used. The message says which field. | Fix the spec and apply it again. |
| `SourceReachable=False`, `Unreachable`, with `Ready=True`, `Stale` | The registry did not answer. The last catalogue is still served. | Check the image path and registry credentials. |
| `Ready=False`, `SourceUnreachable` | The registry failed for three sync intervals, or no catalogue exists yet. | As above. |
| `Syncing=True`, `ResolveBudget` | Tags are still being resolved. The message counts them. | Wait. |

Missing tags are reported as Events: `TagsSkipped`, `MetadataRejected` and `TagUnresolvable`.

```bash {filename="Terminal"}
kubectl events -n hello-world --for releasesource/hello-world
```

## Other pages with troubleshooting

- [Datadog](/docs/integrations/datadog/#troubleshooting): monitors not checked, false positives
- [Install with Helm](/docs/installation/helm/#troubleshooting): install and upgrade errors
- [Set Up Dashboard Sign-in](/docs/installation/dashboard-auth/#troubleshooting): sign-in loops and blank pages

## Next steps

- [Gates](/docs/concepts/gates/): what holds a deploy and when gates are skipped
- [Rollouts](/docs/concepts/rollouts/): how a deploy is verified and baked
- [Annotations](/docs/reference/annotations/): every annotation used above
