---
title: "Building Images"
weight: 5
---

Automate the publishing of tagged container images using GitHub Actions.

## GitHub Workflow

This workflow builds your Dockerfile, tags it, and pushes it to a registry (e.g., GHCR). It includes OpenContainers annotations to link the image back to the source code.

### Strategy 1: Timestamp (Recommended)

This strategy triggers on every commit to `main`, triggering immediate rollouts for continuous delivery.
It uses an `alphabetical` (ascending) policy in Flux.

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

Use this if you prefer to trigger rollouts via **git tags** (e.g., `v1.0.0`).

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
