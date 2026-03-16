---
title: "Publishing Releases"
weight: 5
---

Kuberik orchestrates the delivery of your releases — but **you** decide when and how to release. A release is triggered when a new container image tag appears in the registry. Your CI pipeline controls that.

This guide shows how to publish tagged container images that Kuberik can pick up automatically.

## GitHub Workflow

Build your Dockerfile, tag it, and push it to a registry (e.g., GHCR).

### Strategy 1: Timestamp (Recommended)

Triggers on every commit to `main`, producing a new image tag that Kuberik rolls out immediately.
Uses an `alphabetical` (ascending) policy in Flux.

```yaml {filename=".github/workflows/build-main.yaml"}
name: Build

on:
  push:
    branches:
      - "main"

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

      - name: Log in to the Container registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            # Tag with: main-<sha>-<timestamp>
            type=raw,value=main-{{sha}}-{{date 'X'}}
            type=raw,value=latest
          # Set OCI annotations on the manifest index
          annotations: |
            org.opencontainers.image.source=${{ github.event.repository.html_url }}
            org.opencontainers.image.revision=${{ github.sha }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          annotations: ${{ steps.meta.outputs.annotations }}
```

### Strategy 2: Semantic Versioning

Triggers rollouts via **git tags** (e.g., `v1.0.0`). You control the release cadence explicitly.

```yaml {filename=".github/workflows/release.yaml"}
name: Release

on:
  push:
    tags:
      - "v*"

# ... (env and setup steps same as above) ...

      - name: Extract metadata (tags, labels)
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
          # Set OCI annotations on the manifest index
          annotations: |
            org.opencontainers.image.source=${{ github.event.repository.html_url }}
            org.opencontainers.image.revision=${{ github.sha }}

# ... (build step same as above) ...
```

## Matching Policies

Ensure your Flux `ImagePolicy` matches the tagging strategy used above.

**For Timestamp (Recommended):**
```yaml {filename="policy-timestamp.yaml"}
spec:
  policy:
    alphabetical:
      order: asc # Kuberik picks the last one (highest timestamp)
  filterTags:
    pattern: '^main-[a-f0-9]+-(?P<ts>[0-9]+)'
    extract: '$ts'
```

**For SemVer:**
```yaml {filename="policy-semver.yaml"}
spec:
  policy:
    semver:
      range: ">=1.0.0"
```
