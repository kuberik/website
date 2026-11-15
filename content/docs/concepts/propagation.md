---
title: "Propagation Modes"
description: "Move an image tag or rendered manifests through your environments."
type_: concept
weight: 40
---

A [Rollout](/docs/concepts/rollouts/) decides which version runs in an environment, and that version can point at your app's image tag or at the rendered manifests for that environment. Kuberik supports both, and the difference is one annotation.

| | Image tag | Rendered manifests |
|---|---|---|
| Kuberik watches | A [`ReleaseSource`](/docs/releases/publish/) over your app image | A `ReleaseSource` over your manifest artifact |
| Kuberik writes | `postBuild.substitute` on a `Kustomization` | `spec.ref.tag` on an `OCIRepository` |
| Annotation | `rollout.kuberik.com/substitute.<VAR>.from` | `rollout.kuberik.com/rollout` |
| Flux source | Any source of the `Kustomization`, usually a `GitRepository` | `OCIRepository` |
| A release changes | One variable | Everything in the artifact |

Gates, health checks, bake time and cross-environment promotion work the same way in both modes.

## Image tag

Your manifests live in git. Kuberik selects a version and writes it into the Kustomization's substitution variables; Flux renders the overlay and applies it.

![The Resources card of a production rollout: the objects Flux applied for it, here the hello-world Deployment and its canary Rollout, both ready](/images/docs/concepts/propagation-resources.png)

```yaml {filename="kustomization.yaml"}
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: hello-world
  namespace: hello-world
  annotations:
    rollout.kuberik.com/substitute.APP_VERSION.from: "hello-world"
spec:
  interval: 10m
  path: ./deploy/production
  prune: true
  sourceRef:
    kind: GitRepository
    name: hello-world
  postBuild:
    substitute:
      APP_VERSION: "1.0.0"  # default, Kuberik overwrites it
```

A rollout in this mode changes exactly one thing: the image tag. Config changes reach the cluster through a separate path, whenever the Kustomization next reconciles git. That keeps each rollout narrow, and it means deploying an older build by hand restores the image, not the configuration that shipped with it.

Reach for this when your deployments are a single service whose changes are almost always "new build of the same code", and when you want the smallest possible setup.

{{< callout type="info" >}}
**One Kustomization, several Rollouts**

Declare one annotation per substitution variable. A frontend and a backend managed by independent Rollouts can drive the same Kustomization.
{{< /callout >}}

## Rendered manifests

Your CI renders the manifests for an environment (`kustomize build`, `helm template`, `cdk8s synth`, whatever you already run) and pushes the result as an OCI artifact to a path scoped to that environment. Kuberik owns the tag on the matching OCIRepository.

On a rendered-manifests rollout, **View source** in the rollout header shows the files of the artifact that is deployed, one tab per file:

![The View source dialog of a rendered-manifests rollout in production: Source files for checkout-edge at artifact tag vd09e6f4, one tab per rendered file (deployment.yaml, configmap.yaml), and the Deployment exactly as it was applied](/images/docs/concepts/overview-manifests.png)

```yaml {filename="ocirepository.yaml"}
apiVersion: source.toolkit.fluxcd.io/v1
kind: OCIRepository
metadata:
  name: hello-world
  namespace: hello-world
  annotations:
    rollout.kuberik.com/rollout: "hello-world"
spec:
  interval: 60s
  url: oci://ghcr.io/acme/hello-world/production/manifests
```

```yaml {filename="kustomization.yaml"}
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: hello-world
  namespace: hello-world
spec:
  interval: 10m
  prune: true
  sourceRef:
    kind: OCIRepository
    name: hello-world
```

A release in this mode is a tag bump on one OCIRepository. A promotion is the same tag bump on the next environment's OCIRepository. Pinning an older build in production moves that one tag back and leaves staging where it is. Because the artifact carries the whole desired state, a config change is a release: it goes through the same gates, health checks and bake time as a code change, and a failed bake holds further deploys the same way.

This does not replace committing rendered manifests to git. You can do both from the same render: people review the commit in a pull request, and the cluster pulls the artifact built from it.

Reach for this when config changes are as risky as code changes, when you want promotion to move the same tag, rendered from one commit, from one environment to the next, or when the cluster should not need source access or build tooling to produce its own desired state.

{{< callout type="info" >}}
**Same namespace**

Kuberik resolves the ReleaseSource, Kustomization, and OCIRepository in the Rollout's own namespace. Resources in other namespaces are ignored.
{{< /callout >}}

## Run both

The two modes are not exclusive. A common setup gives one service two Rollouts: one over the manifest artifact, one over the application image.

{{< fig id="propagation" caption="Two Rollouts on one service: one moves the manifests tag, the other sets the app version." >}}

The manifests Rollout gates changes to the workload's configuration, and the app Rollout gates new builds of the code. Each has its own schedule, approvals and health checks, so you can deploy code automatically all day and hold configuration changes for a maintenance window.

## Related

{{< next "/docs/getting-started/" "/docs/integrations/fluxcd/" "/docs/releases/publish/" >}}
