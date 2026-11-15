---
title: "Wait for Service Dependencies"
description: "Hold a service until the service it needs has shipped a compatible version."
type_: guide
weight: 40
aliases: ["/docs/guides/service-dependencies/"]
---

Hold a service until the service it depends on has shipped the version it needs, in every environment, without hand-sequencing deploys.

Needs a rollout-controller release after v0.11.0 and Rollouts that take their releases from a [ReleaseSource](/docs/releases/publish/), which reads the contract annotations from the images.

A [`RolloutDependency`](/docs/reference/api/#rolloutdependency) connects a consumer [Rollout](/docs/concepts/rollouts/) to a provider Rollout. Each consumer release says which provider version it was built against, and the controller admits it only once the provider has successfully deployed a release that satisfies that constraint.

## Declare the contract on the images

The dependency lives on the images, not in the manifests. The provider announces the contract version it serves in the standard OCI version annotation, and the consumer adds one annotation per contract it requires.

```bash {filename="Terminal"}
docker buildx build --push -t ghcr.io/acme/payments:rel-64 \
  --annotation "index:org.opencontainers.image.version=1.64.0-64" .
docker buildx build --push -t ghcr.io/acme/checkout:rel-64 \
  --annotation "index:org.opencontainers.image.version=2.64.0-64" \
  --annotation "index:com.kuberik.rollout.requires.payments=^1.64.0" .
```

The annotation key is `com.kuberik.rollout.requires.<contract>`. The value is a [Masterminds/semver constraint](https://github.com/Masterminds/semver#checking-version-constraints), applied verbatim: `^1.64.0`, `~1.64.0`, `>=1.64.0 <2.0.0` and `1.64.x` all work.

{{< callout type="warning" >}}
A bare version such as `1.64.0` is an **exact match**, not a floor. A release that tolerates later providers has to say so: publish `^1.64.0`.
{{< /callout >}}

The `-64` suffix is a per-build ordinal. Attach it as a SemVer pre-release identifier so builds of the same triple still sort by build order, and keep `org.opencontainers.image.revision` as the real git SHA. The controller strips that numeric ordinal before evaluating the constraint. A real pre-release such as `1.64.0-rc.1` is kept and fails `^1.64.0`, because the triple has not shipped yet.

## Connect the Rollouts

Create one object per consumer and contract, in the consumer's namespace.

```yaml {filename="checkout-needs-payments.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: RolloutDependency
metadata:
  name: checkout-needs-payments
  namespace: hello-world
spec:
  rolloutRef:
    name: checkout
  providerRef:
    name: payments
  contract: payments  # matches com.kuberik.rollout.requires.payments
```

`rolloutRef` names the consumer being gated. `contract` defaults to the provider Rollout's name, and `providerRef.namespace` defaults to the dependency's namespace. Apply the object in every environment that has both Rollouts. Each environment waits on its own copy of the provider: production's checkout waits for production's payments, not for staging's.

The controller compares each consumer release's requirement with the contract version of the most recent provider deploy whose bake succeeded. It publishes the verdict as a [`RolloutGate`](/docs/concepts/gates/) named `dependency-<name>`, whose `allowedVersions` lists the admitted releases. A dependency therefore holds back only the releases whose requirement is unmet. Older releases stay deployable, so you can roll back while a newer release waits.

A provider without `bakeTime` records its bake as succeeded the moment the deploy is written, before the workload has rolled out, so its consumers can start before the contract is live. Set `bakeTime` on every provider whose consumers must wait for the contract to be served.

Gates never hold a Rollout's first deploy: a brand-new consumer deploys the newest release the dependency admits, or the newest release if it admits none.

## Know the limits

- The consumer must be in the same namespace as the `RolloutDependency`, because a `RolloutGate` can only reference a Rollout in its own namespace. The provider may live elsewhere via `spec.providerRef.namespace`.
- The provider's `org.opencontainers.image.version` must be a semantic version. A git SHA there cannot be ordered against a constraint.
- One `RolloutDependency` covers one contract. A consumer that requires two services gets two objects.

## Check the result

`kubectl get` shows the version the provider serves and whether any consumer release waits on it.

```bash {filename="Terminal"}
kubectl get rolloutdependency -n hello-world
```

```text {filename="Output"}
NAME                      ROLLOUT    PROVIDER   PROVIDED   SATISFIED   AGE
checkout-needs-payments   checkout   payments   1.64.0     False       2d
```

`status.blockedReleases` names each held release and the constraint it needs.

```bash {filename="Terminal"}
kubectl get rolloutdependency checkout-needs-payments -n hello-world -o jsonpath='{.status.blockedReleases}'
```

```json {filename="Output"}
[{"reason":"ConstraintNotSatisfied","requiredVersion":"^1.66.0","tag":"rel-66"}]
```

The dashboard shows the same on the rollout's **Gates** tab: what the consumer waits on, the version it needs against the version running, and the contract across every environment. The home page and the Environments page name the provider on every held card.

![The Gates tab of hello-frontend-app in production: the gate graph with the hello-api-app dependency passing, and Waiting on, where hello-api-app runs 1.97.0 against the ^1.97.0 the frontend needs, not holding](/images/docs/rollout-dependencies.png "Here the provider already runs a version the consumer accepts, so the dependency passes and nothing is held.")

Once the provider bakes, the consumer follows a few seconds later, unprompted.

## Next steps

{{< next "/docs/concepts/gates/" "/docs/gates/approvals/" "/docs/operate/troubleshooting/" >}}
