---
title: "Annotations"
description: "Every annotation Kuberik reads or writes, with its values and effect."
type_: reference
weight: 20
---

Complete reference for all Kuberik annotations.

## Rollout Annotations

A Rollout drives one of two Flux sources. See [Propagation Modes](/docs/concepts/propagation/) for how to choose. Both resources must live in the Rollout's namespace.

### Kustomization Substitution

{{< badge content="FluxCD" >}} {{< badge content="Core" >}}

Used on Flux `Kustomization` resources to link version substitution.

```yaml {filename="kustomization-annotation.yaml"}
metadata:
  annotations:
    rollout.kuberik.com/substitute.<VAR_NAME>.from: "<rollout-name>"
```

| Placeholder | Description |
|-------------|-------------|
| `<VAR_NAME>` | The variable name in `postBuild.substitute` |
| `<rollout-name>` | Name of the Rollout resource to read version from |

**Example:**

```yaml {filename="kustomization-example.yaml"}
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: my-app
  annotations:
    rollout.kuberik.com/substitute.APP_VERSION.from: "my-app-rollout"
spec:
  postBuild:
    substitute:
      APP_VERSION: "latest"  # Default, overwritten by Kuberik
```

### OCIRepository Tag

{{< badge content="FluxCD" >}} {{< badge content="Core" >}}

Used on Flux `OCIRepository` resources to hand tag ownership to a Rollout. Kuberik writes the selected version to `spec.ref.tag`.

```yaml {filename="ocirepository-annotation.yaml"}
metadata:
  annotations:
    rollout.kuberik.com/rollout: "<rollout-name>"
```

| Placeholder | Description |
|-------------|-------------|
| `<rollout-name>` | Name of the Rollout resource to read version from |

**Example:**

```yaml {filename="ocirepository-example.yaml"}
apiVersion: source.toolkit.fluxcd.io/v1
kind: OCIRepository
metadata:
  name: my-app
  annotations:
    rollout.kuberik.com/rollout: "my-app-rollout"
spec:
  interval: 60s
  url: oci://ghcr.io/my-org/my-app/production/manifests
  ref:
    tag: "1.0.0"  # Default, overwritten by Kuberik
```

---

## Rollout Action Annotations

Set these on a `Rollout` to act on it by hand. [Operate a Rollout by Hand](/docs/operate/manual-actions/) shows each one in use.

| Annotation | Value | Removed by | Effect |
|------------|-------|------------|--------|
| `rollout.kuberik.com/force-deploy` | Release tag | Controller, after that tag deploys | Deploys the tag now, skipping gates, the unhealthy health-check hold and the failed-bake hold. The tag must be in the `ReleaseSource` catalogue. `spec.wantedVersion` takes precedence. |
| `rollout.kuberik.com/deploy-message` | Free text | Controller, after the next deploy | Message of the history entry for a deploy by hand (`force-deploy` or `spec.wantedVersion`). Ignored on automatic deploys. |
| `rollout.kuberik.com/deploy-user` | User name | Controller, after the next deploy | Recorded as `triggeredBy` (kind `User`) for a deploy by hand. Ignored on automatic deploys. |
| `rollout.kuberik.com/bypass-gates` | Release tag | Controller, after the next deploy (with `bypass-gates-only`: after that tag deploys) | Lets that build past every gate once. The tag must be a release newer than the deployed one. Health checks and a failed bake still hold it. |
| `rollout.kuberik.com/bypass-gates-only` | Comma-separated `RolloutGate` names | Controller, with `bypass-gates` when that build deploys | Narrows `bypass-gates` to the named gates; the others still apply. Ignored without `bypass-gates`. Unknown names raise a `BypassGatesUnknown` warning event. {{< badge content="Next release" >}} |
| `rollout.kuberik.com/unblock-failed` | `"true"` | Controller, after the next deploy | Lets the next automatic deploy through after a failed bake. Gates and the unhealthy health-check hold still apply. |
| `rollout.kuberik.com/retry` | Any (ignored) | Controller, at once | When the latest bake status is `Failed`, resets it to `Deploying` and records `lastRetryTimestamp`; earlier health-check errors stop counting and `deployTimeout` restarts. |
| `rollouttest.kuberik.com/retry-mode` | `retry` (default) or `skip` | openkruise-controller, after the retry | Set alongside `rollout.kuberik.com/retry`: `retry` runs failed RolloutTests again, `skip` marks them `Skipped` so the canary continues. |

---

## OCI Artifact Annotations

The release-controller reads these from each release's OCI manifest (manifest annotations first, then the config descriptor's) when it adds the release to a `ReleaseSource` catalogue. Set them in CI when you push the image or artifact; [Publishing Releases](/docs/releases/publish/) shows how.

| Annotation | Value | Used for |
|------------|-------|----------|
| `org.opencontainers.image.revision` | Git commit SHA | The commit the build came from. The environment-controller uses it as the ref of the GitHub deployment, so it must be a commit in the GitHub repository. |
| `org.opencontainers.image.version` | Semantic version | The release's version. A [service dependency](/docs/gates/dependencies/) compares the provider's version against the consumer's constraint. |
| `org.opencontainers.image.created` | RFC 3339 timestamp | The release's creation time. Other formats are ignored. |
| `org.opencontainers.image.source` | Repository URL | Copied to the Rollout's `status.source`. |
| `org.opencontainers.image.title` | Text | Copied to the Rollout's `status.title`. |
| `org.opencontainers.image.description` | Text | Copied to the Rollout's `status.description`. |
| `com.kuberik.rollout.requires.<contract>` | Semver constraint (`^1.66.0`) | What this release requires of `<contract>`, checked by a `RolloutDependency`. At most 32 per image; contract name up to 64 bytes, value up to 256. |

---

## HealthCheck Annotations

### Kustomization Target

{{< badge content="Health Checks" >}}

Specifies which Flux Kustomization to monitor. The annotation only takes effect on a HealthCheck with `spec.class: kustomization`.

```yaml {filename="healthcheck.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: HealthCheck
metadata:
  name: hello-world
  namespace: hello-world
  labels:
    app: hello-world
  annotations:
    healthcheck.kuberik.com/kustomization: "hello-world"  # or "<namespace>/<name>"
    healthcheck.kuberik.com/requeue-interval: "1m"
spec:
  class: kustomization
```

| Annotation | Value | Default | Effect |
|------------|-------|---------|--------|
| `healthcheck.kuberik.com/kustomization` | `<name>` or `<namespace>/<name>` | none | The Kustomization whose health this check reports. A bare name is looked up in the HealthCheck's namespace. |
| `healthcheck.kuberik.com/requeue-interval` | Go duration (`30s`, `2m`) | `30s` | How often the check is re-evaluated. Values under `5s` count as `5s`; a value that does not parse uses the default. |

---

## RolloutGate Annotations

### Display Metadata

{{< badge content="Dashboard" >}} {{< badge content="UI" >}}

Provides human-readable information for the Dashboard UI.

```yaml {filename="gate-annotation.yaml"}
metadata:
  annotations:
    gate.kuberik.com/pretty-name: "Descriptive Gate Name"
    gate.kuberik.com/description: "Explanation for operators"
```

![How the dashboard shows them: the pretty name and description of each gate holding a build](/screenshots/dashboard/held-approval.png)

---

## OpenKruise Rollout Annotations

### Step Configuration

{{< badge content="OpenKruise" >}} {{< badge content="Canary" >}}

Used on OpenKruise `Rollout` resources to configure Kuberik's step handling.

```yaml {filename="kruise-annotation-template.yaml"}
metadata:
  annotations:
    # Timeout for step to become ready
    rollout.kuberik.io/step-<N>-ready-timeout: "10m"

    # Bake time for step verification
    rollout.kuberik.io/step-<N>-bake-time: "30s"
```

| Placeholder | Description |
|-------------|-------------|
| `<N>` | Step index (1-based) |

**Example:**

```yaml {filename="kruise-annotation-example.yaml"}
apiVersion: rollouts.kruise.io/v1beta1
kind: Rollout
metadata:
  name: my-app
  annotations:
    rollout.kuberik.io/step-1-ready-timeout: "10m"
    rollout.kuberik.io/step-1-bake-time: "30s"
    rollout.kuberik.io/step-2-bake-time: "5m"
```

---

## DatadogMonitor Annotations

### Health Check Integration

{{< badge content="Datadog" >}} {{< badge content="Monitoring" >}}

Enable Kuberik to use a DatadogMonitor as a health check source.

```yaml {filename="datadog-annotation.yaml"}
metadata:
  annotations:
    kuberik.com/health-check: "true"
```
