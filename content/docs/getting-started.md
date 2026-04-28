---
title: "Getting Started"
weight: 2
sidebar:
  open: true
---

Deploy your first application with Kuberik. This guide assumes you have a cluster with [FluxCD](https://fluxcd.io) and [Kuberik](/docs/installation/) installed.

{{% steps %}}

### Configure Image Automation

Tell Flux where to find your container images.

```yaml {filename="image-automation.yaml"}
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImageRepository
metadata:
  name: hello-world-app
  namespace: flux-system
spec:
  image: ghcr.io/kuberik/hello-world/app
  interval: 60s
---
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImagePolicy
metadata:
  name: hello-world-app
  namespace: flux-system
spec:
  imageRepositoryRef:
    name: hello-world-app
  policy:
    semver:
      range: ">=0.1.0"
```

```bash
kubectl apply -f image-automation.yaml
```

### Create the Rollout

Define how Kuberik should manage versions.

```yaml {filename="rollout.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: Rollout
metadata:
  name: hello-world-app
  namespace: default
spec:
  releasesImagePolicy:
    name: hello-world-app
```

```bash
kubectl apply -f rollout.yaml
```

### Deploy with Kuberik

Apply the Flux Kustomization that uses Kuberik's substitution.

```yaml {filename="kustomization.yaml"}
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: hello-world-app
  namespace: flux-system
  annotations:
    rollout.kuberik.com/substitute.HELLO_WORLD_VERSION.from: "hello-world-app"
spec:
  interval: 10m0s
  path: ./deployments/prod
  sourceRef:
    kind: GitRepository
    name: hello-world
  targetNamespace: hello-world
```

```bash
kubectl apply -f kustomization.yaml
```

{{< callout type="info" >}}
Ensure your Deployment in `./deployments/prod` uses the substitution variable:

```yaml {filename="deployment.yaml"}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-world
spec:
  template:
    spec:
      containers:
        - name: app
          image: ghcr.io/kuberik/hello-world/app:${HELLO_WORLD_VERSION}
```
{{< /callout >}}

### Verify the Rollout

Check that Kuberik detected the new image and created a release.

```bash
kubectl describe rollout hello-world-app
```

{{% /steps %}}



---

## Next Steps

{{< cards >}}
  {{< card title="Manual Approvals" link="/docs/guides/manual-approvals/" icon="shield-check" subtitle="Add production gates" >}}
  {{< card title="Core Concepts" link="/docs/concepts/architecture/" icon="book-open" subtitle="How it works" >}}
{{< /cards >}}
