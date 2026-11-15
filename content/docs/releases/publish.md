---
title: "Publish Releases from CI"
description: "Tag images or manifest artifacts in CI so a ReleaseSource picks them up."
type_: guide
weight: 10
aliases: ["/docs/guides/publishing-releases/"]
---

Publish every build as a tagged artifact that a [`ReleaseSource`](/docs/reference/api/#releasesource) picks up as a new release. Pick one tagging scheme, publish with the matching workflow, and give the `ReleaseSource` the policy that orders those tags.

Each artifact also carries two OCI annotations: `org.opencontainers.image.revision` (the full git commit SHA) and `org.opencontainers.image.source` (the repository URL). Kuberik reads them to link a release to its commit and pull request, so `revision` must be the SHA, not a version string.

## Tag every build on main

Tag each build `main-<short sha>-<commit timestamp>` so that every commit to `main` becomes a release, ordered by when it was committed. This workflow builds the image, tags it, and annotates the image index.

```yaml {filename=".github/workflows/build-main.yaml"}
name: Build

on:
  push:
    branches:
      - main

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to the container registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        env:
          DOCKER_METADATA_ANNOTATIONS_LEVELS: index  # Kuberik reads the index
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=raw,value=main-{{sha}}-{{commit_date 'X'}}
          annotations: |
            org.opencontainers.image.source=${{ github.event.repository.html_url }}
            org.opencontainers.image.revision=${{ github.sha }}

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          annotations: ${{ steps.meta.outputs.annotations }}
```

The `ReleaseSource` keeps only tags of that shape, extracts the timestamp, and orders by it as a number, so the newest commit is the newest release.

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
        order: asc  # highest timestamp wins
```

## Tag releases by version

Publish only when someone pushes a git tag such as `v1.4.0`, when you want to choose which commits become releases. The image gets the version without the `v`: `1.4.0`.

```yaml {filename=".github/workflows/release.yaml"}
name: Release

on:
  push:
    tags:
      - "v*"

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to the container registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        env:
          DOCKER_METADATA_ANNOTATIONS_LEVELS: index  # Kuberik reads the index
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=semver,pattern={{version}}
          annotations: |
            org.opencontainers.image.source=${{ github.event.repository.html_url }}
            org.opencontainers.image.revision=${{ github.sha }}

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          annotations: ${{ steps.meta.outputs.annotations }}
```

Order these tags by semantic version. The range keeps pre-releases such as `1.5.0-rc.1` out.

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

## Publish rendered manifests

When Kuberik moves rendered manifests instead of an image tag, render each environment's overlay in CI and push it as an OCI artifact with the Flux CLI. `flux push artifact` sets the `source` and `revision` annotations from `--source` and `--revision`. This workflow pushes one artifact per environment, all with the same `main-<sha>-<timestamp>` tag.

```yaml {filename=".github/workflows/manifests-release.yaml"}
name: Manifests Release

on:
  push:
    branches:
      - main

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Resolve version
        id: v
        run: echo "version=main-${GITHUB_SHA::7}-$(git log -1 --format=%ct)" >> "$GITHUB_OUTPUT"

      - name: Install the Flux CLI
        uses: fluxcd/flux2/action@main

      - name: Log in to the container registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Render and push manifests
        env:
          VERSION: ${{ steps.v.outputs.version }}
        run: |
          set -euo pipefail
          image="${IMAGE_NAME,,}"  # ghcr.io needs lowercase
          for env in development staging production; do
            out="$(mktemp -d)"
            kustomize build "deploy/${env}" -o "$out"
            flux push artifact \
              "oci://${REGISTRY}/${image}/${env}/manifests:${VERSION}" \
              --path "$out" \
              --source="${{ github.event.repository.html_url }}" \
              --revision="${{ github.sha }}"
          done
```

Each environment's `ReleaseSource` scans its own artifact with the same timestamp policy as an image. This one is for production:

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
        order: asc  # highest timestamp wins
```

The Flux `OCIRepository` that Kuberik drives points at the same artifact; see [Deploy Your First App](/docs/getting-started/).

## Pull from a private registry

Every scheme above works with a private registry. Point the ReleaseSource's `spec.oci.secretRef` at a `kubernetes.io/dockerconfigjson` Secret in its namespace.

```bash {filename="Terminal"}
kubectl create secret docker-registry ghcr-pull -n hello-world \
  --docker-server=ghcr.io --docker-username=<your-user> --docker-password=<your-token>
kubectl patch releasesource hello-world -n hello-world --type merge \
  -p '{"spec":{"oci":{"secretRef":{"name":"ghcr-pull"}}}}'
```

For rendered manifests, the Flux OCIRepository pulls the artifact itself and takes the same Secret in its `spec.secretRef`.

```bash {filename="Terminal"}
kubectl patch ocirepository hello-world -n hello-world --type merge \
  -p '{"spec":{"secretRef":{"name":"ghcr-pull"}}}'
```

## Check the result

After the workflow runs, the `ReleaseSource` lists the new tag as its newest release, with the commit it read from the annotations.

```bash {filename="Terminal"}
kubectl get releasesource -n hello-world hello-world -o jsonpath='{.status.newest}'
```

```json {filename="Output"}
{"created":"2026-11-13T15:20:00Z","revision":"3f9c2ab0d1e84b6f9a7c5e2d4b1a8f6c3e9d0b7a","tag":"main-3f9c2ab-1794583200"}
```

On the dashboard's **Apps** page, the app's card names the newest build. Publishing only makes it a release: here a deployment window still holds it, and production is still checking its last deploy.

![The hello-world-app card on the Apps page: the newest build, 3ea2311, held by Business Hours Only, with development, staging and production, where production is checking](/images/docs/releases/publish-newest.png)

If the tag is missing, compare it with `filterTags.pattern`: tags that do not match are not releases. If `revision` is missing, the annotations were written to the per-platform manifests instead of the image index.

## Troubleshoot

The ReleaseSource reports its state in `Ready`, `SourceReachable` and `Syncing`.

```bash {filename="Terminal"}
kubectl get releasesource hello-world -n hello-world \
  -o jsonpath='{range .status.conditions[*]}{.type}{"\t"}{.status}{"\t"}{.reason}{"\t"}{.message}{"\n"}{end}'
```

| Symptom | Cause | Fix |
|---|---|---|
| `Ready=False`, reason `ConfigInvalid` | The spec cannot be used. The message names the field. | Fix the spec and apply it again. |
| `SourceReachable=False`, reason `Unreachable`, with `Ready=True`, reason `Stale` | The registry did not answer. The last catalogue is still served. | Check the image path and registry credentials. |
| `Ready=False`, reason `SourceUnreachable` | The registry failed for three sync intervals, or no catalogue exists yet. | Check the image path and registry credentials. |
| `Syncing=True`, reason `ResolveBudget` | Tags are still being resolved. The message counts them. | Wait. |
| A tag is missing | The tag was skipped, or its metadata was rejected or could not be resolved. Events `TagsSkipped`, `MetadataRejected` and `TagUnresolvable` name it. | Read the Events below. |

```bash {filename="Terminal"}
kubectl events -n hello-world --for releasesource/hello-world
```

## Next steps

{{< next "/docs/getting-started/" "/docs/concepts/propagation/" "/docs/releases/promote/" >}}
