---
title: "Deploy Your First App"
linkTitle: "Deploy Your First App"
description: "Deploy an app with a Rollout, a ReleaseSource and Flux, then watch Kuberik ship a new release."
type_: tutorial
weight: -10
sidebar:
  open: true
tabs:
  sync: true
---

Deploy `hello-world` with Kuberik. At the end, every build your CI publishes is picked up by a `ReleaseSource` and deployed by a `Rollout` through Flux.

Before you start, you need a cluster with [Flux](https://fluxcd.io) and [Kuberik](/docs/installation/helm/) installed (the Helm chart includes the release-controller that serves `ReleaseSource`), and a GitHub repository, here `acme/hello-world`, whose CI can push to `ghcr.io/acme/hello-world`.

Kuberik moves one of two things through your environments:

| Mode | What Kuberik moves | Where your manifests come from |
|------|--------------------|--------------------------------|
| Image tag | The application image tag, written into a Flux `Kustomization` as a substitution variable | A Flux `GitRepository` |
| Rendered manifests | The tag on a Flux `OCIRepository` holding the manifests CI already rendered | An `OCIRepository`, one artifact per environment |

Pick a mode in the tabs below and it carries through the page. Both modes use the same `Rollout`. See [Propagation Modes](/docs/concepts/propagation/) for how to choose.

{{% steps %}}

### Create the namespace

Kuberik looks up the `ReleaseSource`, `Kustomization` and `OCIRepository` in the Rollout's own namespace, so everything on this page goes into one namespace.

```bash {filename="Terminal"}
kubectl create namespace hello-world
```

### Create a ReleaseSource

A [`ReleaseSource`](/docs/concepts/architecture/) lists the tags of an OCI repository, orders them by a policy, and keeps the result as the catalogue of releases your Rollout reads. CI tags each build `main-<sha>-<timestamp>`, and the policy orders by the timestamp.

{{< tabs >}}
  {{< tab name="Image tag" >}}
  Scan the container image your application is built into.

  ```yaml {filename="releasesource.yaml"}
  apiVersion: kuberik.com/v1alpha1
  kind: ReleaseSource
  metadata:
    name: hello-world
    namespace: hello-world
  spec:
    oci:
      image: ghcr.io/acme/hello-world
      filterTags:
        pattern: '^main-[a-f0-9]+-(?P<ts>[0-9]+)'
        extract: '$ts'
      policy:
        numerical:
          order: asc  # the highest timestamp is the newest release
  ```
  {{< /tab >}}

  {{< tab name="Rendered manifests" >}}
  Scan the manifest artifact CI pushes for the production environment. The setup is the same as for an image apart from the repository path.

  ```yaml {filename="releasesource.yaml"}
  apiVersion: kuberik.com/v1alpha1
  kind: ReleaseSource
  metadata:
    name: hello-world
    namespace: hello-world
  spec:
    oci:
      image: ghcr.io/acme/hello-world/production/manifests
      filterTags:
        pattern: '^main-[a-f0-9]+-(?P<ts>[0-9]+)'
        extract: '$ts'
      policy:
        numerical:
          order: asc  # the highest timestamp is the newest release
  ```
  {{< /tab >}}
{{< /tabs >}}

```bash {filename="Terminal"}
kubectl apply -f releasesource.yaml
```

For a private registry, add `secretRef` under `oci` with the name of an image pull secret in the same namespace. Releases are kept for 7 days, and at least 30 are always kept; change this with `spec.retention`.

### Create the Rollout

The [`Rollout`](/docs/concepts/rollouts/) reads releases from the `ReleaseSource` and decides which one to deploy. It is the same in both modes.

```yaml {filename="rollout.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: Rollout
metadata:
  name: hello-world
  namespace: hello-world
spec:
  releaseSourceRef:
    name: hello-world
```

```bash {filename="Terminal"}
kubectl apply -f rollout.yaml
```

### Connect Flux

Create the Flux objects the Rollout drives. The annotation names the Rollout that owns them.

{{< tabs >}}
  {{< tab name="Image tag" >}}
  Flux reads the manifests from git. Kuberik writes the selected tag into `postBuild.substitute` on the annotated Kustomization.

  ```yaml {filename="flux.yaml"}
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
      rollout.kuberik.com/substitute.HELLO_WORLD_VERSION.from: "hello-world"
  spec:
    interval: 10m
    path: ./deployments/production
    prune: true
    sourceRef:
      kind: GitRepository
      name: hello-world
    targetNamespace: hello-world
  ```

  The Deployment in `deployments/production` of `acme/hello-world` reads the substitution variable:

  ```yaml {filename="deployments/production/deployment.yaml"}
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: hello-world
  spec:
    selector:
      matchLabels:
        app: hello-world
    template:
      metadata:
        labels:
          app: hello-world
      spec:
        containers:
          - name: app
            image: ghcr.io/acme/hello-world:${HELLO_WORLD_VERSION}
  ```
  {{< /tab >}}

  {{< tab name="Rendered manifests" >}}
  Kuberik moves `spec.ref.tag` on the annotated OCIRepository. The Kustomization applies the artifact at that tag, so the cluster needs no substitution variable and no build tooling.

  ```yaml {filename="flux.yaml"}
  apiVersion: source.toolkit.fluxcd.io/v1
  kind: OCIRepository
  metadata:
    name: hello-world
    namespace: hello-world
    annotations:
      rollout.kuberik.com/rollout: "hello-world"
  spec:
    interval: 1m
    url: oci://ghcr.io/acme/hello-world/production/manifests
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
  {{< /tab >}}
{{< /tabs >}}

```bash {filename="Terminal"}
kubectl apply -f flux.yaml
```

### Publish a release

Add the workflow for your mode from [Publish Releases from CI](/docs/guides/publishing-releases/) to `acme/hello-world` and push a commit to `main`. CI pushes a `main-<sha>-<timestamp>` tag, the `ReleaseSource` lists it within a minute, and the Rollout deploys it.

{{% /steps %}}

## Check the result

The `ReleaseSource` shows the newest tag it found and how many releases are in its catalogue.

```bash {filename="Terminal"}
kubectl get releasesource -n hello-world hello-world
```

```text {filename="Output"}
NAME          NEWEST                    COUNT   READY   AGE
hello-world   main-3f9c2ab-1763049600   1       True    2m
```

The Rollout records each deploy in `status.history`, newest first. `Deploying` means Kuberik wrote the tag and waits for health checks; `InProgress` means bake time is running; `Succeeded` means the release is live and verified.

```bash {filename="Terminal"}
kubectl get rollout -n hello-world hello-world \
  -o custom-columns='VERSION:.status.history[0].version.tag,BAKE:.status.history[0].bakeStatus,MESSAGE:.status.history[0].message'
```

```text {filename="Output"}
VERSION                   BAKE        MESSAGE
main-3f9c2ab-1763049600   Succeeded   Automatic deployment
```

The dashboard shows the same rollout: the running build, the pipeline it moved through, and its health checks.

![The rollout in the dashboard: the running build, the deployment pipeline, health checks and the resources it manages](/screenshots/dashboard/overview.png)

## Next steps

{{< cards >}}
  {{< card title="Publish Releases from CI" link="/docs/guides/publishing-releases/" icon="upload" subtitle="Tag every build so Kuberik picks it up" >}}
  {{< card title="Require a Manual Approval" link="/docs/guides/manual-approvals/" icon="shield-check" subtitle="Hold production deploys for a person" >}}
  {{< card title="Propagation Modes" link="/docs/concepts/propagation/" icon="switch-horizontal" subtitle="Image tag or rendered manifests" >}}
{{< /cards >}}
