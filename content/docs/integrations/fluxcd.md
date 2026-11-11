---
title: "FluxCD Integration"
weight: 1
---

Kuberik uses FluxCD for GitOps deployments. Flux applies your manifests; Kuberik decides which version it applies, and discovers new versions itself with a [`ReleaseSource`](#release-source-setup).

## Overview

FluxCD provides the delivery half of Kuberik:

| Component | Purpose |
|-----------|---------|
| **GitRepository** | Holds the manifests in image tag mode |
| **Kustomization** | Applies versioned manifests to the cluster |
| **OCIRepository** | Pulls rendered manifests published as an OCI artifact |

Kuberik drives one of two of these. Annotate a `Kustomization` and Kuberik substitutes the version into it; annotate an `OCIRepository` and Kuberik moves its tag. See [Propagation Modes](/docs/concepts/propagation/).

{{< callout type="warning" >}}
**Everything in the Rollout's Namespace**

Kuberik resolves the `ReleaseSource` and lists `Kustomization` and `OCIRepository` resources in the Rollout's own namespace. Resources in `flux-system` are not seen by a Rollout in `my-app`.
{{< /callout >}}

```mermaid
flowchart LR
    %% Styles
    classDef flux fill:#2D7E9D,stroke:#fff,stroke-width:2px,color:#fff
    classDef kuberik fill:#4B4BE8,stroke:#fff,stroke-width:2px,color:#fff
    classDef external fill:#E5E7EB,stroke:#374151,stroke-width:1px,color:#374151
    classDef boundary fill:#F3F4F6,stroke:#D1D5DB,stroke-width:1px,color:#374151,stroke-dasharray: 5 5

    subgraph Registry ["Container Registry"]
        REG[Image Repository]:::external
    end

    subgraph Cluster ["Kubernetes Cluster"]
        direction TB

        subgraph FluxCD ["FluxCD System"]
            OCIR[OCIRepository]:::flux
            KS[Kustomization]:::flux
        end

        subgraph Kuberik ["Kuberik"]
            RS[ReleaseSource]:::kuberik
            RO[Rollout]:::kuberik
        end
    end

    REG --> RS
    REG --> OCIR
    RS --> RO
    OCIR --> KS
    RO -.->|Substitutes Version| KS
    RO -.->|Moves Tag| OCIR

    class FluxCD,Kuberik boundary
```

---



## Release Source Setup

New versions are discovered by a Kuberik `ReleaseSource`, not by Flux image automation. It lists the tags of an OCI repository, orders them by a policy, and keeps the result as the catalogue your Rollout reads. You do not need `ImageRepository` or `ImagePolicy` resources for this.

### Create a ReleaseSource

Point it at your application image, or at the manifest artifact your CI publishes for this environment, and pick how tags are ordered:

{{< tabs >}}
  {{< tab name="SemVer" >}}
  **Semantic Versioning (Recommended)**

  ```yaml {filename="releasesource-semver.yaml"}
  apiVersion: kuberik.com/v1alpha1
  kind: ReleaseSource
  metadata:
    name: my-app
    namespace: my-app
  spec:
    oci:
      image: ghcr.io/my-org/my-app
      # For private registries
      secretRef:
        name: registry-credentials
      policy:
        semver:
          range: ">=1.0.0"
  ```
  {{< /tab >}}

  {{< tab name="Numerical" >}}
  **Numerical / Alphabetical**

  Useful for timestamps or build numbers. `filterTags` keeps matching tags and extracts the part to order by:

  ```yaml {filename="releasesource-numerical.yaml"}
  apiVersion: kuberik.com/v1alpha1
  kind: ReleaseSource
  metadata:
    name: my-app
    namespace: my-app
  spec:
    oci:
      image: ghcr.io/my-org/my-app
      filterTags:
        pattern: '^main-[a-f0-9]+-(?P<ts>[0-9]+)'
        extract: '$ts'
      policy:
        numerical:
          order: asc
  ```
  {{< /tab >}}
{{< /tabs >}}

Then reference it from the Rollout with `spec.releaseSourceRef`.

{{< callout type="info" >}}
**Already have an ImagePolicy?**

A ReleaseSource can reuse it: set `spec.oci.imagePolicyRef.name` instead of `image` and `policy`. `spec.releasesImagePolicy` on the Rollout is deprecated and ignored.
{{< /callout >}}

### Verify Discovery

Check that the source found your tags:

```bash
kubectl get releasesource -n my-app my-app
```

The source reports `Ready` once its catalogue is populated, and shows the newest release it found.

---

## Kustomization Integration

### Version Substitution

Kuberik updates Kustomizations by modifying `postBuild.substitute` values:

```yaml {filename="kustomization.yaml"}
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: my-app
  namespace: my-app
  annotations:
    # Kuberik reads the version from this Rollout
    rollout.kuberik.com/substitute.APP_VERSION.from: "my-app"
spec:
  interval: 10m
  path: ./k8s/overlays/production
  sourceRef:
    kind: GitRepository
    name: my-app
  postBuild:
    substitute:
      APP_VERSION: "1.0.0"  # Default, overwritten by Kuberik
```

{{< callout type="info" >}}
**Multiple Rollouts per Kustomization**

A single Kustomization can be driven by multiple Rollouts. Declare one annotation per substitution variable, each pointing to its own Rollout — for example, a frontend and backend version managed by independent rollouts targeting the same Kustomization.
{{< /callout >}}

{{< callout type="info" >}}
**Repository Structure**

Your Git repository should be organized with Kustomize overlays for different environments:
{{< /callout >}}

{{< filetree/container >}}
  {{< filetree/folder name="k8s" >}}
    {{< filetree/folder name="base" >}}
      {{< filetree/file name="deployment.yaml" >}}
      {{< filetree/file name="service.yaml" >}}
      {{< filetree/file name="kustomization.yaml" >}}
    {{< /filetree/folder >}}
    {{< filetree/folder name="overlays" >}}
      {{< filetree/folder name="staging" >}}
        {{< filetree/file name="kustomization.yaml" >}}
        {{< filetree/file name="patches.yaml" >}}
      {{< /filetree/folder >}}
      {{< filetree/folder name="production" >}}
        {{< filetree/file name="kustomization.yaml" >}}
        {{< filetree/file name="patches.yaml" >}}
      {{< /filetree/folder >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
{{< /filetree/container >}}

Your base deployment uses the substitution variable:

```yaml {filename="k8s/base/deployment.yaml"}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  template:
    spec:
      containers:
        - name: app
          image: ghcr.io/my-org/my-app:${APP_VERSION}
```

---

## OCIRepository Integration

### Tag Management

Kuberik owns `spec.ref.tag` on the annotated OCIRepository. Each environment gets its own artifact path and its own OCIRepository, so a rollback in production moves one tag and leaves every other environment alone.

```yaml {filename="ocirepository.yaml"}
apiVersion: source.toolkit.fluxcd.io/v1
kind: OCIRepository
metadata:
  name: my-app
  namespace: my-app
  annotations:
    # Kuberik reads the version from this Rollout
    rollout.kuberik.com/rollout: "my-app"
spec:
  interval: 60s
  url: oci://ghcr.io/my-org/my-app/production/manifests
  # For private registries
  secretRef:
    name: registry-credentials
```

Point a Kustomization at it and reconcile the artifact directly. No `path`, no substitution, no build tooling in the cluster:

```yaml {filename="kustomization-oci.yaml"}
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: my-app
  namespace: my-app
spec:
  interval: 10m
  prune: true
  sourceRef:
    kind: OCIRepository
    name: my-app
```

{{< callout type="info" >}}
**Cosign Verification**

`OCIRepository` supports `spec.verify` natively. The signature is checked before reconciliation, so an unsigned or tampered artifact is rejected before it reaches the API server.
{{< /callout >}}

---

## Health Check Integration

Use Kustomization health status as a deployment gate:

```yaml
apiVersion: kuberik.com/v1alpha1
kind: HealthCheck
metadata:
  name: my-app-health
  annotations:
    healthcheck.kuberik.com/kustomization: "my-app"
spec:
  class: "kustomization"
```

This checks if the Kustomization's `Ready` condition is true.

![The Kustomization health check beside the Flux resources the rollout manages, each with its current state](/screenshots/dashboard/overview-prod.png)

---

{{% details title="Troubleshooting" %}}

### ReleaseSource not finding versions

1. Check the ReleaseSource status and conditions:
   ```bash
   kubectl describe releasesource -n my-app my-app
   ```

2. Verify registry authentication:
   ```bash
   kubectl get secret -n my-app registry-credentials
   ```

### Kustomization not updating

1. Check Kuberik annotation is present
2. Verify Rollout name matches annotation value
3. Check Rollout status:
   ```bash
   kubectl describe rollout my-app
   ```

### Common Issues

{{< callout type="warning" >}}
**ReleaseSource not ready, `SourceReachable` false**

Usually indicates authentication issues or an invalid image path. Check the image name matches your container registry exactly.
{{< /callout >}}

{{< callout type="info" >}}
**Kustomization stuck on old version**

Ensure the annotation `rollout.kuberik.com/substitute.VAR_NAME.from` exactly matches your Rollout name.
{{< /callout >}}

{{% /details %}}

---

## Next Steps

{{< cards >}}
  {{< card title="Verifying Deployments" link="/docs/guides/health-checks/" icon="shield-check" subtitle="Active health verification" >}}
  {{< card title="Manual Approvals" link="/docs/guides/manual-approvals/" icon="key" subtitle="Human sign-off with gates" >}}
{{< /cards >}}
