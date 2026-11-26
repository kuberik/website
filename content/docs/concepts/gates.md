---
title: "How Gates Work"
description: "What holds a deploy back: RolloutGates, schedules, approvals, service dependencies and health checks."
type_: concept
weight: 50
---

A gate decides which releases a [Rollout](/docs/concepts/rollouts/) may deploy next. Schedules, approvals and service dependencies all work through one resource, the [RolloutGate](/docs/reference/api/#rolloutgate), while health checks hold deploys their own way.

{{< fig id="gate-model" caption="Every gate is a RolloutGate; a release deploys only when every gate lets it through, and an Unhealthy HealthCheck holds it on a separate path." >}}

## How a gate holds a release

A RolloutGate points at one Rollout in its namespace and carries two fields. `passing: false` holds every release. `allowedVersions` lists the release tags the gate lets through. If the field is absent, the gate does not filter releases. If the list is empty, nothing gets through.

```yaml {filename="rolloutgate.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: RolloutGate
metadata:
  name: release-freeze
  namespace: hello-world
spec:
  rolloutRef:
    name: hello-world
  passing: true
  allowedVersions: ["1.4.0", "1.4.1"]  # only these may deploy
```

A release deploys only when every gate of the Rollout passes and every gate that sets `allowedVersions` lists it. Of the releases that pass, the Rollout deploys the newest. A held Rollout does not poll. It is evaluated again when a gate, a [HealthCheck](/docs/gates/health-checks/) or the release list changes.

You can write gates yourself, or let a controller own them. An [Environment](/docs/concepts/environments/) promotes a release by writing `allowedVersions` on its own gate. The sections below cover the controllers that write gates for you.

## Schedules

A [RolloutSchedule](/docs/gates/schedules/) (one namespace) or [ClusterRolloutSchedule](/docs/gates/schedules/) (namespaces picked by a selector) opens or closes a time window. Its rules match times of day, days of the week or date ranges in an IANA timezone (`UTC` by default). With the default action `Deny`, the gate holds while a rule matches. With `Allow`, it holds while no rule matches. The controller creates one gate per matched Rollout, named `schedule-gate-…`, and flips its `passing` field.

Set one up in [Set Deployment Windows](/docs/gates/schedules/).

## Manual approvals

An [ApprovalPolicy](/docs/gates/approvals/) (one namespace) or [ClusterApprovalPolicy](/docs/gates/approvals/) (namespaces picked by a selector) requires a person to approve each release. The controller creates one gate per matched Rollout, named `approval-gate-…`. Its `allowedVersions` is the set of versions named by [RolloutApproval](/docs/gates/approvals/) objects for that Rollout. Approving a version therefore means creating a RolloutApproval with `spec.rolloutRef` and `spec.version`. The approval can name a version that does not exist yet.


Set one up in [Require a Manual Approval](/docs/gates/approvals/).

## Service dependencies

A [RolloutDependency](/docs/gates/dependencies/) holds a consumer Rollout until a provider Rollout serves the contract version the consumer needs. Each consumer release declares its requirement in the `com.kuberik.rollout.requires.<contract>` OCI annotation. The controller writes the releases it admits to a gate named `dependency-<name>`, so it holds only the releases whose requirement is unmet. A provider release counts once its bake has succeeded. The dependency's `Satisfied` condition reads `WaitingForProvider` while a release waits, or `RequirementUnevaluable` when the annotation cannot be parsed.

Set one up in [Wait for Service Dependencies](/docs/gates/dependencies/).

## Health checks

A HealthCheck selected by the Rollout's `healthCheckSelector` is not a gate. It holds a deploy in a different way. While any selected HealthCheck reports `Unhealthy`, automatic deploys stop, and the Rollout's `DeploymentBlocked` condition turns `True` with reason `UnhealthyHealthChecks`. `Pending` does not hold anything. The same HealthChecks then judge each deploy during its bake. A failed bake holds automatic deploys until someone acts.

Set them up in [Verify with Health Checks](/docs/gates/health-checks/).

## Gates that guard rollbacks

A gate holds deploys by default. Set `appliesTo: [Rollback]` to make it guard [automatic rollbacks](/docs/releases/rollback/) instead. A rollback gate takes a semver `versionConstraint` rather than a list of tags, so it stays right when a new build finishes.

```yaml {filename="rollback-gate.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: RolloutGate
metadata:
  name: no-rollback-below-2-3
  namespace: hello-world
spec:
  rolloutRef:
    name: hello-world
  appliesTo: [Rollback]  # default: [Deploy]
  passing: true
  versionConstraint: ">=2.3.0"
```

| Gate | Effect on a rollback |
|---|---|
| `passing: false` | No rollback |
| `versionConstraint: ">=2.3.0"` | Rolls back only to 2.3.0 or newer |
| `appliesTo: [Deploy, Rollback]` | Guards both directions |

Schedules, approvals and dependency gates keep the default `[Deploy]`, so a rollback runs during a freeze and needs no approval. A rollback gate that a controller updates must have been evaluated after the failed deploy started. The Rollout waits up to 2 minutes for it, then holds the failed build.

## The GatesPassing condition

The Rollout reports the combined result of its gates in the `GatesPassing` condition. `kubectl get rollout` shows it in the `Gates` column. `status.gates` lists each gate with its message. Each entry in `status.candidates` shows `gated`, and `blockedBy` lists the gates that hold that release.

| Reason | Status | Meaning |
|---|---|---|
| `AllGatesPassing` | `True` | A waiting release passes every gate, or no release is waiting (even behind a closed gate). |
| `SomeGatesBlocking` | `False` | A release is waiting and a gate has `passing: false`. |
| `NoAllowedVersions` | `False` | Releases are waiting, but none is in every gate's `allowedVersions`. |
| `GatesBypassed` | `True` | A bypass lets one named build through. |

## When gates are skipped

Gates do not hold every deploy.

- On the first deploy. Gates never hold a Rollout's first deploy, by design: it deploys the newest release the gates allow, or the newest release if they allow none. The `Unhealthy` hold is skipped too, because nothing runs yet.
- On a deploy by hand. Setting `spec.wantedVersion` or the `rollout.kuberik.com/force-deploy` annotation skips the gates and the `Unhealthy` hold.
- For one bypassed build. The `rollout.kuberik.com/bypass-gates` annotation lets one named build past the gates once. The build must be a release newer than the deployed one. The controller removes the annotation after the next deploy, whichever build it ships. Add `rollout.kuberik.com/bypass-gates-only` with a comma-separated list of gate names to skip only those gates; the annotations then stay until the named build deploys. A bypass does not skip health checks or a failed bake.

None of these skips the bake. It still waits for the health checks to turn `Healthy`, and fails on a HealthCheck error or on `deployTimeout`. The exceptions are a deploy that follows a bake that failed or did not finish, and a deploy by hand made while a HealthCheck is `Unhealthy`: their bakes ignore health check errors (`BakeFailureDisabled`).

An automatic rollback skips deploy gates too, but not [rollback gates](#gates-that-guard-rollbacks).

The [Annotations](/docs/reference/annotations/) reference lists the exact values.

## Related

{{< next "/docs/concepts/rollouts/" "/docs/gates/" "/docs/operate/troubleshooting/" >}}
