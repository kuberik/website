---
title: "Install with kubectl"
description: "Apply the controllers' release manifests with kubectl when you manage controllers without Helm."
type_: guide
icon: command-line
weight: 30
---

Install the Kuberik controllers by applying their release manifests with `kubectl`. The [Helm chart](/docs/installation/helm/) installs the same controllers plus the dashboard in one release; use this page when you manage controllers without Helm.

Before you start, you need `kubectl` access with rights to create CRDs, and Flux 2.7 or later in the cluster ([install Flux](https://fluxcd.io/flux/installation/)): Kuberik picks the version and [Flux](/docs/integrations/fluxcd/) applies it. The released rollout-controller does not start without Flux's `ImagePolicy` CRD (`image.toolkit.fluxcd.io/v1`), and a default `flux install` leaves out the image-reflector-controller that serves it. Add it:

```bash {filename="Terminal"}
flux install --components-extra=image-reflector-controller
```

{{< callout type="important" >}}
These manifests are the released controllers. `ReleaseSource` and `spec.releaseSourceRef`, which [Deploy Your First App](/docs/getting-started/) uses, need the next releases {{< needs "Next release" >}}.
{{< /callout >}}

## Install the rollout-controller

The rollout-controller runs every `Rollout`. Apply its {{< param "rollout_controller_version" >}} release manifest:

```bash {filename="Terminal"}
kubectl apply --server-side -f https://github.com/kuberik/rollout-controller/releases/download/{{< param "rollout_controller_version" >}}/install.yaml
```

The manifest creates the `kuberik-system` namespace, the CRDs and the `rollout-controller-controller-manager` Deployment.

## Install the release-controller

Rollouts read their releases from `ReleaseSource` objects, which the release-controller serves. It has no release manifest yet {{< needs "Next release" >}}: install it with the [Helm chart](/docs/installation/helm/), or build it from [its repository](https://github.com/kuberik/release-controller#install).

## Add integration controllers

Each integration is a separate controller. Install only the ones you use; the linked page names the version it needs.

| Controller | Adds | Install from |
|---|---|---|
| openkruise-controller | Canary steps with OpenKruise Rollout | [Roll Out with a Canary](/docs/releases/canary/) |
| datadog-controller | Datadog monitors and incidents as health checks | [Datadog](/docs/integrations/datadog/) |
| environment-controller | Promotion across clusters through GitHub deployments | No release manifest yet for the version [GitHub](/docs/integrations/github/) describes {{< needs "Next release" >}}: build it from [its repository](https://github.com/kuberik/environment-controller) |

## Install everything from one bundle

The kuberik repository keeps a kustomize bundle with the rollout-controller and the three integration controllers, at the versions chart 0.7.0 ships: rollout-controller v0.9.2, older than the {{< param "rollout_controller_version" >}} step above. Comment out the integrations you do not use in a local copy, or apply it whole. Apply it server-side: openkruise-controller's `RolloutTest` CRD is larger than the 256 KiB annotation that client-side `kubectl apply` writes.

```bash {filename="Terminal"}
kubectl apply --server-side -k https://github.com/kuberik/kuberik/config/install
```

## Check the result

Wait for the controller to become ready:

```bash {filename="Terminal"}
kubectl -n kuberik-system rollout status deployment/rollout-controller-controller-manager
```

```text {filename="Output"}
deployment "rollout-controller-controller-manager" successfully rolled out
```

## Next steps

{{< next "/docs/getting-started/" "/docs/integrations/fluxcd/" >}}
