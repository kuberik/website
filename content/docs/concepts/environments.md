---
title: "Environments"
description: "How Environments order tiers, sites and waves and report deployments to GitHub."
type_: concept
weight: 30
---

An [Environment](/docs/reference/api/#environment) puts a [Rollout](/docs/concepts/rollouts/) into a tier, such as staging or production, and lets it deploy only the releases the earlier tier has already deployed and baked. Clusters coordinate through GitHub deployments, so they never connect to each other.

{{< fig id="env-tiers-github" caption="Two clusters never connect: the staging Environment reports to GitHub, and the production Environment lets through only what baked upstream." >}}

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
  name: hello-world            # same on every Environment
  environment: production
  backend:
    type: github
    project: acme/hello-world
    secret: github-token       # the default
```

| Field | What it does |
|---|---|
| `rolloutRef` | The Rollout in the same namespace that this Environment gates and reports. |
| `name` | The app's name in GitHub. Every Environment of one app uses the same `name`; Kuberik adds a `kuberik/` prefix. |
| `environment` | The tier. It decides which environment this one waits for. |
| `backend` | The GitHub repository (`owner/repo`) and the Secret that holds the token. `github` is the only backend. |
| `site`, `wave`, `lockstep` | Optional. Split one environment across clusters, see [Sites and waves](#sites-and-waves). |

{{< callout type="important" >}}
Tiers, sites and waves need environment-controller newer than v0.2.0-rc.0. Up to v0.2.0-rc.0 the order came from `spec.relationship`, which later versions accept and ignore (the Environment reports `Deprecated`, reason `RelationshipIgnored`).
{{< /callout >}}

## How tiers set the order

Tiers have a fixed order. `spec.environment` must be one of these names, and names in one row are the same tier:

| Order | Accepted names |
|---|---|
| 1 | `dev`, `development` |
| 2 | `test`, `qa` |
| 3 | `staging`, `stage`, `preprod` |
| 4 | `prod`, `production` |

An Environment waits for its upstream: the nearest earlier tier that has a registered site in GitHub for the same `name`. Tiers nobody uses are skipped, and the first tier has no upstream. The upstream is read from GitHub, so it can run in another cluster or cloud.

Use one name per tier. If an app registers both `staging` and `preprod`, every Environment that sees both stops with `InvalidTopology`. To split a tier into stages, use sites and waves.

## How a release is admitted

The controller creates a [RolloutGate](/docs/concepts/gates/) named `ghd-<random>` for the Rollout, owned by the Environment, and keeps its `allowedVersions` up to date:

- With no upstream, the gate does not restrict versions.
- With an upstream, the gate allows the releases that every registered site of the upstream's last wave baked successfully.
- When nothing qualifies, the gate allows nothing (`allowedVersions: []`) and the Rollout stays on its current release.

Gates never hold a Rollout's first deploy, and a new gate allows every release until the Environment has read the upstream tier. A new Rollout can therefore first deploy a release the upstream never baked: create it with `spec.wantedVersion` set to a baked release, and remove the pin after that deploy.

GitHub records Git revisions, and the gate lists release tags. The controller maps them through the release catalogue of the Rollout's [ReleaseSource](/docs/releases/publish/), so each release must carry the commit it was built from. A revision with no matching tag is left out.

A pin on the Rollout (`spec.wantedVersion`) is a manual deploy that skips the gate. On a wave leader, the pinned release becomes the wave's pick and the followers deploy it. On a follower, a pin that differs from the wave's pick makes the Environment report `Pinned`. Deleting the Environment deletes its gate, which leaves the Rollout ungated: pin the Rollout first if it must not move.

## Sites and waves

One environment can run in several clusters. Each cluster's Environment is a site, named by `spec.site` (for example `eu-west-1`). Without `spec.site`, the controller uses its default site: the `site` key of the `kuberik-cluster-info` ConfigMap in the controller's namespace, else `default`.

Sites roll out in waves. `spec.wave` defaults to 1, and wave N starts a release only after every site of wave N-1 baked it. Number waves from 1 without gaps: a missing wave closes the gates of every site in that environment and sets `WaveReady=False`, reason `InvalidTopology`.

In each wave the registered site whose name sorts first is the leader: it picks the release, and the other sites (followers) deploy exactly that pick. A leader keeps the role until every site of the wave has baked its pick, so a late site does not take over. The next tier waits for the last wave.

With `lockstep: true`, the wave-1 leader picks no new release until every wave of the environment has baked the current one. Set it the same on every site of the environment: the wave-1 leader's value governs, and a site that differs puts `LockstepConsistent=False`, reason `LockstepMismatch`, on every Environment of the tier, with the differing sites named in the message.

Only one Environment, across all clusters, can own a site of a tier for one `name`. A second one posts nothing, closes its gate and reports `DuplicateSite`.

## How Environments use GitHub

For every entry in the Rollout's history the controller creates a GitHub deployment on the release's commit, in the GitHub environment `kuberik/<name>/<environment>`, and updates its status as the bake goes on:

| Bake | GitHub status |
|---|---|
| Deploying, baking | `in_progress` |
| Succeeded | `success` |
| Failed | `failure` |
| Cancelled | `inactive` |

The deployment payload carries the site, wave and owner, which is how the other clusters see this one. The dashboard's Environments page shows where each release stands.

![The Production environment on the Environments page: 13 places across 7 apps, one checking; eu-west has a build waiting, and two regions wait for eu-west and us-east](/images/docs/concepts/environments.png)

## Conditions

The controller reports the gate decision as conditions on the Environment, with the same facts in structured form under `status.wave`:

| Condition | Reason | Meaning |
|---|---|---|
| `WaveReady=True` | `Ready` | The site may deploy the allowed releases. |
| `WaveReady=False` | `WaitingFor` | A named site has not picked or baked the release yet, or its bake failed. |
| `WaveReady=False` | `WaitingForCandidate`, `CandidatesUnresolved` | The revision has no release tag, or the release catalogue cannot be read. |
| `WaveReady=False` | `Pinned`, `LockstepWaiting` | A follower's Rollout is pinned to another release than the wave's pick, or lockstep holds the leader. |
| `WaveReady=False` | `DuplicateSite`, `InvalidTopology`, `UnknownTier` | The setup is wrong; the gate allows nothing. |
| `LockstepConsistent=False` | `LockstepMismatch` | A site's `lockstep` differs from the wave-1 leader's. Informational: the gate is unchanged. |
| `Deprecated=True` | `RelationshipIgnored` | `spec.relationship` is set and ignored. |

## When a site leaves

Every Environment carries the finalizer `environments.kuberik.com/deregister`. Deleting the Environment, or changing its `site`, `environment` or `name`, posts an `inactive` status that deregisters the old site, so it no longer holds back the next wave or tier.

Two annotations cover a cluster that cannot deregister itself. `environments.kuberik.com/skip-deregister: "true"` removes the finalizer without calling GitHub, for example when the token was revoked. `environments.kuberik.com/take-over-site: "true"` on a new Environment deregisters its site's old owner and takes the site over; remove it afterwards.

## Related

{{< next "/docs/releases/promote/" "/docs/integrations/github/" "/docs/concepts/rollouts/" >}}
