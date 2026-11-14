---
title: "Troubleshoot"
description: "Find why a release does not deploy, a deploy hangs or a bake fails, and fix it with kubectl."
type_: guide
weight: 90
---

Find the condition that holds your Rollout and apply the fix under it. Every example uses the Rollout `hello-world` in namespace `hello-world`.

The symptoms below are named by the condition types and reasons this command prints. Events on the Rollout, such as `HealthCheckBlocking` and `BakeTimeFailed`, add detail.

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world \
  -o jsonpath='{range .status.conditions[*]}{.type}{"\t"}{.status}{"\t"}{.reason}{"\t"}{.message}{"\n"}{end}'
kubectl events -n hello-world --for rollout/hello-world
```

Other parts of Kuberik have their own Troubleshoot sections:

| Area | Page |
|---|---|
| ReleaseSource not Ready, tags missing | [Publish Releases from CI](/docs/releases/publish/#troubleshoot) |
| Environments do not promote (`WaveReady`, `LockstepConsistent`) | [Promote Across Environments](/docs/releases/promote/#troubleshoot) |
| Datadog monitors | [Datadog](/docs/integrations/datadog/#troubleshoot) |
| Install and upgrade errors | [Install with Helm](/docs/installation/helm/#troubleshooting) |
| Dashboard sign-in | [Set Up Dashboard Sign-in](/docs/installation/dashboard-auth/#troubleshoot) |

## A new release does not deploy

### `ReleasesUpdated` is False with reason `ReleaseSourceRequired`

The Rollout has no `spec.releaseSourceRef`, so it reads no releases. Point it at the app's [ReleaseSource](/docs/releases/publish/).

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

With reason `ReleaseSourceNotFound`, the name in `spec.releaseSourceRef` does not exist in the Rollout's namespace. With `ReleaseSourceNotReady`, the ReleaseSource exists but is not `Ready`; its conditions are explained in [Publish Releases from CI](/docs/releases/publish/#troubleshoot).

```bash {filename="Terminal"}
kubectl get releasesource -n hello-world
```

### `Ready` is False with reason `NoReleases`

The ReleaseSource admitted no tag: the image has no tags yet, or `spec.oci.filterTags` and `spec.oci.policy` match none of them. Compare the tags in the registry with the filter, then correct the ReleaseSource.

```bash {filename="Terminal"}
kubectl get releasesource hello-world -n hello-world -o jsonpath='{.status.count}{"\n"}{.spec.oci}{"\n"}'
```

```bash {filename="Terminal"}
kubectl edit releasesource hello-world -n hello-world
```

### `GatesPassing` is False with reason `SomeGatesBlocking`

A gate has `passing: false`, often a closed deployment window from a `RolloutSchedule` or a `ClusterRolloutSchedule`. The reason shows even when no release is waiting. List the gates and schedules.

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world -o jsonpath='{.status.gates}'
kubectl get rolloutschedules -n hello-world
kubectl get clusterrolloutschedules
```

To let one build through now, bypass the gates for it. The bypass takes effect on the next reconcile.

```bash {filename="Terminal"}
kubectl annotate rollout hello-world -n hello-world rollout.kuberik.com/bypass-gates=1.4.1 --overwrite
```

### `GatesPassing` is False with reason `NoAllowedVersions`

Newer releases are waiting, but none is in every gate's `allowedVersions`. `blockedBy` names the gates that hold each one.

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world -o jsonpath='{range .status.candidates[*]}{.tag}{"\t"}{.blockedBy}{"\n"}{end}'
```

An `approval-gate-…` lets a release through once a `RolloutApproval` names it. Apply one to approve 1.4.1.

```bash {filename="Terminal"}
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

A `dependency-…` gate means the provider has not deployed the contract version yet; see [Wait for Service Dependencies](/docs/gates/dependencies/).

### `DeploymentBlocked` is True with reason `UnhealthyHealthChecks`

A selected HealthCheck is `Unhealthy`; the message names it. Fix the workload, or deploy a known build by hand, which skips this hold.

```bash {filename="Terminal"}
kubectl get healthchecks -n hello-world
```

### `DeploymentBlocked` reason is `ManualDeployment`

A deploy by hand is pending or pinned: `spec.wantedVersion` is set, or a `rollout.kuberik.com/force-deploy` annotation names a tag that has not deployed yet. New releases wait. Remove whichever is set.

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world -o jsonpath='{.spec.wantedVersion}{"\t"}{.metadata.annotations.rollout\.kuberik\.com/force-deploy}{"\n"}'
```

```bash {filename="Terminal"}
kubectl patch rollout hello-world -n hello-world --type json \
  -p '[{"op":"remove","path":"/spec/wantedVersion"}]'
kubectl annotate rollout hello-world -n hello-world rollout.kuberik.com/force-deploy-
```

### `Ready` is False with reason `RolloutFailed`, "force deploy version … is not in available releases"

The `force-deploy` annotation names a tag the ReleaseSource does not list. Set a listed tag, or pin any tag with `spec.wantedVersion`.

```bash {filename="Terminal"}
kubectl annotate rollout hello-world -n hello-world rollout.kuberik.com/force-deploy=1.4.1 --overwrite
```

### A `bypass-gates` annotation has no effect

A bypass for a build that is not newer than the deployed one is ignored (log: "Gate bypass requested for version not in candidates"). With `bypass-gates-only`, unnamed gates still hold the build, and the Event `BypassGatesUnknown` names gates the Rollout does not have. A bypass never skips an `Unhealthy` HealthCheck or a failed bake.

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world -o jsonpath='{.status.gates[*].name}'
```

### The last bake failed

A failed bake stops automatic deploys until someone acts. See [The bake failed](#the-bake-failed).

## A deploy is stuck in Deploying

`bakeStatus` stays `Deploying` until every selected HealthCheck is `Healthy` and has changed since the deploy. Without `deployTimeout`, it waits forever.

### A HealthCheck stays Pending or Unhealthy

For a Kustomization HealthCheck, the message names the resources Flux has not finished (`Pending resources: …`).

```bash {filename="Terminal"}
kubectl get healthchecks -n hello-world -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.status}{"\t"}{.status.message}{"\n"}{end}'
```

### The message reads "Kustomization pending (ProgressingWithRetry)"

With `wait: true`, Kuberik reads the Kustomization's `Ready` condition, which needs kustomize-controller's `CancelHealthCheckOnNewRevision` feature gate (Flux 2.7 or later). Without it, a failing revision holds the next one until `spec.timeout`. Enable the gate, or set `wait: false` so Kuberik checks each managed resource.

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

`unblock-failed` lets automatic deploys continue past the failed build once a newer release passes the gates and no selected HealthCheck is `Unhealthy`. Right after a failed bake a check is often still `Unhealthy`, and then nothing deploys. To roll forward during the incident, deploy by hand with `spec.wantedVersion` or `force-deploy`.

```bash {filename="Terminal"}
kubectl annotate rollout hello-world -n hello-world rollout.kuberik.com/unblock-failed=true --overwrite
```

```bash {filename="Terminal"}
kubectl patch rollout hello-world -n hello-world --type merge -p '{"spec":{"wantedVersion":"1.4.2"}}'
```

The next deploy runs with `BakeFailureDisabled=True`, so health check errors do not fail it.

### A HealthCheck failed but the bake did not

`BakeFailureDisabled` is True until the next deploy. This deploy followed a bake that failed or did not finish (`PreviousBakeFailed`), or was made by hand while a HealthCheck was `Unhealthy` (`DeployedWithUnhealthyHealthChecks`).

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world -o jsonpath='{.status.conditions[?(@.type=="BakeFailureDisabled")]}'
```

## Check the result

Run the conditions command again. A Rollout that deploys automatically shows `GatesPassing=True` and `DeploymentBlocked=False`, and after the bake `Ready=True` with reason `BakeTimePassed`.

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world
```

## Next steps

- [Gates](/docs/concepts/gates/): what holds a deploy and when gates are skipped
- [Operate a Rollout by Hand](/docs/operate/manual-actions/): pin, deploy now, bypass, retry
- [Annotations](/docs/reference/annotations/): every annotation used above
