---
title: "What Is Kuberik"
description: "What Kuberik does after your CI publishes a release, and what it leaves to you."
type_: concept
keywords: ["github down#what-kuberik-needs-from-github-and-what-happens-when-github-is-down", "github outage#what-kuberik-needs-from-github-and-what-happens-when-github-is-down", "outage#what-kuberik-needs-from-github-and-what-happens-when-github-is-down", "gitlab#what-kuberik-needs-from-github-and-what-happens-when-github-is-down", "gitlab support#what-kuberik-needs-from-github-and-what-happens-when-github-is-down", "github token#what-kuberik-needs-from-github-and-what-happens-when-github-is-down"]
weight: -20
---

Kuberik deploys the versions your CI publishes to Kubernetes: it picks up each new release, holds it until its gates allow it, deploys it through Flux and verifies it during bake time.

{{< fig id="release-stages" caption="One release, from a new tag in your registry to a record in the Rollout history." >}}

## What Kuberik does with a release

A release is a tagged artifact in a registry: the application image, or the rendered manifests for one environment pushed as an OCI artifact. From the moment the tag exists, Kuberik takes it through five stages; a person acts only where a gate asks for an approval. See [Propagation Modes](/docs/concepts/propagation/) for how the two kinds of artifact compare.

![Home in the dashboard: Attention, with a billing-edge change waiting for your approval in production and its Approve button, above Your changes, where the pull requests of checkout-api, platform-telemetry and recommender-svc each show the environment they have reached](/images/docs/what-is/home.png)

| Stage | What happens | Resources |
|---|---|---|
| Detect | A [`ReleaseSource`](/docs/releases/publish/) lists the new tag and adds it to its catalogue of releases. | `ReleaseSource` |
| Gate | The [`Rollout`](/docs/concepts/rollouts/) makes the release a candidate and checks it against every gate: deployment windows, approvals, service dependencies. Gates never hold a Rollout's first deploy or a deploy you start by hand. | `Rollout`, [`RolloutGate`](/docs/concepts/gates/) |
| Deploy | Kuberik writes the tag into a Kustomization substitution, or moves the tag on an OCIRepository, and Flux applies it. | `Kustomization`, `OCIRepository` |
| Verify | Health checks must report healthy, then stay healthy for the bake time. | [`HealthCheck`](/docs/gates/health-checks/) |
| Record | The deploy is recorded in the Rollout's history as `Succeeded` or `Failed`, or `Cancelled` when a deploy you start by hand replaced it before it finished. | `Rollout` |

A failed bake stops automatic deploys of that Rollout, and the failed build is held: it does not deploy again on its own. With [automatic rollback](/docs/releases/rollback/) on, the Rollout redeploys the last good build. Otherwise automatic deploys resume when someone deploys a version by hand, pins one, unblocks the Rollout, or retries the bake and it succeeds.

## Works with

Kuberik runs on Kubernetes 1.30 or later and deploys through Flux. Promotion between environments goes through GitHub, even on one cluster; the other systems are optional and each adds one thing.

| System | Status | What Kuberik does with it |
|---|---|---|
| [Flux](/docs/integrations/fluxcd/) 2.6 or later | Required | Applies each version through a Kustomization or an OCIRepository |
| Argo CD | Not supported | Kuberik reads and writes Flux objects only |
| [GitHub](/docs/integrations/github/) | Required to promote | Carries each bake result from one environment to the next; the dashboard reads commits and pull requests through each person's GitHub connection |
| GitLab | Not supported | Environments record and read deploys through GitHub only ([FAQ](#what-kuberik-needs-from-github-and-what-happens-when-github-is-down)) |
| [Datadog](/docs/integrations/datadog/), [Prometheus](/docs/integrations/prometheus/) | Optional | Monitors and alerts become HealthChecks |
| OpenKruise | Optional | Canary steps inside one deploy ([Roll Out with a Canary](/docs/releases/canary/)) |

Install Kuberik in every cluster that runs your apps: each cluster's controllers deploy its own Rollouts and reach other clusters only through GitHub deployments ([Sites and waves](/docs/concepts/environments/#sites-and-waves)). One cluster's dashboard is the hub for all of them, and deploys do not depend on it ([Connect several clusters](/docs/installation/helm/#connect-several-clusters)).

## What stays with you

Your CI builds the artifact and decides when a release exists by pushing its tag. Flux stays your GitOps tool: it fetches sources and applies manifests, and Kuberik only changes which version Flux applies. Kuberik does not build images, run CI, or replace Flux.

## FAQ

### What Kuberik needs from GitHub, and what happens when GitHub is down

To promote across environments, Kuberik needs a GitHub token in each app namespace that can read and write deployments on the app's repository. The environment-controller uses it only for the deployments API: it records each deploy as a GitHub deployment and reads the other tiers' deployments to decide what each tier may deploy. GitHub is the only backend an `Environment` supports; GitLab is not one of them. The dashboard's commit and pull request views use a separate, optional GitHub App, and [the GitHub integration page](/docs/integrations/github/) sets up both.

When GitHub is unreachable, running workloads are unaffected: Flux and Kubernetes keep running what is deployed, and Rollouts, health checks and bake times never call GitHub. Each environment keeps deploying the releases its gates already allow, and the Environment gate of the first tier's wave-1 leader allows every release unless `lockstep` holds it, so new builds still reach that leader. Promotion pauses: the controller can neither record new bakes nor read upstream ones, so the gates of later tiers and waves keep their last allowed versions. When GitHub is back, the controller records the deploys still in each Rollout's history, and promotion resumes.

A `ReleaseSource` reads tags from your registry, not from GitHub. If that registry is `ghcr.io` and it is down as well, new releases arrive once it is back; a deploy whose artifact Flux cannot pull meanwhile waits in `Deploying` and fails when its `deployTimeout` runs out, if it has one.

## Related

{{< next "/docs/concepts/architecture/" "/docs/getting-started/" "/docs/releases/publish/" >}}
