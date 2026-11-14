---
title: "Require a Manual Approval"
linkTitle: "Manual Approvals"
description: "Hold a deploy until a person approves it."
type_: guide
weight: 20
---

Hold every new build of a Rollout until a person approves it, with a `RolloutGate` that lists the approved versions.

## Create a gate

```yaml {filename="gate.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: RolloutGate
metadata:
  name: production-approval
  namespace: hello-world
  annotations:
    gate.kuberik.com/pretty-name: "Production Approval"
    gate.kuberik.com/description: "Requires sign-off before production deploy"
spec:
  rolloutRef:
    name: hello-world
  allowedVersions: []  # holds every build until you add one
```

With an empty `allowedVersions` list the gate holds every new build: after its first deploy, the Rollout keeps running its current version until you approve a newer one. A gate without `allowedVersions` holds nothing, so keep the empty list.

## Approve a version

{{< callout type="info" >}}
Pick one place to approve from. When Flux applies the gate from Git, Flux owns `allowedVersions` and puts the list back to what Git says on its next reconcile, so approve in Git. To approve with `kubectl patch`, apply the gate once with `kubectl apply` and keep it out of your Flux sources.
{{< /callout >}}

{{< tabs >}}
  {{< tab name="Dashboard" >}}
  Open the Rollout in the Kuberik Dashboard. Held builds are listed under **Newer builds**; the `HELD` chip names the gate that is waiting. Approve the gate through the CLI or Git so the build promotes on its own, or press **Deploy** on the build to ship it by hand. A hand deploy overrides the gate, applies immediately and records the note you type.

  ![Held builds on a rollout: the chip explains that a manual approval is pending, and Deploy ships the build by hand](/screenshots/dashboard/held-approval.png)
  {{< /tab >}}

  {{< tab name="CLI" >}}
  Add the version to the allowed list:

  ```bash {filename="Terminal"}
  kubectl -n hello-world patch rolloutgate production-approval --type=json \
    -p='[{"op": "add", "path": "/spec/allowedVersions/-", "value": "v1.2.3"}]'
  ```

  The `-` appends to the existing list, which is why the gate starts with `allowedVersions: []`.
  {{< /tab >}}

  {{< tab name="GitOps" >}}
  Commit the approved versions to your Git repository:

  ```yaml {filename="gate.yaml"}
  apiVersion: kuberik.com/v1alpha1
  kind: RolloutGate
  metadata:
    name: production-approval
    namespace: hello-world
  spec:
    rolloutRef:
      name: hello-world
    allowedVersions:
      - "v1.2.3"
      - "v1.2.4"
  ```

  Flux syncs the updated gate, and the rollout proceeds.
  {{< /tab >}}
{{< /tabs >}}

## Deploy without approval

To ship a build the gate holds, deploy it by hand or let it past the gates once:

- `rollout.kuberik.com/bypass-gates: <version>` lets one build past every gate, once. Health checks and a failed bake still hold it.
- `rollout.kuberik.com/force-deploy: <version>` deploys the build now. It skips gates, the unhealthy-check hold and the failed-bake hold, and it is what the dashboard's **Deploy** does.

[Operate a Rollout by Hand](/docs/operate/manual-actions/) covers both, along with pinning a version and recovering from a failed bake.

## Check the result

Each candidate shows whether it is through every gate and, if not, which gates hold it:

```bash {filename="Terminal"}
kubectl -n hello-world get rollout hello-world \
  -o jsonpath='{range .status.candidates[*]}{.tag}{" gated="}{.gated}{" blockedBy="}{.blockedBy}{"\n"}{end}'
```

A held build lists `production-approval` under `blockedBy`. Once you approve it, `gated` turns `true` and the Rollout deploys it, unless another gate, an `Unhealthy` health check or a failed bake still holds it.

## Next steps

- [Operate a Rollout by Hand](/docs/operate/manual-actions/): pin, deploy or bypass gates for one build
- [Deployment Schedules](/docs/guides/schedules/): hold deploys outside a time window
- [Rollouts](/docs/concepts/rollouts/): how gates, health checks and the bake decide a deploy
