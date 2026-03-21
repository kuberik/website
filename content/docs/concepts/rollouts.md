---
title: "Rollouts"
weight: 2
---

A **Rollout** is the central resource in Kuberik. It tracks container image versions and orchestrates their deployment through a controlled lifecycle.

## What is a Rollout?

A Rollout watches a FluxCD `ImagePolicy` for new container image tags. When a new version is detected, the Rollout:

{{% steps %}}

### Creates a Release Candidate
The new version becomes a pending release waiting for evaluation.

### Evaluates Gates
All [gating conditions](#gating-process) must pass before deployment begins.

### Updates Deployment
Updates the deployment via Flux **Kustomization substitution**.

### Monitors Health
Continuously [monitors health checks](#verification-cycle) during the bake period.

### Marks Status
The version is marked as succeeded or failed based on health results.

{{% /steps %}}

## Rollout Resource

```yaml {filename="rollout-structure.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: Rollout
metadata:
  name: my-app
  namespace: default
spec:
  # Watch this ImagePolicy for new versions
  releasesImagePolicy:
    name: my-app

  # How many versions to keep in history
  versionHistoryLimit: 5

  # Stabilization period after deployment
  bakeTime: 15m

  # Select which HealthChecks to evaluate
  healthCheckSelector:
    selector:
      matchLabels:
        app: my-app
```

## Key Fields

| Field | Purpose |
|-------|---------|
| `releasesImagePolicy` | Reference to the FluxCD ImagePolicy that provides new versions |
| `versionHistoryLimit` | How many past versions to retain in status |
| `bakeTime` | Duration to wait and verify health after deployment (e.g., `5m`, `1h`) |
| `healthCheckSelector` | Label selector to find HealthCheck resources to evaluate |

## Rollout Status

The Rollout's status shows the current state:

```bash
kubectl get rollout my-app -o yaml
```

Key status fields:
- `currentVersion` — The actively deployed version
- `pendingVersion` — A version waiting for gates to pass
- `history` — Timeline of past deployments with outcomes

## Gating Process

Before a rollout begins, it must pass all defined gates. This flow ensures human or automated approvals:

```mermaid
flowchart TD
    %% Styles
    classDef state fill:#E5E7EB,stroke:#374151,stroke-width:1px,color:#374151
    classDef decision fill:#FCD34D,stroke:#D97706,stroke-width:2px,color:#374151
    classDef success fill:#34D399,stroke:#059669,stroke-width:2px,color:#fff
    classDef failure fill:#EF4444,stroke:#B91C1C,stroke-width:2px,color:#fff

    Start(New Release) --> Check{Check Gates}:::decision
    Check -->|All Pass| Approved(Approved):::success
    Check -->|Pending| Wait(Wait 10s):::state
    Wait --> Check
    Check -->|Deny| Rejected(Rejected):::failure

    Approved --> Deploy(Deploy Version):::state
    Rejected --> Stop(Stop Rollout):::failure
```

## Verification Cycle

During the **bake time**, Kuberik continuously verifies health:

```mermaid
sequenceDiagram
    participant Rollout
    participant Bake Timer
    participant HealthCheck
    participant Kustomization

    Rollout->>Bake Timer: Start bake period (5m)
    loop Every 30s
        Bake Timer->>HealthCheck: Evaluate
        HealthCheck->>Kustomization: Check Ready condition
        Kustomization-->>HealthCheck: Ready: True/False
        HealthCheck-->>Bake Timer: Pass/Fail
    end
    alt All checks pass
        Bake Timer->>Rollout: Mark succeeded
    else Any check fails
        Bake Timer->>Rollout: Mark failed
    end
```

## Sequential Processing

{{< callout type="important" >}}
**One Version at a Time**

Kuberik processes **one version at a time**. If version `v1.2.0` is baking and `v1.3.0` is detected:

1. `v1.3.0` becomes a pending release
2. It waits until `v1.2.0` completes (success or failure)
3. Then `v1.3.0` begins its own lifecycle

This prevents deployment storms and ensures each version gets proper verification.
{{< /callout >}}

## Related Guides

- [Getting Started](/docs/getting-started/) — Set up your first Rollout
- [Health Checks](/docs/guides/health-checks/) — Configure verification
- [Manual Approvals](/docs/guides/manual-approvals/) — Add approval gates
- [Deployment Schedules](/docs/guides/schedules/) — Control deployment time windows
