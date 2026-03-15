---
title: "Installation"
weight: 1
sidebar:
  open: true
---

Install Kuberik in your Kubernetes cluster.

## Resource Reconciler

Kuberik relies on a resource reconciler to apply manifests to your cluster.

{{< tabs >}}
  {{< tab name="FluxCD" >}}
  Install [FluxCD](https://fluxcd.io/flux/installation/) v2.0+:

  ```bash
  flux check
  ```

  See [FluxCD Integration](/docs/integrations/fluxcd/) for configuration details.
  {{< /tab >}}

  {{< tab name="Argo CD" disabled=true >}}
  Argo CD support is planned but not yet available.
  {{< /tab >}}
{{< /tabs >}}

---

## Install Kuberik Controller

Deploy the rollout controller ({{% param rollout_controller_version %}}):

```bash
kubectl apply -f https://github.com/kuberik/rollout-controller/releases/download/{{% param rollout_controller_version %}}/install.yaml
```

**Verify:**

```bash
kubectl get pods -n kuberik-system
# rollout-controller-xxxxx   1/1     Running
```

---

## Optional Controllers

### OpenKruise Controller ({{% param openkruise_controller_version %}})
Enables canary deployments and advanced traffic shifting.

```bash
kubectl apply -f https://github.com/kuberik/openkruise-controller/releases/download/{{% param openkruise_controller_version %}}/install.yaml
```

See [FluxCD Integration](/docs/integrations/fluxcd/) for image automation setup.

### Datadog Controller ({{% param datadog_controller_version %}})
Uses Datadog monitors as health check sources during rollouts.

```bash
kubectl apply -f https://github.com/kuberik/datadog-controller/releases/download/{{% param datadog_controller_version %}}/install.yaml
```

See [Datadog Integration](/docs/integrations/datadog/) for monitor configuration.

### Environment Controller ({{% param environment_controller_version %}})
Coordinates multi-cluster promotions via GitHub Environments and Deployments APIs.

```bash
kubectl apply -f https://github.com/kuberik/environment-controller/releases/download/{{% param environment_controller_version %}}/install.yaml
```

See [GitHub Integration](/docs/integrations/github/) for setup.
