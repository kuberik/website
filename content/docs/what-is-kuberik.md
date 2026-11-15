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

![The dashboard home: what is deploying right now, what a rule is holding, and your merged changes with how far each one got](/screenshots/dashboard/home.png)

## What stays with you

Your CI builds the artifact and decides when a release exists by pushing its tag. Flux stays your GitOps tool: it fetches sources and applies manifests, and Kuberik only changes which version Flux applies. Kuberik does not build images, run CI, or replace Flux.

## Related

{{< next "/docs/concepts/architecture/" "/docs/getting-started/" "/docs/releases/publish/" >}}
