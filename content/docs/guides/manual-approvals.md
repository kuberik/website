---
title: "Manual Approvals"
weight: 2
---

Use `RolloutGate` to block deployments until explicitly approved.

## Create a Gate

```yaml {filename="gate.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: RolloutGate
metadata:
  name: production-approval
  annotations:
    gate.kuberik.com/pretty-name: "Production Approval"
    gate.kuberik.com/description: "Requires sign-off before production deploy"
spec:
  rolloutRef:
    name: my-app
```

The Rollout pauses at the gating stage until the pending version is approved.

## Approve via Dashboard

Navigate to the Rollout in the Kuberik Dashboard and click **Approve** on the pending version.

## Approve via CLI

Add the version to the allowed list.

```bash
kubectl patch rolloutgate production-approval --type=json \
  -p='[{"op": "add", "path": "/spec/allowedVersions/-", "value": "v1.2.3"}]'
```

## Approve via GitOps

Commit the approved versions to your Git repository.

```yaml {filename="gate.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: RolloutGate
metadata:
  name: production-approval
spec:
  rolloutRef:
    name: my-app
  allowedVersions:
    - "v1.2.3"
    - "v1.2.4"
```

Flux syncs the updated gate, and the rollout proceeds.

## Choose One Approach

Pick one management method per gate. With SSA, Flux only manages fields it sets—so you can commit the gate to Git without `allowedVersions` and use Dashboard or CLI to approve versions without Flux reverting them.

## Force Deploy

Deploy a specific version immediately, bypassing gates.

```bash
kubectl annotate rollout my-app rollout.kuberik.com/force-deploy=v1.2.3
```

The version must be in the available releases. The annotation is automatically cleared after deployment.
