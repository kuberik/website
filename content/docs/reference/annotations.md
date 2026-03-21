---
title: "Annotations Reference"
weight: 2
---

Complete reference for all Kuberik annotations.

## Rollout Annotations

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

---

## HealthCheck Annotations

### Kustomization Target

{{< badge content="Health Checks" >}}

Specifies which Flux Kustomization to monitor.

```yaml {filename="healthcheck-annotation.yaml"}
metadata:
  annotations:
    healthcheck.kuberik.com/kustomization: "<kustomization-name>"
```

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
