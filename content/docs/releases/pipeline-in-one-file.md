---
title: "Define the Pipeline Once"
description: "Write an app's Kuberik objects once in a kustomize component, and give each environment an overlay that sets only what differs."
type_: guide
keywords: ["template", "templating", "one file", "dry"]
weight: 25
---

Write an app's Kuberik objects once, in a kustomize component, and every environment gets the same pipeline. Each environment's overlay sets only what differs: its tier, its artifact and its gates.

Works with the setup in [Promote Across Environments](/docs/releases/promote/): one cluster per environment, a `hello-world` namespace with a [`github-token` Secret](/docs/integrations/github/#store-the-token) in each, and CI that [publishes rendered manifests](/docs/releases/publish/#publish-rendered-manifests) for `deploy/development`, `deploy/staging` and `deploy/production`.

## Lay out the files

Keep the Kuberik objects in their own directory, outside `deploy/`, so CI does not render them as an environment:

```text {filename="acme/hello-world"}
deploy/
  development/
  staging/
  production/
kuberik/
  pipeline/
    kustomization.yaml
    pipeline.yaml
  development/
    kustomization.yaml
  staging/
    kustomization.yaml
  production/
    kustomization.yaml
```

## Write the shared objects

The component lists the objects every environment runs:

```yaml {filename="kuberik/pipeline/kustomization.yaml"}
apiVersion: kustomize.config.k8s.io/v1alpha1
kind: Component
resources:
  - pipeline.yaml
```

These are the [ReleaseSource](/docs/releases/publish/), [HealthCheck](/docs/gates/health-checks/), [Rollout](/docs/concepts/rollouts/) and Flux objects from [Deploy Your First App](/docs/getting-started/), plus the tier's [Environment](/docs/concepts/environments/) and an [`ApprovalPolicy`](/docs/gates/approvals/) that matches only Rollouts labelled for approval. The values marked for overlays hold development's settings until an overlay replaces them.

```yaml {filename="kuberik/pipeline/pipeline.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: ReleaseSource
metadata:
  name: hello-world
  namespace: hello-world
spec:
  oci:
    # each overlay sets this
    image: ghcr.io/acme/hello-world/development/manifests
    filterTags:
      pattern: '^main-[a-f0-9]+-(?P<ts>[0-9]+)$'
      extract: '$ts'
    policy:
      numerical:
        order: asc
---
apiVersion: kuberik.com/v1alpha1
kind: HealthCheck
metadata:
  name: hello-world
  namespace: hello-world
  labels:
    app: hello-world
  annotations:
    healthcheck.kuberik.com/kustomization: "hello-world"
spec:
  class: kustomization
---
apiVersion: kuberik.com/v1alpha1
kind: Rollout
metadata:
  name: hello-world
  namespace: hello-world
spec:
  releaseSourceRef:
    name: hello-world
  bakeTime: 5m
  deployTimeout: 10m
  healthCheckSelector:
    selector:
      matchLabels:
        app: hello-world
---
apiVersion: kuberik.com/v1alpha1
kind: ApprovalPolicy
metadata:
  name: hello-world
  namespace: hello-world
spec:
  rolloutSelector:
    matchLabels:
      approval.kuberik.com/required: "true"  # no Rollout carries it yet
---
apiVersion: environments.kuberik.com/v1alpha1
kind: Environment
metadata:
  name: hello-world-development
  namespace: hello-world
spec:
  rolloutRef:
    name: hello-world
  name: hello-world
  environment: development  # each overlay sets this
  backend:
    type: github
    project: acme/hello-world
---
apiVersion: source.toolkit.fluxcd.io/v1
kind: OCIRepository
metadata:
  name: hello-world
  namespace: hello-world
  annotations:
    rollout.kuberik.com/rollout: "hello-world"
spec:
  interval: 1m
  # each overlay sets this
  url: oci://ghcr.io/acme/hello-world/development/manifests
---
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
  targetNamespace: hello-world
```

Every environment shares the Rollout's deploy timeout and health check, and the Environment's `name` and `backend`. Production finds staging's deploys in GitHub through that shared `name`. Each environment starts from the Rollout's bake time unless its overlay changes it.

## Set what each environment changes

An overlay includes the component and patches the tier: the Environment's name and `environment`, and the artifact path in the ReleaseSource and the OCIRepository.

```yaml {filename="kuberik/staging/kustomization.yaml"}
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
components:
  - ../pipeline
patches:
  - target:
      kind: Environment
    patch: |-
      - op: replace
        path: /metadata/name
        value: hello-world-staging
      - op: replace
        path: /spec/environment
        value: staging
  - target:
      kind: ReleaseSource
    patch: |-
      - op: replace
        path: /spec/oci/image
        value: ghcr.io/acme/hello-world/staging/manifests
  - target:
      kind: OCIRepository
    patch: |-
      - op: replace
        path: /spec/url
        value: oci://ghcr.io/acme/hello-world/staging/manifests
```

The development overlay is the same with `development` in place of `staging`. Production also sets a longer bake time, and adds the label that turns on the approval policy, so each new build waits for a person.

```yaml {filename="kuberik/production/kustomization.yaml"}
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
components:
  - ../pipeline
patches:
  - target:
      kind: Environment
    patch: |-
      - op: replace
        path: /metadata/name
        value: hello-world-production
      - op: replace
        path: /spec/environment
        value: production
  - target:
      kind: ReleaseSource
    patch: |-
      - op: replace
        path: /spec/oci/image
        value: ghcr.io/acme/hello-world/production/manifests
  - target:
      kind: OCIRepository
    patch: |-
      - op: replace
        path: /spec/url
        value: oci://ghcr.io/acme/hello-world/production/manifests
  - target:
      kind: Rollout
    patch: |-
      - op: replace
        path: /spec/bakeTime
        value: 30m
      - op: add
        path: /metadata/labels
        value:
          approval.kuberik.com/required: "true"
```

To run every tier on one cluster instead, create each tier's namespace with its own `github-token` Secret ([Run both tiers on one cluster](/docs/releases/promote/#run-both-tiers-on-one-cluster)), add `namespace: hello-world-staging` (and so on) to each overlay, and patch the Kustomization's `targetNamespace` to the same namespace.

## Apply an overlay

In each cluster, apply the overlay of its environment; on one cluster, apply all three there. Start with development and staging, so production has a [tier to follow](/docs/concepts/environments/#how-tiers-set-the-order):

```bash {filename="Terminal"}
kubectl apply -k kuberik/staging
```

Gates never hold a new Rollout's first deploy. To start production on a release staging baked, add `spec.wantedVersion` to the production overlay's Rollout patch before its first apply (pin staging the same way if it must start on a release development baked):

```yaml {filename="kuberik/production/kustomization.yaml"}
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
components:
  - ../pipeline
patches:
  - target:
      kind: Environment
    patch: |-
      - op: replace
        path: /metadata/name
        value: hello-world-production
      - op: replace
        path: /spec/environment
        value: production
  - target:
      kind: ReleaseSource
    patch: |-
      - op: replace
        path: /spec/oci/image
        value: ghcr.io/acme/hello-world/production/manifests
  - target:
      kind: OCIRepository
    patch: |-
      - op: replace
        path: /spec/url
        value: oci://ghcr.io/acme/hello-world/production/manifests
  - target:
      kind: Rollout
    patch: |-
      - op: replace
        path: /spec/bakeTime
        value: 30m
      - op: add
        path: /metadata/labels
        value:
          approval.kuberik.com/required: "true"
      # remove after the first deploy
      - op: add
        path: /spec/wantedVersion
        value: main-3f9c2ab-1794583200
```

Once production has deployed that release, remove the `wantedVersion` operation and apply the overlay again, so the Rollout goes back to choosing releases itself ([Promote Across Environments](/docs/releases/promote/#create-the-production-environment)).

## Use image tag mode

In [image tag mode](/docs/concepts/propagation/), every environment's ReleaseSource scans the same image, `ghcr.io/acme/hello-world`, so no overlay patches it. The component swaps the OCIRepository for a GitRepository, or any other Flux source, and annotates the Kustomization. This is the whole component file for image tag mode:

```yaml {filename="kuberik/pipeline/pipeline.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: ReleaseSource
metadata:
  name: hello-world
  namespace: hello-world
spec:
  oci:
    image: ghcr.io/acme/hello-world  # the same in every environment
    filterTags:
      pattern: '^main-[a-f0-9]+-(?P<ts>[0-9]+)$'
      extract: '$ts'
    policy:
      numerical:
        order: asc
---
apiVersion: kuberik.com/v1alpha1
kind: HealthCheck
metadata:
  name: hello-world
  namespace: hello-world
  labels:
    app: hello-world
  annotations:
    healthcheck.kuberik.com/kustomization: "hello-world"
spec:
  class: kustomization
---
apiVersion: kuberik.com/v1alpha1
kind: Rollout
metadata:
  name: hello-world
  namespace: hello-world
spec:
  releaseSourceRef:
    name: hello-world
  bakeTime: 5m
  deployTimeout: 10m
  healthCheckSelector:
    selector:
      matchLabels:
        app: hello-world
---
apiVersion: kuberik.com/v1alpha1
kind: ApprovalPolicy
metadata:
  name: hello-world
  namespace: hello-world
spec:
  rolloutSelector:
    matchLabels:
      approval.kuberik.com/required: "true"  # no Rollout carries it yet
---
apiVersion: environments.kuberik.com/v1alpha1
kind: Environment
metadata:
  name: hello-world-development
  namespace: hello-world
spec:
  rolloutRef:
    name: hello-world
  name: hello-world
  environment: development  # each overlay sets this
  backend:
    type: github
    project: acme/hello-world
---
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: hello-world
  namespace: hello-world
spec:
  interval: 1m
  url: https://github.com/acme/hello-world
  ref:
    branch: main
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: hello-world
  namespace: hello-world
  annotations:
    rollout.kuberik.com/substitute.APP_VERSION.from: "hello-world"
spec:
  interval: 10m
  path: ./deploy/development  # each overlay sets this
  prune: true
  sourceRef:
    kind: GitRepository
    name: hello-world
  targetNamespace: hello-world
```

Each overlay then patches the Environment and the Kustomization's path, and the manifests in each `deploy/` overlay read `${APP_VERSION}` as in [Deploy Your First App](/docs/getting-started/):

```yaml {filename="kuberik/staging/kustomization.yaml"}
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
components:
  - ../pipeline
patches:
  - target:
      kind: Environment
    patch: |-
      - op: replace
        path: /metadata/name
        value: hello-world-staging
      - op: replace
        path: /spec/environment
        value: staging
  - target:
      kind: Kustomization
    patch: |-
      - op: replace
        path: /spec/path
        value: ./deploy/staging
```

## Check the result

Render two overlays and compare them. The only differences are the ones the overlays set:

```bash {filename="Terminal"}
diff <(kubectl kustomize kuberik/staging) <(kubectl kustomize kuberik/production)
```

```text {filename="Output"}
4c4
<   name: hello-world-staging
---
>   name: hello-world-production
10c10
<   environment: staging
---
>   environment: production
47c47
<     image: ghcr.io/acme/hello-world/staging/manifests
---
>     image: ghcr.io/acme/hello-world/production/manifests
54a55,56
>   labels:
>     approval.kuberik.com/required: "true"
58c60
<   bakeTime: 5m
---
>   bakeTime: 30m
89c91
<   url: oci://ghcr.io/acme/hello-world/staging/manifests
---
>   url: oci://ghcr.io/acme/hello-world/production/manifests
```

Once the overlays are applied, read the production Environment's conditions as in [Promote Across Environments](/docs/releases/promote/#check-the-result).

## Next steps

{{< next "/docs/concepts/propagation/" "/docs/gates/approvals/" "/docs/releases/publish/" >}}
