---
title: "Promote Across Environments"
description: "Deploy to production only after staging has shipped the same release."
type_: guide
keywords: ["single cluster#run-both-tiers-on-one-cluster", "one cluster#run-both-tiers-on-one-cluster"]
weight: 20
aliases: ["/docs/guides/cross-environment-rollout/"]
---

Production deploys only releases staging has deployed and baked, with no pipeline between the clusters. Each cluster runs its own [Rollout](/docs/concepts/rollouts/) and [Environment](/docs/concepts/environments/), and GitHub deployments carry the result from one to the next.

{{< fig id="promote-waves" caption="A release reaches production wave 1 only after staging baked it, and wave 2 only after every wave-1 site baked it." >}}

Works with the environment-controller, a GitHub token Secret in each app namespace (see [GitHub](/docs/integrations/github/)), and Rollouts fed by a [ReleaseSource](/docs/releases/publish/).

## Run both tiers on one cluster

Give each tier its own namespace, holding every object from [Deploy Your First App](/docs/getting-started/) and a `github-token` Secret:

```bash {filename="Terminal"}
kubectl create namespace hello-world-staging
kubectl create namespace hello-world-production
```

Give each tier its own overlay (`deploy/staging`) and its namespace as the Kustomization's `targetNamespace`, or the tiers overwrite one Deployment. Use the tier's namespace for every `namespace:` and `-n` below.

## Create the staging Environment

Staging is this app's first tier, so its gate allows every release. Apply this in the staging cluster, next to the `hello-world` Rollout:

```yaml {filename="staging.yaml"}
apiVersion: environments.kuberik.com/v1alpha1
kind: Environment
metadata:
  name: hello-world-staging
  namespace: hello-world  # hello-world-staging on one cluster
spec:
  rolloutRef:
    name: hello-world
  name: hello-world        # same in every tier
  environment: staging
  backend:
    type: github
    project: acme/hello-world
```

```bash {filename="Terminal"}
kubectl apply -f staging.yaml
```

Give the Environment of every tier the same `spec.name`: production finds staging's deploys in GitHub by that name.

The controller creates a [RolloutGate](/docs/concepts/gates/) for the Rollout and records each deploy as a GitHub deployment in the environment `kuberik/hello-world/staging`.

## Create the production Environment

Production follows staging, so its gate allows only releases staging baked. Apply this in the production cluster:

```yaml {filename="production.yaml"}
apiVersion: environments.kuberik.com/v1alpha1
kind: Environment
metadata:
  name: hello-world-production
  namespace: hello-world  # hello-world-production on one cluster
spec:
  rolloutRef:
    name: hello-world
  name: hello-world        # same in every tier
  environment: production
  backend:
    type: github
    project: acme/hello-world
```

```bash {filename="Terminal"}
kubectl apply -f production.yaml
```

When staging bakes `1.4.0`, the production gate adds it to `allowedVersions`, and production deploys it once its other gates allow.

A brand-new Rollout is the exception: gates never hold its first deploy, and the Environment's gate allows every release until it has read staging. To start production on a release staging baked, create its Rollout with `spec.wantedVersion` set to that release, and remove the pin after the first deploy.

## Roll production out in waves

Give each production cluster a site, and put later clusters in a later wave. This Environment, in a second production cluster, starts a release only after the wave-1 site `eu-west-1` baked it:

```yaml {filename="production-us-east-1.yaml"}
apiVersion: environments.kuberik.com/v1alpha1
kind: Environment
metadata:
  name: hello-world-production
  namespace: hello-world
spec:
  rolloutRef:
    name: hello-world
  name: hello-world
  environment: production
  site: us-east-1
  wave: 2                  # after wave 1 bakes
  backend:
    type: github
    project: acme/hello-world
```

Set `site: eu-west-1` (and the default `wave: 1`) on the first production cluster's Environment. To keep production on one release until every wave has it, set `lockstep: true` on every production Environment.

## Check the result

Read the production Environment's conditions:

```bash {filename="Terminal"}
kubectl get environment hello-world-production -n hello-world \
  -o jsonpath='{range .status.conditions[*]}{.type}={.status} {.reason}: {.message}{"\n"}{end}'
```

```text {filename="Output"}
WaveReady=True Ready: site may deploy the allowed versions
LockstepConsistent=True Consistent: all members agree on lockstep
```

List the releases the gate allows, newest first:

```bash {filename="Terminal"}
kubectl get rolloutgate -n hello-world \
  -o jsonpath='{range .items[*]}{.metadata.name}: {.spec.allowedVersions}{"\n"}{end}'
```

The gate whose name starts with `ghd-` belongs to the Environment. The dashboard's app page shows each tier's build:

![The Builds card of invoice-worker: staging and production both run 2.2.0-30 and hold the newer 2.3.0-31](/images/docs/releases/promote-builds.png)

## Troubleshoot

| Symptom | Cause | Fix |
|---|---|---|
| `WaveReady=False`, reason `WaitingFor` | An earlier tier or wave has not baked the release, or its bake failed; the message names the site. | Wait for the bake, or fix staging's failure. |
| `WaveReady=False`, reason `WaitingForCandidate` | The revision staging deployed has no release tag in the production Rollout's ReleaseSource. | Check that both clusters read the same releases. |
| `WaveReady=False`, reason `InvalidTopology` or `UnknownTier` | Two names of one tier are in use (`staging` and `preprod`), the tier is not known, or the waves have a gap. | Use one tier name, and number waves from 1 without gaps. |
| `WaveReady=False`, reason `Pinned` | `spec.wantedVersion` on the Rollout differs from the build the wave selected. | Remove the pin. |
| `WaveReady=False`, reason `LockstepWaiting` | A lockstep wave waits until every site has baked the selected release. The message names the site. | Wait for that site's bake. |
| `LockstepConsistent=False`, reason `LockstepMismatch` | A site's `lockstep` differs from the wave-1 leader's; it holds nothing. | Set the same `lockstep` on every site. |
| `WaveReady=False`, reason `CandidatesUnresolved` | The [ReleaseSlice](/docs/reference/api/#releaseslice) CRD is not served, so revisions cannot be mapped to tags. | Install the release-controller. |
| `WaveReady=False`, reason `DuplicateSite` | Another Environment owns this site of the tier. | Give each cluster its own `site`, or take the site over (below). |
| Staging baked, but production's gate does not list the release and its conditions do not change | The GitHub token's rate limit is spent: the environment-controller logs `API rate limit exceeded` and keeps its last conditions and `allowedVersions`. | Wait for the reset, or [reconcile less often](/docs/operate/troubleshooting/#promotion-stalls-and-the-log-reads-api-rate-limit-exceeded). |
| Production deploys releases staging never ran | No staging site is registered for this `name`, so production has no upstream; or the Rollout is new, and gates never hold a first deploy. | Use the same `name` and `backend.project` in both; pin a new Rollout's first release (above). |

{{< callout type="warning" >}}
Taking a site over deregisters the Environment that owns it, in another cluster. Do it only when that owner is gone or replaced.
{{< /callout >}}

```bash {filename="Terminal"}
kubectl annotate environment hello-world-production -n hello-world environments.kuberik.com/take-over-site=true --overwrite
```

## Next steps

{{< next "/docs/gates/schedules/" "/docs/concepts/environments/" "/docs/integrations/github/" >}}
