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
| [**Rollout**](/docs/concepts/rollouts/) | The core state machine. Reads the releases a `ReleaseSource` discovers and orchestrates releases. Drives either a `Kustomization` substitution or an `OCIRepository` tag. |
| [**ReleaseSource**](/docs/releases/publish/) | Lists the tags of an OCI repository, orders them by a policy and keeps the catalogue of releases (served by the release-controller). A Rollout points at one with `spec.releaseSourceRef`. |
| [**Environment**](/docs/concepts/environments/) | Places a Rollout in an environment tier (e.g. "production"), records each deploy as a GitHub deployment, and writes a `RolloutGate` that admits only the releases the upstream tier baked. |
| [**HealthCheck**](/docs/gates/health-checks/) | Reports health from a Flux `Kustomization` or from an integration (Datadog monitors, Prometheus alerts). The Rollout reads it before and during the bake. |
| [**RolloutGate**](/docs/concepts/gates/) | Holds builds until it allows them: written by hand, or by schedules, approval policies, service dependencies and Environments. |

![One rollout in the dashboard: the health checks it watches, all passing, and the resources it manages, 10 of 10 ready](/images/docs/concepts/architecture-rollout.png)

## How a build travels

A `ReleaseSource` finds a new tag in the OCI repository and adds it to its catalogue of releases. Every release newer than the deployed one becomes a candidate for the Rollout; `status.candidates` shows the newest of them.

`RolloutGates` decide which candidates may deploy. If any gate does not allow the build, the build waits until a gate changes. Gates never hold deploys you start by hand. On a Rollout's first deploy they never hold either: it deploys the newest release the gates allow, or the newest release if they allow none.

Kuberik then updates the Flux source it owns, a substitution variable on a `Kustomization` or the tag on an `OCIRepository`, and Flux applies the change. See [Propagation Modes](/docs/concepts/propagation/).

Once every selected health check is healthy, the bake starts: Kuberik waits for `bakeTime` and watches the `HealthChecks` for errors. The deploy ends with one bake status:

- {{< badge content="Succeeded" color="green" >}} No health check reported an error since the deploy, and the bake ran its full `bakeTime`. Downstream environments can now admit the build through their gates.
- {{< badge content="Failed" color="red" >}} A health check reported an error, or the checks were not healthy within `deployTimeout`. The build keeps running and further automatic deploys are held until someone acts; see [When a bake fails](/docs/concepts/rollouts/#when-a-bake-fails).
- {{< badge content="Cancelled" color="gray" >}} A deploy you started by hand replaced this one before its bake finished.

## Related

{{< next "/docs/concepts/rollouts/" "/docs/concepts/propagation/" "/docs/concepts/environments/" >}}
