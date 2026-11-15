---
title: "What Is Kuberik"
description: "What Kuberik does after your CI publishes a release, and what it leaves to you."
type_: concept
weight: -20
---

Kuberik deploys the versions your CI publishes to Kubernetes: it picks up each new release, holds it until its gates allow it, deploys it through Flux and verifies it during bake time.

{{< fig id="release-stages" caption="One release, from a new tag in your registry to a record in the Rollout history." >}}

## What Kuberik does with a release

A release is a tagged artifact in a registry: the application image, or the rendered manifests for one environment pushed as an OCI artifact. From the moment the tag exists, Kuberik takes it through five stages; a person acts only where a gate asks for an approval. See [Propagation Modes](/docs/concepts/propagation/) for how the two kinds of artifact compare.

| Stage | What happens | Resources |
|---|---|---|
| Detect | A [`ReleaseSource`](/docs/releases/publish/) lists the new tag and adds it to its catalogue of releases. | `ReleaseSource` |
| Gate | The [`Rollout`](/docs/concepts/rollouts/) makes the release a candidate and checks it against every gate: deployment windows, approvals, service dependencies. Gates never hold a Rollout's first deploy or a deploy you start by hand. | `Rollout`, [`RolloutGate`](/docs/concepts/gates/) |
| Deploy | Kuberik writes the tag into a Kustomization substitution, or moves the tag on an OCIRepository, and Flux applies it. | `Kustomization`, `OCIRepository` |
| Verify | Health checks must report healthy, then stay healthy for the bake time. | [`HealthCheck`](/docs/gates/health-checks/) |
| Record | The deploy is recorded in the Rollout's history as `Succeeded` or `Failed`, or `Cancelled` when a deploy you start by hand replaced it before it finished. | `Rollout` |

A failed bake stops automatic deploys of that Rollout. They resume when someone deploys a version by hand, pins one, unblocks the Rollout, or retries the bake and it succeeds.

![Home in the dashboard: Attention, with a billing-edge change waiting for your approval in production and its Approve button, above Your changes, where the pull requests of checkout-api, platform-telemetry and recommender-svc each show the environment they have reached](/images/docs/what-is/home.png)

## Works with

Kuberik runs on Kubernetes 1.30 or later and deploys through Flux. Promotion between environments goes through GitHub, even on one cluster; the other systems are optional and each adds one thing.

| System | Status | What Kuberik does with it |
|---|---|---|
| [Flux](/docs/integrations/fluxcd/) 2.6 or later | Required | Applies each version through a Kustomization or an OCIRepository |
| Argo CD | Not supported | Nothing yet: Kuberik reads and writes Flux objects only |
| [GitHub](/docs/integrations/github/) | Required to promote | Carries each bake result from one environment to the next; dashboard sign-in and pull requests |
| [Datadog](/docs/integrations/datadog/), [Prometheus](/docs/integrations/prometheus/) | Optional | Monitors and alerts become HealthChecks |
| OpenKruise | Optional | Canary steps inside one deploy ([Roll Out with a Canary](/docs/releases/canary/)) |

## What stays with you

Your CI builds the artifact and decides when a release exists by pushing its tag. Flux stays your GitOps tool: it fetches sources and applies manifests, and Kuberik only changes which version Flux applies. Kuberik does not build images, run CI, or replace Flux.

## Related

{{< next "/docs/concepts/architecture/" "/docs/getting-started/" "/docs/releases/publish/" >}}
