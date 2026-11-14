---
title: "Roll Out with a Canary"
linkTitle: "Canary Rollouts"
description: "Shift traffic to a new version in steps, with a bake time and a test Job holding each step."
type_: guide
weight: 30
aliases: ["/docs/guides/canary-rollouts/"]
---

Move traffic to a new version in steps, and let each step continue only after it has stayed ready for a bake time and its tests have passed. Use it for user-facing services where problems show only under real traffic.

Works with: [OpenKruise Rollout](https://openkruise.io/rollouts/user-manuals/basic-usage) and the Kuberik openkruise-controller, which you install with the Helm chart's `integrations.openkruise.enabled` or on its own:

```bash {filename="Terminal"}
kubectl apply --server-side -f https://github.com/kuberik/openkruise-controller/releases/download/v0.4.1/install.yaml
```

Install OpenKruise Rollout itself from the [OpenKruise installation guide](https://openkruise.io/rollouts/installation).

## Define the canary steps

An OpenKruise `Rollout` splits a Deployment into steps; each step sets the canary's replicas and share of traffic. Set a bake time per step with an annotation:

```yaml {filename="kruise-rollout.yaml"}
apiVersion: rollouts.kruise.io/v1beta1
kind: Rollout
metadata:
  name: hello-world
  namespace: hello-world
  annotations:
    rollout.kuberik.io/step-1-bake-time: "5m"
    rollout.kuberik.io/step-1-ready-timeout: "10m"
spec:
  workloadRef:
    apiVersion: apps/v1
    kind: Deployment
    name: hello-world
  strategy:
    canary:
      steps:
        - replicas: 1
          traffic: 10%
        - replicas: 5
          traffic: 50%
      trafficRoutings:
        - service: hello-world
          gateway:
            httpRouteName: hello-world
```

| Annotation | Effect |
|---|---|
| `rollout.kuberik.io/step-<N>-bake-time` | How long step N must stay ready before it continues |
| `rollout.kuberik.io/step-<N>-ready-timeout` | How long step N may take to become ready before the rollout stops and waits for you |

`N` is 1-based and counts the `steps` in order. When Flux applies this Rollout from a Kustomization that a Kuberik [`Rollout`](/docs/concepts/rollouts/) drives, a failed bake on the Kuberik Rollout also stops the canary at its current step. See the [OpenKruise canary strategy](https://openkruise.io/rollouts/user-manuals/strategy-canary-update) for every step option.

## Run tests at a step

A `RolloutTest` runs a Job when the canary reaches a step. The step continues only if the Job succeeds; if it fails, the step stays paused until you retry or skip the test.

```yaml {filename="smoke-test.yaml"}
apiVersion: rollout.kuberik.com/v1alpha1
kind: RolloutTest
metadata:
  name: smoke-test
  namespace: hello-world
spec:
  rolloutName: hello-world  # the OpenKruise Rollout
  stepIndex: 1
  jobTemplate:
    backoffLimit: 0
    template:
      spec:
        restartPolicy: Never
        containers:
          - name: test
            image: curlimages/curl
            command: ["curl", "--fail", "http://hello-world-canary"]
```

`jobTemplate` is a Kubernetes Job spec, and `stepIndex` is 1-based like the annotations. Create one `RolloutTest` per step you want to test.

{{< callout type="warning" >}}
Tests on the last step never run: OpenKruise completes the last step without pausing. Put tests on an earlier step.
{{< /callout >}}

## Retry or skip a failed test

Retry the failed deploy from the dashboard's **Retry** button, or with the `rollout.kuberik.com/retry` annotation on the Kuberik Rollout, and the failed tests at the current step run again. To let the step continue without them, also set `rollouttest.kuberik.com/retry-mode: skip`; the failed tests are marked `Skipped` and count as passed.

```bash {filename="Terminal"}
kubectl -n hello-world annotate rollouts.kuberik.com hello-world \
  rollouttest.kuberik.com/retry-mode=skip rollout.kuberik.com/retry=true --overwrite
```

## Check the result

Each test reports its phase: `WaitingForStep`, `Pending`, `Running`, `Succeeded`, `Failed`, `Cancelled` or `Skipped`.

```bash {filename="Terminal"}
kubectl -n hello-world get rollouttests -o custom-columns=NAME:.metadata.name,STEP:.spec.stepIndex,PHASE:.status.phase
```

In the dashboard, each canary step is a stage of the deploy:

![The deployment pipeline of a production rollout: Started, the canary stages Stage 1 at 20%, Stage 2 and Stage 3, then Check, where the health checks are healthy and the check timer is done](/images/docs/releases/canary-pipeline.png)

## Troubleshoot

| Symptom | Cause | Fix |
|---|---|---|
| The canary stops at a step and the OpenKruise Rollout shows `Stalled` with reason `StepReadyTimeoutExceeded` | The step was not ready within `step-<N>-ready-timeout` | Fix the canary pods, then retry the failed deploy on the Kuberik Rollout: a retry restarts the step's timeout |
| A test never leaves `WaitingForStep` | Its `stepIndex` is the last step | Move the test to an earlier step |

## Next steps

{{< cards >}}
  {{< card title="Verify with Health Checks" link="/docs/gates/health-checks/" icon="shield-check" subtitle="Bake the whole deploy on health checks" >}}
  {{< card title="Flux" link="/docs/integrations/fluxcd/" icon="switch-horizontal" subtitle="Let Kuberik choose the version Flux applies" >}}
{{< /cards >}}
