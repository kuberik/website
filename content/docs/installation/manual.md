---
title: "Install with kubectl"
description: "Apply the controllers' release manifests with kubectl when you manage controllers without Helm."
type_: guide
icon: command-line
weight: 15
---

Install the Kuberik controllers by applying their release manifests with `kubectl`. The [Helm chart](/docs/installation/helm/) installs the same controllers plus the dashboard in one release; use this page when you manage controllers without Helm.

Before you start, you need Kubernetes 1.30 or later, `kubectl` access with rights to create CRDs, and Flux 2.6 or later in the cluster ([install Flux](https://fluxcd.io/flux/installation/)): Kuberik picks the version and [Flux](/docs/integrations/fluxcd/) applies it. The rollout-controller ships ValidatingAdmissionPolicies (`admissionregistration.k8s.io/v1`), which Kubernetes serves from 1.30.

## Install the rollout-controller

The rollout-controller runs every `Rollout`. Apply its latest release manifest:

```bash {filename="Terminal"}
kubectl apply --server-side -f https://github.com/kuberik/rollout-controller/releases/latest/download/install.yaml
```

The manifest creates the `kuberik-system` namespace, the CRDs and the `rollout-controller-controller-manager` Deployment.

## Install the release-controller

Rollouts read their releases from `ReleaseSource` objects, which the release-controller serves. Its manifest creates the `release-controller-system` namespace and the `release-controller-controller-manager` Deployment.

```bash {filename="Terminal"}
kubectl apply --server-side -f https://github.com/kuberik/release-controller/releases/latest/download/install.yaml
```

## Add integration controllers

Each integration is a separate controller in `kuberik-system`. Install only the ones you use; the linked page shows what each one reads.

| Controller | Adds | Manifest |
|---|---|---|
| [openkruise-controller](/docs/releases/canary/) | Canary steps with OpenKruise Rollout | `https://github.com/kuberik/openkruise-controller/releases/latest/download/install.yaml` |
| [datadog-controller](/docs/integrations/datadog/) | Datadog monitors and incidents as health checks | `https://github.com/kuberik/datadog-controller/releases/latest/download/install.yaml` |
| [environment-controller](/docs/integrations/github/) | Promotion between environments through GitHub deployments, on one cluster or many | `https://github.com/kuberik/environment-controller/releases/latest/download/install.yaml` |

Apply each one the same way, server-side: openkruise-controller's `RolloutTest` CRD is larger than the 256 KiB annotation a client-side apply writes.

```bash {filename="Terminal"}
kubectl apply --server-side -f https://github.com/kuberik/openkruise-controller/releases/latest/download/install.yaml
```

The prometheus-controller publishes no manifest; [Prometheus](/docs/integrations/prometheus/) shows how to build and deploy it.

## Check the result

Wait for the controllers to become ready:

```bash {filename="Terminal"}
kubectl -n kuberik-system rollout status deployment/rollout-controller-controller-manager
kubectl -n release-controller-system rollout status deployment/release-controller-controller-manager
```

```text {filename="Output"}
deployment "rollout-controller-controller-manager" successfully rolled out
deployment "release-controller-controller-manager" successfully rolled out
```

## Next steps

{{< next "/docs/getting-started/" "/docs/integrations/fluxcd/" >}}
