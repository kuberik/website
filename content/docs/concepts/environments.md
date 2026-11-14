---
title: "Environments"
description: "How Environments order tiers, sites and waves and report deployments to GitHub."
type_: concept
weight: 30
---

An Environment puts a [Rollout](/docs/concepts/rollouts/) into a tier, such as staging or production, and lets it deploy only the releases the earlier tier has already deployed and baked. Clusters coordinate through GitHub deployments, so they never connect to each other.

## The Environment resource

Each cluster that runs the app has one Environment next to its Rollout. This one places the `hello-world` Rollout in production:

```yaml {filename="environment.yaml"}
apiVersion: environments.kuberik.com/v1alpha1
kind: Environment
metadata:
  name: hello-world-production
  namespace: hello-world
spec:
  rolloutRef:
    name: hello-world
  name: hello-world            # same on every Environment of this app
  environment: production      # the tier
  backend:
    type: github
    project: acme/hello-world
    secret: github-token       # the default when left out
```

| Field | What it does |
|---|---|
| `rolloutRef` | The Rollout in the same namespace that this Environment gates and reports. |
| `name` | The app's name in GitHub. Every Environment of one app uses the same `name`; Kuberik adds a `kuberik/` prefix. |
| `environment` | The tier. It decides which environment this one waits for. |
| `backend` | The GitHub repository (`owner/repo`) and the Secret that holds the token. `github` is the only backend. |
| `site`, `wave`, `lockstep` | Optional. Split one environment across clusters, see [Sites and waves](#sites-and-waves). |

{{< callout type="important" >}}
Tiers, sites and waves need environment-controller after v0.1.5. In v0.1.5 the order came from `spec.relationship`, which later versions accept and ignore (the Environment reports `Deprecated`, reason `RelationshipIgnored`).
{{< /callout >}}

## How tiers set the order

Tiers have a fixed order. `spec.environment` must be one of these names, and names in one row are the same tier:

| Order | Accepted names |
|---|---|
| 1 | `dev`, `development` |
| 2 | `test`, `qa` |
| 3 | `staging`, `stage`, `preprod` |
| 4 | `prod`, `production` |

An Environment waits for its upstream: the nearest earlier tier that has a registered site in GitHub for the same `name`. Tiers nobody uses are skipped, so production waits for staging when there is no test tier, and the first tier has no upstream. Because the upstream is read from GitHub, it can run in another cluster or another cloud.

Use one name per tier. If an app registers both `staging` and `preprod`, every Environment that sees both stops with `InvalidTopology`. To split a tier into stages, use sites and waves.

## How a release is admitted

The controller creates a [RolloutGate](/docs/reference/api/) named `ghd-<random>` for the Rollout, owned by the Environment, and keeps its `allowedVersions` up to date:

- With no upstream, the gate does not restrict versions.
- With an upstream, the gate allows the releases that every registered site of the upstream's last wave baked successfully.
- When nothing qualifies, the gate allows nothing (`allowedVersions: []`) and the Rollout stays on its current release.

GitHub records Git revisions, and the gate lists release tags. The controller maps one to the other through the release catalogue of the Rollout's [ReleaseSource](/docs/releases/publish/), so the Rollout must take its releases from a ReleaseSource, and each release must carry the commit it was built from. A revision with no matching tag is left out.

Pinning the Rollout (`spec.wantedVersion`) overrides the wave's choice and the Environment reports `Pinned`. Deleting the Environment deletes its gate, which leaves the Rollout ungated: pin the Rollout first if it must not move.

## Sites and waves

One environment can run in several clusters. Each cluster's Environment is a site, named by `spec.site` (for example `eu-west-1`). Without `spec.site`, the controller uses its default site: the `site` key of the `kuberik-cluster-info` ConfigMap in the controller's namespace, else `default`.

Sites roll out in waves. `spec.wave` defaults to 1, and wave N starts a release only after every site of wave N-1 baked it. In each wave the site whose name sorts first is the leader: it picks the release, and the other sites (followers) deploy exactly that pick. The next tier waits for the last wave.

With `lockstep: true` on the wave-1 leader, the leader picks no new release until every wave of the environment has baked the current one. A site that disagrees with the leader reports `LockstepConsistent=False`.

Only one Environment, across all clusters, can own a site of a tier for one `name`. A second one posts nothing, closes its gate and reports `DuplicateSite`.

## How Environments use GitHub

For every entry in the Rollout's history the controller creates a GitHub deployment on the release's commit, in the GitHub environment `kuberik/<name>/<environment>`, and updates its status as the bake goes on:

| Bake | GitHub status |
|---|---|
| Deploying, baking | `in_progress` |
| Succeeded | `success` |
| Failed | `failure` |
| Cancelled | `inactive` |

The deployment payload carries the site, wave and owner, which is how the other clusters see this one. The repository's **Environments** page in GitHub shows the same history, and the dashboard's Environments page shows where each release stands.

![The Environments page: every environment with what is running, what is held and which environment has to deploy first](/screenshots/dashboard/environments.png)

## Conditions

The controller reports the gate decision as conditions on the Environment, with the same facts in structured form under `status.wave`:

| Condition | Reason | Meaning |
|---|---|---|
| `WaveReady=True` | `Ready` | The site may deploy the allowed releases. |
| `WaveReady=False` | `WaitingFor` | A named site has not picked or baked the release yet, or its bake failed. |
| `WaveReady=False` | `WaitingForCandidate`, `CandidatesUnresolved` | The revision has no release tag, or the release catalogue cannot be read. |
| `WaveReady=False` | `Pinned`, `LockstepWaiting` | The Rollout is pinned, or lockstep holds the leader. |
| `WaveReady=False` | `DuplicateSite`, `InvalidTopology`, `UnknownTier` | The setup is wrong; the gate allows nothing. |
| `Deprecated=True` | `RelationshipIgnored` | `spec.relationship` is set and ignored. |

## When a site leaves

Every Environment carries the finalizer `environments.kuberik.com/deregister`. Deleting the Environment, or changing its `site`, `environment` or `name`, posts an `inactive` status that deregisters the old site, so it no longer holds back the next wave or tier.

Two annotations cover a cluster that cannot deregister itself. `environments.kuberik.com/skip-deregister: "true"` removes the finalizer without calling GitHub, for example when the token was revoked. `environments.kuberik.com/take-over-site: "true"` on a new Environment deregisters the old owner of its site and takes the site over; remove it once the new Environment owns the site.

## Related

- [Promote Across Environments](/docs/releases/promote/)
- [GitHub](/docs/integrations/github/)
- [Rollouts](/docs/concepts/rollouts/)
