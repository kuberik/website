---
title: "Promote Across Environments"
description: "Deploy to production only after staging has shipped the same release."
type_: guide
weight: 20
aliases: ["/docs/guides/cross-environment-rollout/"]
---

Production deploys only the releases staging has already deployed and baked, with no pipeline between the clusters. Each cluster runs its own [Rollout](/docs/concepts/rollouts/) and [Environment](/docs/concepts/environments/), and GitHub deployments carry the result from one to the next.

Works with environment-controller newer than v0.2.0-rc.0, a GitHub token Secret in each app namespace (see [GitHub](/docs/integrations/github/)), and Rollouts that take their releases from a [ReleaseSource](/docs/releases/publish/).

## Create the staging Environment

Staging is the first tier this app uses, so its gate does not restrict releases. Apply this in the staging cluster, next to the `hello-world` Rollout:

```yaml {filename="staging.yaml"}
apiVersion: environments.kuberik.com/v1alpha1
kind: Environment
metadata:
  name: hello-world-staging
  namespace: hello-world
spec:
  rolloutRef:
    name: hello-world
  name: hello-world        # the same name in every cluster
  environment: staging
  backend:
    type: github
    project: acme/hello-world
```

```bash {filename="Terminal"}
kubectl apply -f staging.yaml
```

The controller creates a [RolloutGate](/docs/concepts/gates/) for the Rollout and records each deploy as a GitHub deployment in the environment `kuberik/hello-world/staging`. The token comes from the Secret `github-token` in the `hello-world` namespace, the default when `backend.secret` is not set.

## Create the production Environment

Production comes after staging in the tier order, so its gate allows only the releases staging baked successfully. Apply this in the production cluster:

```yaml {filename="production.yaml"}
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
  backend:
    type: github
    project: acme/hello-world
```

```bash {filename="Terminal"}
kubectl apply -f production.yaml
```

When staging finishes the bake of `1.4.0`, the production gate adds `1.4.0` to its `allowedVersions` and the production Rollout deploys it as soon as its other gates allow. A failed bake in staging never reaches production, with one exception. Gates never hold a Rollout's first deploy: it deploys the newest release the gates allow, or the newest release if they allow none. The Environment creates its gate only after the Rollout exists, and the gate allows every release until the Environment has read staging, so a new Rollout's first deploy can take a release staging never baked. Create a new Rollout with `spec.wantedVersion` set to a release staging baked, and remove the pin after that deploy. The order comes from the tier names alone: there is nothing to configure between the two objects.

## Roll production out in waves

Give each production cluster a site, and put the clusters that should go later into a later wave. This Environment, in a second production cluster, starts a release only after the wave-1 site `eu-west-1` baked it:

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
  wave: 2                  # starts after every wave-1 site baked the release
  backend:
    type: github
    project: acme/hello-world
```

Set `site: eu-west-1` (and the default `wave: 1`) on the first production cluster's Environment. Changing the site of an existing Environment deregisters its old site in GitHub and registers the new one. To keep production on one release until every wave has it, set `lockstep: true` on every production Environment, in every wave. A site that differs from the wave-1 leader puts `LockstepConsistent=False`, reason `LockstepMismatch`, on every production Environment.

## Check the result

Read the Environment's conditions in the production cluster:

```bash {filename="Terminal"}
kubectl get environment hello-world-production -n hello-world \
  -o jsonpath='{range .status.conditions[*]}{.type}={.status} {.reason}: {.message}{"\n"}{end}'
```

```text {filename="Output"}
WaveReady=True Ready: site may deploy the allowed versions
LockstepConsistent=True Consistent: all members agree on lockstep
```

Then list the releases the gate allows, newest first:

```bash {filename="Terminal"}
kubectl get rolloutgate -n hello-world \
  -o jsonpath='{range .items[*]}{.metadata.name}: {.spec.allowedVersions}{"\n"}{end}'
```

The gate whose name starts with `ghd-` belongs to the Environment. In GitHub, the repository's **Environments** page lists `kuberik/hello-world/staging` and `kuberik/hello-world/production` with every deploy and its bake result. The dashboard shows the same order on the app page.

![The Builds card of hello-world-app: development and staging are healthy on the newest build, 3ea2311; production runs 22d69ba, where eu-west is checking, us-east waits for eu-west and ap-south waits for both](/images/docs/releases/promote-builds.png)

## Troubleshoot

Each Environment explains what holds it in its `WaveReady` and `LockstepConsistent` conditions.

```bash {filename="Terminal"}
kubectl get environment hello-world-production -n hello-world \
  -o jsonpath='{range .status.conditions[*]}{.type}{"\t"}{.status}{"\t"}{.reason}{"\t"}{.message}{"\n"}{end}'
```

| Symptom | Cause | Fix |
|---|---|---|
| `WaveReady=False`, reason `WaitingFor` | Staging (or an earlier wave) has not baked the release yet, or its bake failed. The message names the site. | Wait for the bake, or fix the failure in staging. |
| `WaveReady=False`, reason `WaitingForCandidate` | The revision staging deployed has no release tag in the production Rollout's ReleaseSource. | Check that both clusters read the same releases. |
| `WaveReady=False`, reason `InvalidTopology` or `UnknownTier` | Two names of one tier are in use (`staging` and `preprod`), the tier is not known, or the waves have a gap. | Use one tier name, and number waves from 1 without gaps. |
| `WaveReady=False`, reason `Pinned` | `spec.wantedVersion` on the Rollout differs from the build the wave selected. | Remove the pin from the Rollout. |
| `WaveReady=False`, reason `LockstepWaiting`; `LockstepConsistent=False`, reason `LockstepMismatch` | A lockstep wave waits until every site baked the release, or the sites disagree on `lockstep`. | Wait, or set the same `lockstep` on every site. |
| `WaveReady=False`, reason `CandidatesUnresolved` | The [ReleaseSlice](/docs/reference/api/#releaseslice) CRD is not served, so revisions cannot be mapped to tags. | Install the release-controller. |
| `WaveReady=False`, reason `DuplicateSite` | Another Environment already owns this site of the tier. | Give each cluster its own `site`, or take the site over (below). |
| Production deploys releases staging never ran | No staging site is registered for this `name`, so production has no upstream. | Check that both Environments use the same `name` and `backend.project`. |
| A new production Rollout deploys a release staging never baked | Gates never hold a first deploy, and the Environment's gate allows every release until the Environment has read staging. | Create the Rollout with `spec.wantedVersion` set to a release staging baked; remove the pin after that deploy. |

{{< callout type="warning" >}}
Taking a site over deregisters the Environment that owns it, in another cluster. Do it only when that owner is gone or replaced.
{{< /callout >}}

```bash {filename="Terminal"}
kubectl annotate environment hello-world-production -n hello-world environments.kuberik.com/take-over-site=true --overwrite
```

## Next steps

{{< next "/docs/gates/schedules/" "/docs/concepts/environments/" "/docs/integrations/github/" >}}
