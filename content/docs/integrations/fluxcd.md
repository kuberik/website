---
title: "Flux"
description: "Let Kuberik choose the version Flux applies, through a Kustomization substitute, a HelmRelease value or chart version, or an OCIRepository tag, and gate deploys on Kustomization and HelmRelease health."
type_: integration
weight: 10
---

Flux applies your manifests and Kuberik decides which version it applies. A [`Rollout`](/docs/concepts/rollouts/) writes the chosen version into a Flux `Kustomization`, `HelmRelease` or `OCIRepository`, and reads its health back to decide whether the deploy succeeded.

## What you need

| Requirement | Why |
|---|---|
| Flux 2.6 or later | Kuberik writes `kustomize.toolkit.fluxcd.io/v1` Kustomizations and `source.toolkit.fluxcd.io/v1` OCIRepositories |
| Flux's image-reflector-controller, serving `image.toolkit.fluxcd.io/v1` (optional) | Only for a ReleaseSource that reads an existing `ImagePolicy` through `imagePolicyRef` |
| Flux 2.7 or later, with the kustomize-controller feature gate `CancelHealthCheckOnNewRevision` | Only for Kustomizations with `wait: true` (see [Report Kustomization health](#report-kustomization-health)) |
| A [`ReleaseSource`](/docs/releases/publish/) in the Rollout's namespace | Lists your releases. Flux image automation is not required |
| Flux 2.8 or later (helm-controller 1.7.1 or later recommended) | Only for HelmReleases: the dashboard lists a chart's resources from `status.inventory`, and 1.7.1 stops reporting a failed upgrade as ready |
| RBAC for the rollout-controller: `get`, `list`, `watch` and `patch` on `helmreleases` | Only for HelmReleases. The Helm chart and the controller's install manifest grant it; without it the controller skips HelmReleases and turns the `helmrelease` check off |
| The Kustomization, HelmRelease or OCIRepository in the Rollout's namespace | The Rollout looks for annotated Flux objects only in its own namespace |

Kuberik drives three Flux objects. Annotate a Kustomization and the Rollout sets a `postBuild.substitute` variable; annotate a HelmRelease and it sets a chart value or the chart version; annotate an OCIRepository and it sets its tag. [Propagation Modes](/docs/concepts/propagation/) compares the two.

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

Never set `APP_VERSION` itself in Git. The Rollout writes only its own variable, with server-side apply and without forcing ownership. If Git or another tool also sets that variable, the Rollout writes nothing for that deploy and reports `Ready=False` with reason `KustomizationFieldConflict`, naming the variable and the other writer. Remove the variable from the Kustomization in Git, and the Rollout deploys at its next retry, within a minute. Other variables in `postBuild.substitute` stay with whoever set them.

If you upgrade from a version before this change and your Kustomization in Git sets the Rollout's variable to a starting value, remove it and put the default in the manifests (`${APP_VERSION:=1.0.0}`). Earlier versions overwrote such a value; now the Rollout refuses to deploy until it is gone.

One Kustomization can carry several of these annotations, one per variable, each naming its own Rollout. A frontend and a backend Rollout can then deploy into the same Kustomization independently.

## Set a HelmRelease value or chart version

Annotate the HelmRelease with `rollout.kuberik.com/values.<path>.from: <rollout name>`. The Rollout writes the release tag into `spec.values` at that dotted path, most often the image tag:

```yaml {filename="helmrelease.yaml"}
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: hello-world
  namespace: hello-world
  annotations:
    rollout.kuberik.com/values.image.tag.from: "hello-world"
spec:
  interval: 10m
  chart:
    spec:
      chart: hello-world
      version: 1.4.0
      sourceRef:
        kind: HelmRepository
        name: acme
  upgrade:
    remediation:
      retries: 1
  values:
    image:
      repository: ghcr.io/acme/hello-world  # no tag: the Rollout owns it
```

When the chart version is the release, annotate with `rollout.kuberik.com/chart-version.from: <rollout name>` instead, and the Rollout writes `spec.chart.spec.version`. For a HelmRelease that takes its chart through `spec.chartRef` from an OCIRepository, annotate the OCIRepository as in [Set an OCIRepository tag](#set-an-ocirepository-tag). Tag the chart artifact with its chart version (the `version` in `Chart.yaml`): the `helmrelease` health check compares the tag with the chart version Helm installed, and stays `Pending` while they differ.

Leave the field the Rollout writes out of the HelmRelease you commit, and keep its first-install default in the chart's `values.yaml`. The Rollout writes only that field, with server-side apply and without forcing ownership. If Git or another tool also sets it, the Rollout writes nothing for that deploy and reports `Ready=False` with reason `HelmReleaseFieldConflict`, naming the field and the other writer. Remove the field from Git, and the Rollout deploys at its next retry, within a minute.

A HelmRelease can carry several `values.<path>.from` annotations. Path segments are map keys separated by dots; list indexes and keys that contain a dot are not supported.

## Set an OCIRepository tag

Annotate an OCIRepository with `rollout.kuberik.com/rollout: <rollout name>`. The Rollout writes only `spec.ref.tag`, the release tag. Give each environment its own artifact path and OCIRepository, so a rollback in production moves one tag and leaves every other environment alone:

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

Leave `spec.ref.tag` out of the OCIRepository you commit. The Rollout writes it with server-side apply and without forcing ownership. If Git or another tool also sets it, the Rollout writes nothing for that deploy and reports `Ready=False` with reason `OCIRepositoryFieldConflict`, naming the other writer. Remove the tag from Git, and the Rollout deploys at its next retry, within a minute. Until then an OCIRepository without a tag fetches `latest`, so suspend it (`flux suspend source oci hello-world -n hello-world`) while you change Git, and resume it once the Rollout has written the tag. Other `spec.ref` fields stay yours, but Flux prefers `digest` and `semver` over `tag`, so leave those out too.

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

## Report HelmRelease health

A `HealthCheck` with class `helmrelease` reports the health of one HelmRelease:

```yaml {filename="healthcheck-helm.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: HealthCheck
metadata:
  name: hello-world-helm
  namespace: hello-world
  labels:
    app: hello-world  # the Rollout selects this
  annotations:
    healthcheck.kuberik.com/helmrelease: "hello-world"
spec:
  class: helmrelease
```

The check stays `Pending` until helm-controller has acted on the HelmRelease's current generation, so a `Ready` left over from the previous release never starts the bake. It turns `Unhealthy` as soon as the current release fails (for example `UpgradeFailed`, or `RollbackSucceeded` after Helm remediated), without waiting for Helm's retries to run out, and `Healthy` when `Ready` is `True` for the release the Rollout deployed. Set `upgrade.remediation.retries: 1` so Helm's own rollback is a safety net and the Rollout's bake decides.

## How it works

{{< fig id="flux-propagation" caption="The Rollout picks a release from the ReleaseSource and writes its tag into Flux; Flux applies it, and the Kustomization's health comes back as a HealthCheck." >}}

The ReleaseSource lists releases from the registry. When the Rollout picks a release, it writes the tag with server-side apply into the OCIRepository's `spec.ref.tag`, the substitute variable, the HelmRelease value or the chart version, under a field manager of its own, `rollout-controller/<namespace>/<name>`, so two Rollouts can each own a variable on one Kustomization or a value on one HelmRelease. Tags, variables and values written by the shared `rollout-controller` manager of earlier versions move to the Rollout's own manager at its next deploy. Flux then reconciles as usual. When the tag moves on an OCIRepository, the `kustomization` and `helmrelease` checks stay `Pending` until Flux has fetched the new artifact and applied it, so the bake never starts on the previous release.

![The Health checks card, 3/3 healthy with the Flux Deployment check passing, above the Resources card: 2/2 ready, hello-world, 1/1 ready, and one more ready resource folded](/images/docs/integrations/fluxcd-health-resources.png)

## Troubleshoot

| Symptom | Cause | Fix |
|---|---|---|
| The Kustomization substitute never changes | The annotation value is not the Rollout's name, or the Kustomization is in another namespace | Set `rollout.kuberik.com/substitute.<variable>.from` to the exact Rollout name, in the Rollout's namespace |
| The Rollout has no releases | The ReleaseSource cannot reach the registry (`SourceReachable` is `False`) | Run `kubectl -n hello-world describe releasesource hello-world` and check the image path and `spec.oci.secretRef` |
| HealthCheck `Pending`: `Kustomization not found` | Wrong name in `healthcheck.kuberik.com/kustomization` | Use the Kustomization's name, or `<namespace>/<name>` if it lives in another namespace |
| HealthCheck stays `Pending`: `Kustomization has no managed resources` | The Kustomization has not applied anything yet, or its inventory is empty | Check the Kustomization with `flux get kustomizations -n hello-world` |
| Rollout `Ready=False`: `KustomizationFieldConflict` | Git or another tool also sets the substitute variable the Rollout writes | Remove the variable from the Kustomization in Git; keep the default in the manifests (`${APP_VERSION:=1.0.0}`) |
| Rollout `Ready=False`: `OCIRepositoryFieldConflict` | Git or another tool also sets the OCIRepository's `spec.ref.tag` | Remove `spec.ref.tag` from the OCIRepository in Git |
| Rollout `Ready=False`: `HelmReleaseFieldConflict` | Git or another tool also sets the HelmRelease field the Rollout writes | Remove the field from the HelmRelease in Git; keep the default in the chart's `values.yaml` |
| Rollout `Ready=False`: `HelmReleaseInvalidAnnotation` | A `values.<path>.from` path has an empty key, or `chart-version.from` is on a HelmRelease with `spec.chartRef` or without `spec.chart.spec` | Fix the path; for `spec.chartRef`, annotate the OCIRepository instead |
| An annotated HelmRelease never changes, and `helmrelease` checks never leave their first state | The controller lacks RBAC on `helmreleases`, or Flux's HelmRelease CRD was installed after the controller started | Upgrade the chart, then restart the rollout-controller Deployment |
| HealthCheck `Unhealthy`: `HelmRelease not found` | Wrong name in `healthcheck.kuberik.com/helmrelease` | Use the HelmRelease's name, or `<namespace>/<name>` |
| With `wait: true`, a fixed release waits for the failed one to time out | kustomize-controller runs without `CancelHealthCheckOnNewRevision` | Enable the feature gate (Flux 2.7 or later), or set `wait: false` |

### The conflict names another Rollout

The `KustomizationFieldConflict`, `HelmReleaseFieldConflict` or `OCIRepositoryFieldConflict` message names a manager `rollout-controller/<namespace>/<rollout>` when you moved the annotation from one Rollout to another. The first Rollout still owns the field and never lets go of it on its own. Release it with a server-side apply under that manager, of a body without the field; the new Rollout writes the field at its next retry. Keep in the body any other variable or value the first Rollout still writes on that object.

```bash {filename="Terminal"}
kubectl apply --server-side --field-manager=rollout-controller/hello-world/hello-world-old -f - <<'EOF'
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: hello-world
  namespace: hello-world
EOF
```

### The version reverts after a deploy

The Kustomization in Git started setting the Rollout's substitute key after the Rollout last deployed. Flux applies the Git copy at its next interval and takes the key back; the Rollout refuses its next deploy with `KustomizationFieldConflict`, but until then nothing reports the revert. The cluster then runs the Git value while the Rollout and the dashboard show the deployed one. Compare the two tags; in the field owners, the `manager:` line right after `f:APP_VERSION` reads `kustomize-controller` when Git owns the key.

```bash {filename="Terminal"}
kubectl -n hello-world get kustomization hello-world -o jsonpath='{.spec.postBuild.substitute.APP_VERSION}{"\n"}'
kubectl -n hello-world get rollout hello-world -o jsonpath='{.status.history[0].version.tag}{"\n"}'
kubectl -n hello-world get kustomization hello-world -o yaml --show-managed-fields | grep -E 'manager:|f:APP_VERSION'
```

Without the key, substitution renders the `${APP_VERSION:=1.0.0}` default, so suspend the Kustomization before you change Git. The parent Kustomization, which applies this one from Git, applies only the fields in Git, so the suspend holds unless Git sets `spec.suspend`.

```bash {filename="Terminal"}
flux suspend kustomization hello-world -n hello-world
```

Remove `APP_VERSION` from the Kustomization in Git and wait until the parent has applied that (the first `jsonpath` command under the symptom prints nothing); `flux reconcile kustomization flux-system --with-source` hurries a bootstrapped parent. Put back the tag the second `jsonpath` command printed, under the Rollout's own field manager, then resume; the Rollout keeps the key from its next deploy on.

```bash {filename="Terminal"}
kubectl -n hello-world patch kustomization hello-world --type merge --field-manager=rollout-controller/hello-world/hello-world \
  -p '{"spec":{"postBuild":{"substitute":{"APP_VERSION":"<deployed-tag>"}}}}'
flux resume kustomization hello-world -n hello-world
```

## Next steps

{{< next "/docs/gates/health-checks/" "/docs/concepts/propagation/" "/docs/gates/approvals/" >}}
