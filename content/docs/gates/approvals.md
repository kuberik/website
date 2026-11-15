---
title: "Require a Manual Approval"
description: "Hold each new build of a Rollout until a person approves it in the dashboard or with kubectl."
type_: guide
weight: 20
aliases: ["/docs/guides/manual-approvals/"]
---

A deploy waits until a person approves the build. An [`ApprovalPolicy`](/docs/reference/api/#approvalpolicy) holds every new build of the [Rollouts](/docs/concepts/rollouts/) it selects, and a [`RolloutApproval`](/docs/reference/api/#rolloutapproval) lets one version through.

## Require an approval

Label the Rollouts that need a person, then select them with an `ApprovalPolicy` in their namespace. The label is yours to choose; the policy only matches it.

```bash {filename="Terminal"}
kubectl -n hello-world label rollout hello-world approval.kuberik.com/required=true
```

```yaml {filename="approval-policy.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: ApprovalPolicy
metadata:
  name: production-approval
  namespace: hello-world
  annotations:
    gate.kuberik.com/pretty-name: "Production approval"  # shown in the dashboard
spec:
  rolloutSelector:
    matchLabels:
      approval.kuberik.com/required: "true"
```

For each matched Rollout the controller creates one [RolloutGate](/docs/concepts/gates/) named `approval-gate-<suffix>`. Its `allowedVersions` lists the versions approved for that Rollout and nothing else, so every newer build waits. An empty `rolloutSelector` matches every Rollout in the namespace.

To require approvals across namespaces, use a [`ClusterApprovalPolicy`](/docs/reference/api/#clusterapprovalpolicy). Its `namespaceSelector` picks the namespaces; leave it out to match all of them.

```yaml {filename="cluster-approval-policy.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: ClusterApprovalPolicy
metadata:
  name: production-approval
spec:
  namespaceSelector:
    matchLabels:
      environment: production
  rolloutSelector: {}  # every Rollout there
```

{{< callout type="important" >}}
`ApprovalPolicy`, `ClusterApprovalPolicy` and `RolloutApproval` need a rollout-controller release after v0.11.0, and the kuberik Helm chart does not install them yet.
{{< /callout >}}

## Approve a build

In the [dashboard](/docs/operate/dashboard/), open the rollout's **Gates** tab and select **Approve** on the approval gate that reads **Needs you**. The dashboard creates the `RolloutApproval` as you, so your own Kubernetes permissions apply. It approves only current release candidates.

![A Needs your approval card on the dashboard Home: payments-core in production, 5 of 6 production regions, Releases when someone approves, pull request #90 by Mark Collins, and the Approve button](/images/docs/gates/approvals-approve.png "Home shows the same Approve on the card of a build that waits for you.")

With kubectl, create the `RolloutApproval` yourself. It can name a version that does not exist yet, and its `spec` cannot change once created.

```yaml {filename="approval.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: RolloutApproval
metadata:
  name: hello-world-1-4-0
  namespace: hello-world
  annotations:
    approval.kuberik.com/by: emma.clarke@acme.com  # optional, your username
spec:
  rolloutRef:
    name: hello-world
  version: 1.4.0
```

```bash {filename="Terminal"}
kubectl apply -f approval.yaml
```

The name `hello-world-1-4-0` is the one the dashboard uses for the same build, so both ways of approving land on one object. One approval satisfies every approval gate of the Rollout. To withdraw it before the build deploys, delete it:

```bash {filename="Terminal"}
kubectl -n hello-world delete rolloutapproval hello-world-1-4-0
```

## Choose who may approve

Approving means creating a `RolloutApproval`. rollout-controller ships the ClusterRole `kuberik-rollout-approver` for that, and it is not part of `edit` or `admin`: bind it per namespace.

```yaml {filename="approvers.yaml"}
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: hello-world-approvers
  namespace: hello-world
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kuberik-rollout-approver
subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: User
    name: emma.clarke@acme.com
  - apiGroup: rbac.authorization.k8s.io
    kind: User
    name: james.porter@acme.com
```

Two admission policies come with the controller and need Kubernetes 1.30 or later. `kuberik-rolloutapproval-by` rejects an `approval.kuberik.com/by` that is not the requesting user, so the name on an approval is trustworthy. The dashboard shows that name only when the cluster has the binding `kuberik-rolloutapproval-by` with the `Deny` action, because a `Warn` or `Audit` binding lets a false name through. `kuberik-approval-gate-guard` lets only the controller change an approval gate, so editing the gate's `allowedVersions` is refused.

## Know when approval is skipped

Gates never hold a Rollout's first deploy, so a brand-new Rollout does not wait for an approval. The approval gate still chooses the version: the first deploy takes the newest approved release, or the newest release when none is approved. This is intended, so the Rollout always reaches a running version.

A deploy by hand also skips the gate. Pinning a version with `spec.wantedVersion`, or **Change version** in the dashboard, deploys the build without an approval. `rollout.kuberik.com/bypass-gates` lets one build past every gate, and that deploy records no approval. [Operate a Rollout with kubectl](/docs/operate/manual-actions/) covers all three.

## Use a hand-written gate on v0.11.0

rollout-controller v0.11.0 has no approval kinds. There, write a `RolloutGate` that allows nothing and add each approved version to its list. Newer controllers still honour such a gate, and `hack/migrate-approval-gates.sh` in the rollout-controller repository turns its versions into `RolloutApproval` objects when you upgrade.

```yaml {filename="gate.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: RolloutGate
metadata:
  name: production-approval
  namespace: hello-world
spec:
  rolloutRef:
    name: hello-world
  allowedVersions: []  # holds every build
```

```bash {filename="Terminal"}
kubectl -n hello-world patch rolloutgate production-approval --type=json \
  -p='[{"op": "add", "path": "/spec/allowedVersions/-", "value": "1.4.0"}]'
```

## Check the result

The policy lists the Rollouts it matched, and its `Ready` condition reads `True` with reason `GatesSynced`:

```bash {filename="Terminal"}
kubectl -n hello-world get approvalpolicy production-approval \
  -o jsonpath='{.status.rollouts}{" "}{.status.conditions[?(@.type=="Ready")].message}{"\n"}'
```

```text {filename="Output"}
["hello-world"] 1 rollout(s) matched, gates in sync
```

A waiting build names the approval gate under `blockedBy`, and the Rollout's `GatesPassing` condition reads `False` with reason `NoAllowedVersions`:

```bash {filename="Terminal"}
kubectl -n hello-world get rollout hello-world \
  -o jsonpath='{range .status.candidates[*]}{.tag}{" gated="}{.gated}{" blockedBy="}{.blockedBy}{"\n"}{end}'
```

Once approved, the build deploys unless another gate or a health check holds it. The history entry records the approval:

```bash {filename="Terminal"}
kubectl -n hello-world get rollout hello-world -o jsonpath='{.status.history[0].approval}{"\n"}'
```

```text {filename="Output"}
{"by":"emma.clarke@acme.com","name":"hello-world-1-4-0"}
```

## Troubleshoot

### The policy's status.rollouts is empty

The selector matches no Rollout. Compare the labels:

```bash {filename="Terminal"}
kubectl -n hello-world get rollouts --show-labels
```

Add the label to the Rollout, or fix `rolloutSelector`. A `Ready=False` condition with reason `InvalidSelector` means the selector itself does not parse.

### Patching the gate fails with "only the rollout-controller may UPDATE a gate owned by an approval policy"

The gate guard refuses hand edits to approval gates. Create a `RolloutApproval` instead, as in [Approve a build](#approve-a-build).

### The dashboard reads Needs approval instead of Needs you

You may not create `RolloutApproval` objects in that namespace. Check:

```bash {filename="Terminal"}
kubectl -n hello-world auth can-i create rolloutapprovals.kuberik.com
```

If it answers `no`, ask an admin to bind `kuberik-rollout-approver` to you, as in [Choose who may approve](#choose-who-may-approve).

## Next steps

{{< next "/docs/operate/dashboard/" "/docs/operate/manual-actions/" "/docs/concepts/gates/" >}}
