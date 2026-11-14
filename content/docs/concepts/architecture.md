---
title: "How Kuberik Works"
description: "The controllers, the resources they own, and how a release travels from registry to cluster."
type_: concept
weight: 10
---

See which Kuberik resources take part in a release, how they connect to Flux, and what happens to a build from discovery to verification.

## System Overview

```mermaid
flowchart TB
    %% Styles
    classDef flux fill:#2D7E9D,stroke:#fff,stroke-width:2px,color:#fff
    classDef kuberik fill:#4B4BE8,stroke:#fff,stroke-width:2px,color:#fff
    classDef workload fill:#E5E7EB,stroke:#374151,stroke-width:1px,color:#374151
    classDef boundary fill:#F3F4F6,stroke:#D1D5DB,stroke-width:1px,color:#374151,stroke-dasharray: 5 5

    subgraph Cluster ["Cluster Scope"]
        direction TB

        subgraph FluxCD ["FluxCD Layer"]
            direction TB
            OCIR[OCIRepository]:::flux
            KS[Kustomization]:::flux
        end

        subgraph Kuberik ["Kuberik Control Plane"]
            direction TB
            RS[ReleaseSource]:::kuberik
            RO[Rollout]:::kuberik
            ENV[Environment]:::kuberik
            HC[HealthCheck]:::kuberik
            RG[RolloutGate]:::kuberik
        end

        DEP[Workload]:::workload
    end

    %% Flows
    RS --> RO
    RO --> ENV

    %% Connections
    OCIR --> KS
    KS --> DEP
    RO -.->|Substitutes Version| KS
    RO -.->|Moves Tag| OCIR
    HC --> RO
    RG --> RO

    %% Subgraph Styling
    class FluxCD,Kuberik boundary
```

## Component Roles

| Component | Purpose |
|-----------|---------|
| **Rollout** | The core state machine. Reads the releases a `ReleaseSource` discovers and orchestrates releases. Drives either a `Kustomization` substitution or an `OCIRepository` tag. |
| **ReleaseSource** | Lists the tags of an OCI repository, orders them by a policy and keeps the catalogue of releases (served by the release-controller). A Rollout points at one with `spec.releaseSourceRef`. |
| **Environment** | Maps a Rollout to a logical target (e.g. "production") and syncs status to external backends (GitHub). |
| **HealthCheck** | Reports health from a Flux `Kustomization` or from Datadog monitors. The Rollout reads it before and during the bake. |
| **RolloutGate** | Holds builds until it allows them: written by hand, or by schedules, approval policies, service dependencies and Environments. |

![One rollout in the dashboard: the running build, its deployment pipeline, the health checks it watches and the resources it manages](/screenshots/dashboard/overview.png)

## The Release Lifecycle

{{% steps %}}

### Discovery

A `ReleaseSource` finds a new tag in the OCI repository and adds it to its catalogue of releases. The Rollout lists every release newer than the deployed one in `status.candidates`.

### Gating

`RolloutGates` are evaluated. If any gate does not allow the build, the build waits until a gate changes.

### Execution

Kuberik updates the Flux source it owns: a substitution variable on a `Kustomization`, or the tag on an `OCIRepository`. Flux applies the changes. See [Propagation Modes](/docs/concepts/propagation/).

### Bake Time

Once every selected health check is healthy, Kuberik waits for `bakeTime` and watches for errors.

### Verification

`HealthChecks` report continuously, and the deploy ends with one bake status:

- {{< badge content="Succeeded" color="green" >}} No health check reported an error since the deploy, and the bake ran its full `bakeTime`. Downstream environments can now admit the build through their gates.
- {{< badge content="Failed" color="red" >}} A health check reported an error. The build keeps running and further automatic deploys are held until someone acts; see [When a Bake Fails](/docs/concepts/rollouts/#when-a-bake-fails).

{{% /steps %}}
