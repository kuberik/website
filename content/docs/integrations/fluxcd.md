---
title: "Flux"
description: "Let Kuberik choose the version Flux applies, through a Kustomization substitute or an OCIRepository tag, and gate deploys on Kustomization health."
type_: integration
weight: 10
---

Flux applies your manifests and Kuberik decides which version it applies. A [`Rollout`](/docs/concepts/rollouts/) writes the chosen version into a Flux `Kustomization` or `OCIRepository`, and reads the Kustomization's health back to decide whether the deploy succeeded.

## What you need

| Requirement | Why |
|---|---|
| Flux 2.6 or later | Kuberik writes `kustomize.toolkit.fluxcd.io/v1` Kustomizations and `source.toolkit.fluxcd.io/v1` OCIRepositories |
| Flux 2.7 or later with image-reflector-controller, serving `image.toolkit.fluxcd.io/v1` (optional) | Only for a ReleaseSource that reads an existing `ImagePolicy` through `imagePolicyRef` |
| Flux 2.7 or later, with the kustomize-controller feature gate `CancelHealthCheckOnNewRevision` | Only for Kustomizations with `wait: true` (see [Report Kustomization health](#report-kustomization-health)) |
| A [`ReleaseSource`](/docs/releases/publish/) in the Rollout's namespace | Lists your releases. Flux image automation is not required |
| The Kustomization or OCIRepository in the Rollout's namespace | The Rollout looks for annotated Flux objects only in its own namespace |

Kuberik drives one of two Flux objects. Annotate a Kustomization and the Rollout sets a `postBuild.substitute` variable; annotate an OCIRepository and the Rollout sets its tag. [Propagation Modes](/docs/concepts/propagation/) compares the two.

## Discover releases

A `ReleaseSource` lists the tags of an OCI repository, orders them by a policy, and keeps the catalogue the Rollout reads through `spec.releaseSourceRef`:

```yaml {filename="releasesource.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: ReleaseSource
metadata:
  name: hello-world
  namespace: hello-world
spec:
  oci:
    image: ghcr.io/acme/hello-world
    policy:
      semver:
        range: ">=1.0.0"
```

If you already run a Flux `ImagePolicy`, set `spec.oci.imagePolicyRef.name` instead of `image` and `policy`; the ReleaseSource reads the image, filter and policy from it. [Publish Releases from CI](/docs/releases/publish/) covers tag schemes, and [Pull from a private registry](/docs/releases/publish/#pull-from-a-private-registry) covers private registries.

## Set a Kustomization substitute

Annotate the Kustomization with `rollout.kuberik.com/substitute.<variable>.from: <rollout name>`. The Rollout writes the release tag into `spec.postBuild.substitute.<variable>`. The Kustomization's `sourceRef` can be a `GitRepository`, an `OCIRepository` or a `Bucket`; the Rollout does not read it:

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
  prune: true
  path: ./deploy/production
  sourceRef:
    kind: GitRepository
    name: hello-world
  postBuild:
    substitute:
      ENVIRONMENT: production  # keeps substitution on
```

Use the variable in the manifests under `path`:

```yaml {filename="deploy/production/deployment.yaml"}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-world
  namespace: hello-world
spec:
  replicas: 2
  selector:
    matchLabels:
      app: hello-world
  template:
    metadata:
      labels:
        app: hello-world
    spec:
      containers:
        - name: hello-world
          image: ghcr.io/acme/hello-world:${APP_VERSION:=1.0.0}
```

Keep at least one other key in `postBuild.substitute`, or a `postBuild.substituteFrom` entry, in the Kustomization you commit. With an empty `postBuild` or `substitute`, Flux runs no substitution at all, so until the Rollout writes its key `${APP_VERSION:=1.0.0}` reaches the cluster as written.

Never set `APP_VERSION` itself in Git. When Flux applies this Kustomization from Git with the key set, then after every deploy it writes the Git value back at the parent Kustomization's next reconcile, and the Rollout keeps reporting the version it deployed.

One Kustomization can carry several of these annotations, one per variable, each naming its own Rollout. A frontend and a backend Rollout can then deploy into the same Kustomization independently.

## Set an OCIRepository tag

Annotate an OCIRepository with `rollout.kuberik.com/rollout: <rollout name>`. The Rollout owns `spec.ref.tag` and sets it to the release tag. Give each environment its own artifact path and OCIRepository, so a rollback in production moves one tag and leaves every other environment alone:

```yaml {filename="ocirepository.yaml"}
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
```

Point a Kustomization at it. The artifact holds rendered manifests, so there is no substitution:

```yaml {filename="kustomization-oci.yaml"}
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

`OCIRepository` can verify a Cosign signature with `spec.verify`, so an unsigned artifact never reaches the cluster.

## Report Kustomization health

A [`HealthCheck`](/docs/gates/health-checks/) with class `kustomization` reports the health of one Kustomization. The Rollout selects it with `healthCheckSelector` and fails the deploy if it turns `Unhealthy`:

```yaml {filename="healthcheck.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: HealthCheck
metadata:
  name: hello-world
  namespace: hello-world
  labels:
    app: hello-world  # the Rollout selects this
  annotations:
    healthcheck.kuberik.com/kustomization: "hello-world"
spec:
  class: kustomization
```

The annotation takes the Kustomization's name, or `<namespace>/<name>` for one in another namespace.

How the check reads health depends on the Kustomization's `spec.wait`:

| `spec.wait` | What is checked | `Unhealthy` when |
|---|---|---|
| `false` (default) | The Kustomization, then every resource in its inventory, with [kstatus](https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/README.md) | The Kustomization or any managed resource has failed |
| `true` | Only the Kustomization's `Ready` condition | `Ready` is `False` for a reason other than `Progressing`, `ProgressingWithRetry`, `HealthCheckCanceled`, `DependencyNotReady` or `ArtifactFailed` |

With `wait: true`, Kuberik trusts kustomize-controller's own health checks and assumes it runs with `CancelHealthCheckOnNewRevision` (Flux 2.7 or later). Without that feature gate, a failing revision blocks the next one until the Kustomization's `spec.timeout`, so a fix cannot roll out quickly.

The check polls every 30 seconds and on every Kustomization change. Set `healthcheck.kuberik.com/requeue-interval` (for example `"60s"`, minimum `5s`) to change the poll. [Verify with Health Checks](/docs/gates/health-checks/) explains how the Rollout uses the result.

## How it works

{{< fig id="flux-propagation" caption="The Rollout picks a release from the ReleaseSource and writes its tag into Flux; Flux applies it, and the Kustomization's health comes back as a HealthCheck." >}}

The ReleaseSource lists releases from the registry. When the Rollout picks a release, it writes the tag with server-side apply under the field manager `rollout-controller`: into the substitute variable, or into the OCIRepository's `spec.ref.tag`. Flux then reconciles as usual.

![The Health checks card, 3/3 healthy with the Flux Deployment check passing, above the Resources card: 2/2 ready, hello-world, 1/1 ready, and one more ready resource folded](/images/docs/integrations/fluxcd-health-resources.png)

## Troubleshoot

| Symptom | Cause | Fix |
|---|---|---|
| The Kustomization substitute never changes | The annotation value is not the Rollout's name, or the Kustomization is in another namespace | Set `rollout.kuberik.com/substitute.<variable>.from` to the exact Rollout name, in the Rollout's namespace |
| The Rollout has no releases | The ReleaseSource cannot reach the registry (`SourceReachable` is `False`) | Run `kubectl -n hello-world describe releasesource hello-world` and check the image path and `spec.oci.secretRef` |
| HealthCheck `Unhealthy`: `Kustomization not found` | Wrong name in `healthcheck.kuberik.com/kustomization` | Use the Kustomization's name, or `<namespace>/<name>` if it lives in another namespace |
| HealthCheck stays `Pending`: `Kustomization has no managed resources` | The Kustomization has not applied anything yet, or its inventory is empty | Check the Kustomization with `flux get kustomizations -n hello-world` |
| With `wait: true`, a fixed release waits for the failed one to time out | kustomize-controller runs without `CancelHealthCheckOnNewRevision` | Enable the feature gate (Flux 2.7 or later), or set `wait: false` |

### The version reverts after a deploy

The Kustomization in Git sets the Rollout's substitute key. The Rollout writes the key only when it deploys a new version, and Flux applies the Git copy at its next interval and takes the key back. The cluster then runs the Git value while the Rollout and the dashboard show the deployed one. Compare the two tags; in the field owners, the `manager:` line right after `f:APP_VERSION` reads `kustomize-controller` when Git owns the key.

```bash {filename="Terminal"}
kubectl -n hello-world get kustomization hello-world -o jsonpath='{.spec.postBuild.substitute.APP_VERSION}{"\n"}'
kubectl -n hello-world get rollout hello-world -o jsonpath='{.status.history[0].version.tag}{"\n"}'
kubectl -n hello-world get kustomization hello-world -o yaml --show-managed-fields | grep -E 'manager:|f:APP_VERSION'
```

Without the key, substitution renders the `${APP_VERSION:=1.0.0}` default, so suspend the Kustomization before you change Git. The parent Kustomization, which applies this one from Git, applies only the fields in Git, so the suspend holds unless Git sets `spec.suspend`.

```bash {filename="Terminal"}
flux suspend kustomization hello-world -n hello-world
```

Remove `APP_VERSION` from the Kustomization in Git and wait until the parent has applied that (the first `jsonpath` command under the symptom prints nothing); `flux reconcile kustomization flux-system --with-source` hurries a bootstrapped parent. Put back the tag the second `jsonpath` command printed, then resume; the Rollout keeps the key from its next deploy on.

```bash {filename="Terminal"}
kubectl -n hello-world patch kustomization hello-world --type merge --field-manager=rollout-controller \
  -p '{"spec":{"postBuild":{"substitute":{"APP_VERSION":"<deployed-tag>"}}}}'
flux resume kustomization hello-world -n hello-world
```

## Next steps

{{< next "/docs/gates/health-checks/" "/docs/concepts/propagation/" "/docs/gates/approvals/" >}}
