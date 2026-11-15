---
title: "Deploy Your First App"
description: "Deploy an app with a Rollout, a ReleaseSource and Flux, then watch Kuberik ship a new release."
type_: tutorial
weight: -10
sidebar:
  open: true
tabs:
  sync: true
---

Deploy `hello-world` with Kuberik. At the end, every build your CI publishes is picked up by a [`ReleaseSource`](/docs/releases/publish/) and deployed by a [`Rollout`](/docs/concepts/rollouts/) through Flux.

Before you start, you need a cluster with [Flux](https://fluxcd.io) 2.6 or later and [Kuberik](/docs/installation/helm/) installed, and a GitHub repository, here `acme/hello-world`, whose CI can push to `ghcr.io/acme/hello-world`. This tutorial needs the chart release after 0.7.0 {{< needs "Next release" >}}: it uses `ReleaseSource` and `spec.releaseSourceRef`, which chart 0.7.0 and its rollout-controller v0.9.2 do not have. Pick Image tag or Rendered manifests in the tabs below; [Propagation Modes](/docs/concepts/propagation/) explains the difference.

{{% steps %}}

### Create the namespace

Kuberik looks up the `ReleaseSource`, `Kustomization` and `OCIRepository` in the Rollout's own namespace, so everything on this page goes into one namespace.

```bash {filename="Terminal"}
kubectl create namespace hello-world
```

### Create a ReleaseSource

A `ReleaseSource` lists the tags of an OCI repository, orders them by a policy, and keeps the result as the catalogue of releases your Rollout reads. CI tags each build `main-<sha>-<timestamp>`, and the policy orders by the timestamp.

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
        pattern: '^main-[a-f0-9]+-(?P<ts>[0-9]+)$'
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
        pattern: '^main-[a-f0-9]+-(?P<ts>[0-9]+)$'
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

Its `READY` column reads `False` until CI has pushed the first tag; that is expected at this point. For a private registry, add `secretRef` under `oci` with the name of an image pull secret in the same namespace. Releases are kept for 7 days, and at least 30 are always kept; change this with `spec.retention`.

### Create the Rollout

The `Rollout` reads releases from the `ReleaseSource` and decides which one to deploy. The [`HealthCheck`](/docs/gates/health-checks/) follows the Flux Kustomization you create in the next step, and the Rollout selects it, so a deploy succeeds only after Flux has applied it and it stayed healthy for the bake time. Both resources are identical in the two modes.

```yaml {filename="rollout.yaml"}
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
  bakeTime: 5m  # healthy this long before the deploy succeeds
  healthCheckSelector:
    selector:
      matchLabels:
        app: hello-world
```

Without a health check, the bake starts as soon as Kuberik writes the tag, so the deploy succeeds `bakeTime` later whether or not Flux applied anything. See [Verify with Health Checks](/docs/gates/health-checks/) for the other checks.

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
      rollout.kuberik.com/substitute.APP_VERSION.from: "hello-world"
  spec:
    interval: 10m
    path: ./deploy/production
    prune: true
    sourceRef:
      kind: GitRepository
      name: hello-world
    targetNamespace: hello-world
  ```

  The Deployment in `deploy/production` of `acme/hello-world` reads the substitution variable:

  ```yaml {filename="deploy/production/deployment.yaml"}
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
            image: ghcr.io/acme/hello-world:${APP_VERSION}
  ```

  Until the first release, Kuberik has no tag to write, so Flux applies the image with a literal `${APP_VERSION}`: the Kustomization reads `Ready` while the pod sits in `InvalidImageName`. This clears when the first release is deployed.
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

Add the workflow for your mode from [Publish Releases from CI](/docs/releases/publish/) to `acme/hello-world` and push a commit to `main`. The workflow builds the image from the repository root, so the repository needs a `Dockerfile` there. CI pushes a `main-<sha>-<timestamp>` tag, the `ReleaseSource` lists it within a minute, and the Rollout deploys it.

{{% /steps %}}

## Check the result

The `ReleaseSource` shows the newest tag it found and how many releases are in its catalogue.

```bash {filename="Terminal"}
kubectl get releasesource -n hello-world hello-world
```

```text {filename="Output"}
NAME          NEWEST                    COUNT   READY   AGE
hello-world   main-3f9c2ab-1794583200   1       True    2m
```

The Rollout records each deploy in `status.history`, newest first. `Deploying` means Kuberik wrote the tag and waits for the health check to report healthy; `InProgress` means bake time is running; `Succeeded` means the check stayed healthy for the whole bake time. Gates never hold a Rollout's first deploy: it deploys the newest release the gates allow, or the newest release if they allow none. From the second deploy on, gates hold releases they do not allow.

```bash {filename="Terminal"}
kubectl get rollout -n hello-world hello-world \
  -o custom-columns='VERSION:.status.history[0].version.tag,BAKE:.status.history[0].bakeStatus,MESSAGE:.status.history[0].message'
```

```text {filename="Output"}
VERSION                   BAKE        MESSAGE
main-3f9c2ab-1794583200   Succeeded   Automatic deployment
```

The dashboard shows each rollout with its running build, the pipeline it moved through, and its health checks. It is off by default; [Expose the Dashboard](/docs/installation/helm/#expose-the-dashboard) turns it on, and [Use the Dashboard](/docs/operate/dashboard/) shows how to read it.

![A prod rollout with the shape this tutorial builds: a two-step pipeline, Started then Check, no newer build waiting, and one Flux Deployment health check passing](/images/docs/getting-started/rollout-pipeline.png)

## Next steps

{{< next "/docs/releases/publish/" "/docs/gates/approvals/" "/docs/concepts/propagation/" >}}
