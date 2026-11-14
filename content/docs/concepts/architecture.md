---
title: "Architecture"
weight: 1
---

Kuberik is a GitOps-native orchestration layer that extends the standard controller pattern to handle complex deployment lifecycles.

## System Overview

{{< fig id="architecture" caption="Kuberik decides which version runs; Flux fetches and applies it." >}}

## Component Roles

| Component | Purpose |
|-----------|---------|
| **Rollout** | The core state machine. Reads the releases a `ReleaseSource` discovers and orchestrates releases. Drives either a `Kustomization` substitution or an `OCIRepository` tag. |
| **ReleaseSource** | Lists the tags of an OCI repository, orders them by a policy and keeps the catalogue of releases (served by the release-controller). A Rollout points at one with `spec.releaseSourceRef`. |
| **Environment** | Maps a Rollout to a logical target (e.g. "production") and syncs status to external backends (GitHub). |
| **HealthCheck** | Probes system health during the bake period (HTTP, Datadog, Script). |
| **RolloutGate** | Blocks a Rollout from proceeding until specific conditions (manual approval, API check) are met. |

![One rollout in the dashboard: the running build, its deployment pipeline, the health checks it watches and the resources it manages](/screenshots/dashboard/overview.png)

## The Release Lifecycle

{{% steps %}}

### Discovery

Flux detects a new image tag. Kuberik creates a pending `Release`.

### Gating

`RolloutGates` are evaluated. If any gate fails or is pending, the release waits.

### Execution

Kuberik updates the Flux source it owns: a substitution variable on a `Kustomization`, or the tag on an `OCIRepository`. Flux applies the changes. See [Propagation Modes](/docs/concepts/propagation/).

### Bake Time

Kuberik waits for a defined stabilization period.

### Verification

`HealthChecks` run continuously.

- {{< badge content="Available" color="green" >}} All health checks pass — release is promoted.
- {{< badge content="Failed" color="red" >}} A health check fails — release is halted.

{{% /steps %}}
