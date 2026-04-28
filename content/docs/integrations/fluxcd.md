---
title: "FluxCD Integration"
weight: 1
---

Kuberik uses FluxCD for image automation and GitOps deployments.

## Overview

FluxCD provides two critical capabilities for Kuberik:

| Component | Purpose |
|-----------|---------|
| **ImageRepository** + **ImagePolicy** | Detects new container image versions |
| **Kustomization** | Applies versioned manifests to the cluster |

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
            IR[ImageRepository]:::flux
            IP[ImagePolicy]:::flux
            KS[Kustomization]:::flux
        end

        subgraph Kuberik ["Kuberik"]
            RO[Rollout]:::kuberik
        end
    end

    REG --> IR
    IR --> IP
    IP --> RO
    RO -.->|Substitutes Version| KS

    class FluxCD,Kuberik boundary
```

---



## Image Automation Setup

### Create ImageRepository

Tell Flux where to scan for images:

```yaml {filename="image-repo.yaml"}
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImageRepository
metadata:
  name: my-app
  namespace: flux-system
spec:
  image: ghcr.io/my-org/my-app
  interval: 5m
  # For private registries
  secretRef:
    name: registry-credentials
```

### Create ImagePolicy

Define which tags to consider:

{{< tabs >}}
  {{< tab name="SemVer" >}}
  **Semantic Versioning (Recommended)**

  ```yaml {filename="image-policy-semver.yaml"}
  apiVersion: image.toolkit.fluxcd.io/v1beta2
  kind: ImagePolicy
  metadata:
    name: my-app
    namespace: flux-system
  spec:
    imageRepositoryRef:
      name: my-app
    policy:
      semver:
        range: ">=1.0.0"
  ```
  {{< /tab >}}

  {{< tab name="Alphabetical" >}}
  **Alphabetical / Numerical**

  Useful for timestamps or build numbers:

  ```yaml {filename="image-policy-alpha.yaml"}
  apiVersion: image.toolkit.fluxcd.io/v1beta2
  kind: ImagePolicy
  metadata:
    name: my-app
    namespace: flux-system
  spec:
    imageRepositoryRef:
      name: my-app
    policy:
      alphabetical:
        order: desc
  ```
  {{< /tab >}}
{{< /tabs >}}

### Verify Discovery

Check that Flux found your images:

```bash
kubectl get imagepolicy -n flux-system my-app
```

Expected output shows the latest matching version.

---

## Kustomization Integration

### Version Substitution

Kuberik updates Kustomizations by modifying `postBuild.substitute` values:

```yaml {filename="kustomization.yaml"}
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: my-app
  namespace: flux-system
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

---

{{% details title="Troubleshooting" %}}

### ImagePolicy not finding versions

1. Check ImageRepository status:
   ```bash
   kubectl describe imagerepository -n flux-system my-app
   ```

2. Verify registry authentication:
   ```bash
   kubectl get secret -n flux-system registry-credentials
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
**ImageRepository showing "Failed"**

Usually indicates authentication issues or invalid image path. Check the repository name matches your container registry exactly.
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
