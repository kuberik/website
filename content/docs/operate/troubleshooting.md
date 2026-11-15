---
title: "Troubleshoot"
description: "Match what the dashboard or kubectl shows to its fix, from a blocked release to a roll back."
type_: guide
weight: 90
---

Find what the dashboard shows, or the condition kubectl prints, in the table below and go to its fix. Examples use the [Rollout](/docs/concepts/rollouts/) `hello-world` in namespace `hello-world`, environment `production`.

## What the dashboard shows

The banner at the top of a rollout's **Overview** names what holds it. The words below are the dashboard's own; `production`, `1.4.1` and `payments` stand for your environment, build and service.

| The dashboard shows | Condition on the Rollout | Go to |
|---|---|---|
| **Deployment failed** banner<br>the **Retry** and **Roll back** buttons | `Ready=False`, `BakeTimeFailed` | [The deployment failed](#the-deployment-failed) |
| The **stuck** chip<br>"Stuck — deploying for 2h" | `bakeStatus` `Deploying` | [A deploy is stuck in Deploying](#a-deploy-is-stuck-in-deploying) |
| **Recovery mode**, while a deploy runs | `BakeFailureDisabled=True` | [A HealthCheck failed but the deploy did not](#a-healthcheck-failed-but-the-deploy-did-not) |
| **Rolled back** | `status.history[0]` is older than the build before it (a pin, or a force-deploy of an older build until its bake succeeds) | [Roll back to the previous build](#roll-back-to-the-previous-build) |
| **Held** banner<br>"HealthCheck '…' in namespace '…' is not healthy" | `DeploymentBlocked=True`, `UnhealthyHealthChecks` | [Blocked by an unhealthy HealthCheck](#blocked-by-an-unhealthy-healthcheck) |
| **production is waiting on an approval**<br>**Waiting for approval**<br>**Needs your approval** | `GatesPassing=False`, `NoAllowedVersions` | [Blocked by an approval](#blocked-by-an-approval-or-another-rule) |
| **production is waiting for payments ^1.67.0** | `GatesPassing=False`, `NoAllowedVersions` | [Blocked by a service dependency](#blocked-by-a-service-dependency) |
| **production is waiting on promotion order** | `GatesPassing=False`, `NoAllowedVersions` | [Promote Across Environments](/docs/releases/promote/#troubleshoot) |
| **Lockstep is set on … only** | `LockstepConsistent=False` on the Environment; holds nothing | [Promote Across Environments](/docs/releases/promote/#troubleshoot) |
| **Automatic deploys are paused**<br>**production is held** | `GatesPassing=False`, `SomeGatesBlocking` | [Blocked by a closed schedule](#blocked-by-a-closed-schedule-or-a-failing-gate) |
| **production is pinned to 1.4.1**<br>the **Clear pin** button | `DeploymentBlocked` reason `ManualDeployment` | [Blocked by a pin](#blocked-by-a-pin-or-a-pending-deploy-by-hand) |
| **No release source** | `ReleasesUpdated=False`, `ReleaseSourceRequired` | [No release source](#no-release-source) |
| **No releases yet** | `Ready=False`, `NoReleases` | [No releases yet](#no-releases-yet) |

To read the same facts with kubectl, print the conditions and the Rollout's events (`HealthCheckBlocking`, `BakeTimeFailed`).

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world \
  -o jsonpath='{range .status.conditions[*]}{.type}{"\t"}{.status}{"\t"}{.reason}{"\t"}{.message}{"\n"}{end}'
kubectl events -n hello-world --for rollout/hello-world
```

### Read the controller logs

The controllers' logs hold the rest, such as "Retry annotation ignored". The Helm chart runs them in `kuberik-system`; add `--since=1h` to limit the output.

```bash {filename="Terminal"}
kubectl logs -n kuberik-system deployment/rollout-controller
kubectl logs -n kuberik-system deployment/release-controller
kubectl logs -n kuberik-system deployment/environment-controller-manager
```

The integrations log as `datadog-controller-controller-manager` and `openkruise-controller-manager`. [Installed with kubectl](/docs/installation/manual/), the first two are `rollout-controller-controller-manager` and `release-controller-controller-manager`, the latter in `release-controller-system`.

## A new release is blocked

### No release source

`ReleasesUpdated` is False with reason `ReleaseSourceRequired`: the Rollout has no `spec.releaseSourceRef`, so it reads no releases. Point it at the app's ReleaseSource.

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

### No releases yet

`Ready` is False with reason `NoReleases`. The ReleaseSource admitted no tag: the image has no tags yet, or `spec.oci.filterTags` and `spec.oci.policy` match none of them. Compare the tags in the registry with the filter, then correct the ReleaseSource.

```bash {filename="Terminal"}
kubectl get releasesource hello-world -n hello-world -o jsonpath='{.status.count}{"\n"}{.spec.oci}{"\n"}'
```

```bash {filename="Terminal"}
kubectl edit releasesource hello-world -n hello-world
```

### Blocked by a closed schedule or a failing gate

`GatesPassing` is False with reason `SomeGatesBlocking`. A release is waiting and a gate has `passing: false`, often a closed window from a [`RolloutSchedule`](/docs/gates/schedules/) or [`ClusterRolloutSchedule`](/docs/gates/schedules/). With nothing waiting, the condition stays `True` and the closed gate is still listed in `status.gates`.

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world -o jsonpath='{.status.gates}'
kubectl get rolloutschedules -n hello-world
kubectl get clusterrolloutschedules
```

To let one build through now, select **Skip once** on the gate's tile ([Skip a gate once](/docs/operate/dashboard/#skip-a-gate-once)). With kubectl, bypass the gates for that build; the bypass takes effect on the next reconcile.

```bash {filename="Terminal"}
kubectl annotate rollout hello-world -n hello-world rollout.kuberik.com/bypass-gates=1.4.1 --overwrite
```

### Blocked by an approval or another rule

`GatesPassing` is False with reason `NoAllowedVersions`. Newer releases are waiting, but none is in every gate's `allowedVersions`. `blockedBy` names the gates that hold each one.

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world -o jsonpath='{range .status.candidates[*]}{.tag}{"\t"}{.blockedBy}{"\n"}{end}'
```

An `approval-gate-…` lets a release through once a [`RolloutApproval`](/docs/gates/approvals/) names it. In the dashboard, select **Approve** on the gate's tile ([Approve a build](/docs/operate/dashboard/#approve-a-build)). With kubectl, apply one to approve 1.4.1.

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

### Blocked by a service dependency

A `dependency-…` gate in `blockedBy` means the provider has not deployed the contract version yet. Ship the provider, or see [Wait for Service Dependencies](/docs/gates/dependencies/).

```bash {filename="Terminal"}
kubectl get rolloutdependencies -n hello-world
```

### Blocked by an unhealthy HealthCheck

`DeploymentBlocked` is True with reason `UnhealthyHealthChecks`. A selected [HealthCheck](/docs/gates/health-checks/) is `Unhealthy`; the message names it. Fix the workload, or deploy a known build by hand, which skips this hold.

```bash {filename="Terminal"}
kubectl get healthchecks -n hello-world
```

### Blocked by a pin or a pending deploy by hand

`DeploymentBlocked` has reason `ManualDeployment`. A deploy by hand is pending or pinned: `spec.wantedVersion` is set, or a `rollout.kuberik.com/force-deploy` annotation names a tag that has not deployed yet. New releases wait. Remove whichever is set, or select **Clear pin** in the dashboard.

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

### Promotion stalls and the log reads "API rate limit exceeded"

The environment-controller calls GitHub with each Environment's token on every Rollout change and every `spec.requeueInterval` (default 1 minute). Once the token's hourly limit is spent, reconciles fail before the gate updates, so the gate keeps its last `allowedVersions`.

```bash {filename="Terminal"}
kubectl logs -n kuberik-system deployment/environment-controller-manager --since=1h | grep "rate limit"
curl -s -H "Authorization: Bearer <your-token>" https://api.github.com/rate_limit
```

The error ends in `API rate limit exceeded for …` and `[rate reset in …]`. Promotion resumes after the reset. To spend fewer calls, reconcile each Environment less often; it then sees the earlier tier's bake later.

```bash {filename="Terminal"}
kubectl patch environment hello-world-production -n hello-world --type merge -p '{"spec":{"requeueInterval":"5m"}}'
```

### The last deploy failed

A failed deploy stops automatic deploys until someone acts. See [The deployment failed](#the-deployment-failed).

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

## The deployment failed

The dashboard shows **Deployment failed**; `Ready` is False with reason `BakeTimeFailed`. The message says whether a HealthCheck reported an error or the deploy timeout passed; `failedHealthChecks` records each failing check. To ship a fix past the bad build, see [Deploy a specific version](/docs/operate/manual-actions/#deploy-a-specific-version).

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world -o jsonpath='{.status.history[0].bakeStatusMessage}{"\n"}{.status.history[0].failedHealthChecks}'
```

### Roll back to the previous build

This works for any build, failed or baked; Kuberik never rolls back on its own. In the dashboard, [Roll back](/docs/operate/dashboard/#roll-back) pins the Rollout to an earlier build. With kubectl, print the previous build's tag.

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world -o jsonpath='{.status.history[1].version.tag}{"\n"}'
```

Then set `spec.wantedVersion` to the tag it printed.

```bash {filename="Terminal"}
kubectl patch rollout hello-world -n hello-world --type merge -p '{"spec":{"wantedVersion":"<previous-tag>"}}'
```

The pin deploys past gates and a failed bake, and the dashboard shows **Rolled back**. New releases wait until you clear the pin, as in [Blocked by a pin](#blocked-by-a-pin-or-a-pending-deploy-by-hand). Do not roll back with `force-deploy`: once the earlier build's bake succeeds, the Rollout deploys the newest release the gates allow, the failed one included.

### Retry the same build

**Retry** in the dashboard sets this annotation. It resets the bake to `Deploying` and ignores errors from before the retry. The controller removes it; on a bake that is not `Failed` it logs "Retry annotation ignored".

```bash {filename="Terminal"}
kubectl annotate rollout hello-world -n hello-world rollout.kuberik.com/retry=true --overwrite
```

### Let a newer release deploy

`unblock-failed` lets automatic deploys continue past the failed build once a newer release passes the gates and no selected HealthCheck is `Unhealthy`. Right after a failed bake a check is often still `Unhealthy`, and then nothing deploys. To roll forward during the incident, deploy by hand with `spec.wantedVersion` or `force-deploy`.

```bash {filename="Terminal"}
kubectl annotate rollout hello-world -n hello-world rollout.kuberik.com/unblock-failed=true --overwrite
```

```bash {filename="Terminal"}
kubectl patch rollout hello-world -n hello-world --type merge -p '{"spec":{"wantedVersion":"1.4.2"}}'
```

The next deploy runs with `BakeFailureDisabled=True`, so health check errors do not fail it.

### A HealthCheck failed but the deploy did not

While the deploy runs, the dashboard shows **Recovery mode**; `BakeFailureDisabled` stays True until the next deploy starts. This deploy followed a bake that failed or did not finish (`PreviousBakeFailed`), or was made by hand while a HealthCheck was `Unhealthy` (`DeployedWithUnhealthyHealthChecks`).

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world -o jsonpath='{.status.conditions[?(@.type=="BakeFailureDisabled")]}'
```

## Troubleshoot other parts

These pages have their own Troubleshoot section.

| Area | Page |
|---|---|
| ReleaseSource not Ready, tags missing | [Publish Releases from CI](/docs/releases/publish/#troubleshoot) |
| [Environments](/docs/concepts/environments/) do not promote (`WaveReady`, `LockstepConsistent`) | [Promote Across Environments](/docs/releases/promote/#troubleshoot) |
| Canary steps stall, tests never run | [Roll Out with a Canary](/docs/releases/canary/#troubleshoot) |
| HealthChecks never start a bake or never change | [Verify with Health Checks](/docs/gates/health-checks/#troubleshoot) |
| Approval policies, **Needs approval** instead of **Needs you** | [Require a Manual Approval](/docs/gates/approvals/#troubleshoot) |
| Kustomization substitutes and HealthChecks | [Flux](/docs/integrations/fluxcd/#troubleshoot) |
| GitHub deployments and sign-in | [GitHub](/docs/integrations/github/#troubleshoot) |
| Datadog monitors | [Datadog](/docs/integrations/datadog/#troubleshoot) |
| Prometheus alerts | [Prometheus](/docs/integrations/prometheus/#troubleshoot) |
| Install and upgrade errors | [Install with Helm](/docs/installation/helm/#troubleshooting) |
| Dashboard sign-in | [Set Up Dashboard Sign-in](/docs/installation/dashboard-auth/#troubleshoot) |

## Check the result

Print the conditions again. A Rollout that deploys automatically shows `GatesPassing=True` and `DeploymentBlocked=False`, and after the bake `Ready=True` with reason `BakeTimePassed`.

```bash {filename="Terminal"}
kubectl get rollout hello-world -n hello-world \
  -o jsonpath='{range .status.conditions[*]}{.type}{"\t"}{.status}{"\t"}{.reason}{"\n"}{end}'
```

## Next steps

{{< next "/docs/concepts/gates/" "/docs/operate/manual-actions/" "/docs/reference/annotations/" >}}
