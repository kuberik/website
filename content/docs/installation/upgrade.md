---
title: "Upgrade Kuberik"
description: "Upgrade an existing install to chart 0.10.0: what to change in Git first, the upgrade command, and what the new release adds."
type_: guide
weight: 25
---

Upgrade a running install to chart 0.10.0 without a refused deploy. Two changes need you before or right after the upgrade: Kustomization variables the Rollout writes must leave Git, and every Rollout needs a ReleaseSource.

The chart and the controllers it installs upgrade together. If you installed with kubectl, apply each controller's new install manifest as in [Install with kubectl](/docs/installation/manual/) instead of `helm upgrade`, and make the same changes in Git.

## Check what changes

| Change | What you do |
|---|---|
| A Rollout writes its Kustomization variable without forcing ownership, so Git must not set it | [Remove the Rollout's variables from Git](#remove-the-rollouts-variables-from-git) |
| Rollouts read releases only from a `ReleaseSource`; `spec.releasesImagePolicy` is ignored | [Give every Rollout a ReleaseSource](#give-every-rollout-a-releasesource) |
| New CRDs: `ApprovalPolicy`, `ClusterApprovalPolicy`, `RolloutApproval`, `ReleaseSource`, `ReleaseSlice`, and new fields on `Rollout` and `HealthCheck` | Nothing: `helm upgrade` installs them |
| The release-controller is on by default | Nothing |
| The rollout-controller may `patch` Flux `HelmReleases` | Nothing with the chart; with kubectl, apply the new rollout-controller manifest |
| Approval admission policies, served from Kubernetes 1.30 | Nothing: on an older cluster the chart leaves them out, and the name on an approval is not verified |
| A build whose bake failed on a Rollout is held there and not redeployed automatically | Nothing; [Release a held build](/docs/releases/rollback/#release-a-held-build) to try it again |
| Hand-made approval gates can move to `ApprovalPolicy` | Optional: [Move hand-made approval gates](#move-hand-made-approval-gates) |

## Remove the Rollout's variables from Git

A Rollout now writes its `postBuild.substitute` variable under its own field manager, `rollout-controller/<namespace>/<rollout>`, and no longer takes the field from other writers. If the Kustomization you commit also sets that variable, often as a first value such as `APP_VERSION: "1.0.0"`, the Rollout refuses its next deploy with `Ready=False`, reason `KustomizationFieldConflict`, and names the variable and the other writer. Nothing that already runs changes.

Find the Kustomizations in Git that set a variable named in one of their own `rollout.kuberik.com/substitute.<VAR>.from` annotations. Remove the variable and give the manifests a default instead:

```yaml {filename="deploy/production/deployment.yaml"}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-world
  namespace: hello-world
spec:
  selector:
    matchLabels:
      app: hello-world
  template:
    metadata:
      labels:
        app: hello-world
    spec:
      containers:
        - name: hello-world
          image: ghcr.io/acme/hello-world:${APP_VERSION:=1.0.0}  # default until the first deploy
```

When Flux applies a Kustomization without the variable, substitution renders that default, which can roll the app back to it. Suspend the Kustomization while you change Git, then put the deployed tag back under the Rollout's field manager, as in [The version reverts after a deploy](/docs/integrations/fluxcd/#the-version-reverts-after-a-deploy). Keep one other key in `postBuild.substitute`, or Flux turns substitution off ([Set a Kustomization substitute](/docs/integrations/fluxcd/#set-a-kustomization-substitute)).

Variables that earlier versions wrote under the shared `rollout-controller` manager move to the Rollout's own manager at its next deploy; you do nothing for those. The same rule holds for HelmRelease values the Rollout writes, with reason `HelmReleaseFieldConflict`.

## Give every Rollout a ReleaseSource

A Rollout without `spec.releaseSourceRef` deploys nothing new and reports [No release source](/docs/operate/troubleshooting/#no-release-source). Write a [ReleaseSource](/docs/releases/publish/) for each app. To keep the Flux `ImagePolicy` you already run, point the ReleaseSource at it:

```yaml {filename="releasesource.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: ReleaseSource
metadata:
  name: hello-world
  namespace: hello-world
spec:
  oci:
    imagePolicyRef:
      name: hello-world  # an existing Flux ImagePolicy
```

The kind exists once the chart is upgraded, so apply it and set `releaseSourceRef` right after the upgrade, in the next section. Keep the `ImagePolicy` and its `ImageRepository` while a ReleaseSource reads them.

## Upgrade the chart

```bash {filename="Terminal"}
helm repo update kuberik
helm upgrade kuberik kuberik/kuberik --version 0.10.0 --namespace kuberik-system -f values.yaml
kubectl apply -f releasesource.yaml
kubectl patch rollout hello-world -n hello-world --type merge \
  -p '{"spec":{"releaseSourceRef":{"name":"hello-world"}}}'
```

The upgrade installs the new CRDs, the release-controller, the `helmreleases` permission, the `kuberik-rollout-approver` ClusterRole and, from Kubernetes 1.30, the approval admission policies, and moves every controller to the release that ships with chart 0.10.0. That includes the openkruise-controller release that ships with the chart, which clears stale conditions when a RolloutTest goes back to waiting for its step; if you install the openkruise-controller on its own, upgrade it at the same time.

Coming from chart 0.6.1 or earlier, hand the CRDs to the release once first, as in [Install with Helm](/docs/installation/helm/#upgrade), or Helm stops with `invalid ownership metadata`. After a [production install](/docs/installation/helm/#use-the-production-values), pull the chart again and upgrade with the namespace and values file that page gives.

Deploys made before the upgrade carry no `deployKind`, so their failure never [rolls back automatically](/docs/releases/rollback/). The first deploy after the upgrade does.

## Move hand-made approval gates

Approval gates you wrote by hand as RolloutGates keep working. To move them under an [ApprovalPolicy](/docs/gates/approvals/), turn the versions each gate allows into RolloutApprovals with the rollout-controller's `hack/migrate-approval-gates.sh`. It needs `kubectl`, `jq` and `sha256sum`, and without flags it only prints what it would create:

```bash {filename="Terminal"}
git clone https://github.com/kuberik/rollout-controller
cd rollout-controller
hack/migrate-approval-gates.sh                         # dry run
hack/migrate-approval-gates.sh --apply                 # create the RolloutApprovals
hack/migrate-approval-gates.sh --emit-manifests ./approvals  # or write YAML for Git
```

Read the dry run first: a kill-switch gate can look like an approval gate. Then add an `ApprovalPolicy` that selects the Rollout, check that its `approval-gate-<suffix>` gate lists the same versions, and delete the old gate.

## Check the result

```bash {filename="Terminal"}
helm list -n kuberik-system
kubectl get rollouts -A -o jsonpath='{range .items[*]}{.metadata.namespace}/{.metadata.name} {.spec.releaseSourceRef.name} {.status.conditions[?(@.type=="Ready")].reason}{"\n"}{end}'
```

Every Rollout names a source, and none reads `KustomizationFieldConflict`, `HelmReleaseFieldConflict` or `ReleaseSourceRequired`.

## Troubleshoot

| Symptom | Cause | Fix |
|---|---|---|
| `Ready=False`: `KustomizationFieldConflict` | Git still sets the variable the Rollout writes | [Remove the Rollout's variables from Git](#remove-the-rollouts-variables-from-git) |
| The conflict names `rollout-controller/<namespace>/<rollout>` | The annotation moved to another Rollout and the first still owns the field | [The conflict names another Rollout](/docs/integrations/fluxcd/#the-conflict-names-another-rollout) |
| `ReleasesUpdated=False`: `ReleaseSourceRequired` | The Rollout has no `releaseSourceRef` | [Give every Rollout a ReleaseSource](#give-every-rollout-a-releasesource) |
| `helm upgrade` fails with `invalid ownership metadata` | The CRDs were installed outside this release | Adopt them as in [Install with Helm](/docs/installation/helm/#upgrade) |

## Next steps

{{< next "/docs/releases/rollback/" "/docs/integrations/fluxcd/" "/docs/gates/approvals/" >}}
