---
title: "Gates"
description: "What holds a deploy back: RolloutGates, schedules, approvals, service dependencies and health checks."
type_: concept
weight: 50
---

A gate decides which releases a [Rollout](/docs/concepts/rollouts/) may deploy next. Schedules, approvals and service dependencies all work through one resource, the `RolloutGate`, while health checks hold deploys their own way.

## How a gate holds a release

A `RolloutGate` points at one Rollout in its namespace and carries two fields. `passing: false` holds every release. `allowedVersions` lists the release tags the gate lets through. If the field is absent, the gate does not filter releases. If the list is empty, nothing gets through.

```yaml {filename="rolloutgate.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: RolloutGate
metadata:
  name: release-freeze
  namespace: hello-world
spec:
  rolloutRef:
    name: hello-world
  passing: true                        # false holds every release
  allowedVersions: ["1.4.0", "1.4.1"]  # only these may deploy
```

A release deploys only when every gate of the Rollout passes and every gate that sets `allowedVersions` lists it. Of the releases that pass, the Rollout deploys the newest. A held Rollout does not poll. It is evaluated again when a gate, a [HealthCheck](/docs/gates/health-checks/) or the release list changes.

You can write gates yourself, or let a controller own them. An [Environment](/docs/concepts/environments/) promotes a release by writing `allowedVersions` on its own gate. The sections below cover the controllers that write gates for you.

## Schedules

A `RolloutSchedule` (one namespace) or `ClusterRolloutSchedule` (namespaces picked by a selector) opens or closes a time window. Its rules match times of day, days of the week or date ranges in an IANA timezone (`UTC` by default). With the default action `Deny`, the gate holds while a rule matches. With `Allow`, it holds while no rule matches. The controller creates one gate per matched Rollout, named `schedule-gate-…`, and flips its `passing` field.

Set one up in [Set Deployment Windows](/docs/gates/schedules/).

## Manual approvals

An `ApprovalPolicy` (one namespace) or `ClusterApprovalPolicy` (namespaces picked by a selector) requires a person to approve each release. The controller creates one gate per matched Rollout, named `approval-gate-…`. Its `allowedVersions` is the set of versions named by `RolloutApproval` objects for that Rollout. Approving a version therefore means creating a `RolloutApproval` with `spec.rolloutRef` and `spec.version`. The approval can name a version that does not exist yet.

{{< callout type="important" >}}
`ApprovalPolicy`, `ClusterApprovalPolicy` and `RolloutApproval` need a rollout-controller release after v0.11.0. On v0.11.0, write the approval gate by hand.
{{< /callout >}}

Set one up in [Require a Manual Approval](/docs/gates/approvals/).

## Service dependencies

A `RolloutDependency` holds a consumer Rollout until a provider Rollout serves the contract version the consumer needs. Each consumer release declares its requirement in the `com.kuberik.rollout.requires.<contract>` OCI annotation. The controller writes the releases it admits to a gate named `dependency-<name>`, so it holds only the releases whose requirement is unmet. A provider release counts once its bake has succeeded. The dependency's `Satisfied` condition reads `WaitingForProvider` while a release waits, or `RequirementUnevaluable` when the annotation cannot be parsed.

Set one up in [Wait for Service Dependencies](/docs/gates/dependencies/).

## Health checks

A [HealthCheck](/docs/gates/health-checks/) selected by the Rollout's `healthCheckSelector` is not a gate. It holds a deploy in a different way. While any selected HealthCheck reports `Unhealthy`, automatic deploys stop, and the Rollout's `DeploymentBlocked` condition turns `True` with reason `UnhealthyHealthChecks`. `Pending` does not hold anything. The same HealthChecks then judge each deploy during its bake. A failed bake holds automatic deploys until someone acts.

Set them up in [Verify with Health Checks](/docs/gates/health-checks/).

## The GatesPassing condition

The Rollout reports the combined result of its gates in the `GatesPassing` condition. `kubectl get rollout` shows it in the `Gates` column. `status.gates` lists each gate with its message. Each entry in `status.candidates` shows `gated`, and `blockedBy` lists the gates that hold that release.

| Reason | Status | Meaning |
|---|---|---|
| `AllGatesPassing` | `True` | At least one release passes every gate. |
| `SomeGatesBlocking` | `False` | A gate has `passing: false`. |
| `NoAllowedVersions` | `False` | No release is allowed by every gate. This includes having no newer release to deploy. |
| `GatesBypassed` | `True` | A bypass lets one named build through. |

## When gates are skipped

Gates do not hold every deploy.

- On the first deploy. A Rollout with no history deploys even if its gates hold. If the gates allow none of the releases, it deploys the newest release. Health checks are skipped too, because nothing runs yet.
- On a deploy by hand. Setting `spec.wantedVersion` or the `rollout.kuberik.com/force-deploy` annotation skips gates and health checks.
- For one bypassed build. The `rollout.kuberik.com/bypass-gates` annotation lets one named build past the gates once. The build must be a release newer than the deployed one. The controller removes the annotation after the deploy. Add `rollout.kuberik.com/bypass-gates-only` with a comma-separated list of gate names to skip only those gates. A bypass does not skip health checks or a failed bake.

`bypass-gates-only` needs a rollout-controller release after v0.11.0. The [Annotations](/docs/reference/annotations/) reference lists the exact values.

## Related

- [Rollouts](/docs/concepts/rollouts/): how a release is chosen, deployed and baked
- [Gate Deploys](/docs/gates/): one guide per kind of gate
- [Troubleshoot](/docs/operate/troubleshooting/): what to check when a gate holds a release you expected to deploy
