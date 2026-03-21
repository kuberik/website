---
title: "What is Kuberik"
weight: 3
---

Kuberik is a Kubernetes-native delivery orchestrator. It takes over **after** you publish a new container image and handles everything that happens next: safe rollout, verification, and promotion.

## You Release, Kuberik Delivers

| | Owner | Example |
|---|---|---|
| **When to release** | You (developer/CI) | Push a git tag, merge to main |
| **How to deliver** | Kuberik | Rollout, verify health, promote across environments |

Your CI pipeline builds and tags a container image. Kuberik detects the new tag and orchestrates the delivery — gating, deploying, verifying, and promoting — without any further input from you.

Kuberik does not build images, decide when to release, or replace your GitOps tool. It works alongside FluxCD at the application delivery layer.

## How It Works

{{% steps %}}

### Publish

Your CI publishes a tagged image to a container registry.

### Detect

FluxCD detects the new tag via `ImagePolicy`.

### Gate

Kuberik creates a release candidate and evaluates gates.

### Deploy

Kuberik updates the Kustomization to deploy the new version.

### Verify

Health checks verify the deployment during bake time.

### Complete

The release is marked as succeeded or failed.

{{% /steps %}}

For a detailed component breakdown, see [Architecture](/docs/concepts/architecture/).

## Next Steps

{{< cards >}}
  {{< card title="Install Kuberik" link="/docs/installation/" icon="download" subtitle="Set up the controller" >}}
  {{< card title="Getting Started" link="/docs/getting-started/" icon="academic-cap" subtitle="Deploy your first app" >}}
  {{< card title="Publishing Releases" link="/docs/guides/publishing-releases/" icon="upload" subtitle="Set up your CI pipeline" >}}
{{< /cards >}}
