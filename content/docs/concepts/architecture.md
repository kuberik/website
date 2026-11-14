---
title: "How Kuberik Works"
description: "The controllers, the resources they own, and how a release travels from registry to cluster."
type_: concept
weight: 10
---

Kuberik is a set of controllers that decide which build of your app runs in each environment and write that choice into Flux. This page names the resources they work with and follows one build from discovery to verification.

## How the resources connect

{{< fig id="architecture" caption="Kuberik decides which version runs; Flux fetches and applies it." >}}

## What each resource does

| Resource | Purpose |
|-----------|---------|
| **Rollout** | The core state machine. Reads the releases a `ReleaseSource` discovers and orchestrates releases. Drives either a `Kustomization` substitution or an `OCIRepository` tag. |
| **ReleaseSource** | Lists the tags of an OCI repository, orders them by a policy and keeps the catalogue of releases (served by the release-controller). A Rollout points at one with `spec.releaseSourceRef`. |
| **Environment** | Maps a Rollout to a logical target (e.g. "production") and syncs status to external backends (GitHub). |
| **HealthCheck** | Reports health from a Flux `Kustomization` or from an integration (Datadog monitors, Prometheus alerts). The Rollout reads it before and during the bake. |
| **RolloutGate** | Holds builds until it allows them: written by hand, or by schedules, approval policies, service dependencies and Environments. |

![One rollout in the dashboard: the running build, its deployment pipeline, the health checks it watches and the resources it manages](/screenshots/dashboard/overview.png)

## How a build travels

A `ReleaseSource` finds a new tag in the OCI repository and adds it to its catalogue of releases. Every release newer than the deployed one becomes a candidate for the Rollout; `status.candidates` shows the newest of them.

`RolloutGates` decide which candidates may deploy. If any gate does not allow the build, the build waits until a gate changes.

Kuberik then updates the Flux source it owns, a substitution variable on a `Kustomization` or the tag on an `OCIRepository`, and Flux applies the change. See [Propagation Modes](/docs/concepts/propagation/).

Once every selected health check is healthy, the bake starts: Kuberik waits for `bakeTime` and watches the `HealthChecks` for errors. The deploy ends with one bake status:

- {{< badge content="Succeeded" color="green" >}} No health check reported an error since the deploy, and the bake ran its full `bakeTime`. Downstream environments can now admit the build through their gates.
- {{< badge content="Failed" color="red" >}} A health check reported an error, or the checks were not healthy within `deployTimeout`. The build keeps running and further automatic deploys are held until someone acts; see [When a bake fails](/docs/concepts/rollouts/#when-a-bake-fails).

## Related

- [Rollouts](/docs/concepts/rollouts/): how a Rollout chooses, deploys and verifies a build
- [Propagation Modes](/docs/concepts/propagation/): image tag or rendered manifests
- [Environments](/docs/concepts/environments/): ordering deploys across environments
