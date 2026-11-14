---
title: "Canary Rollouts"
weight: 4
---

Shift traffic to a new version in steps using [OpenKruise Rollout](https://openkruise.io/rollouts/user-manuals/basic-usage), with Kuberik holding each step for a bake time and running tests before the next step. Use it for user-facing services where problems only show under real traffic. Canary rollouts need the [OpenKruise Controller](/docs/installation/#optional-controllers) in the cluster.

{{% details title="Installing OpenKruise" %}}

Follow the [OpenKruise installation guide](https://openkruise.io/rollouts/installation) or use the Kuberik-managed installation:

```bash
kubectl apply --server-side -f https://github.com/kuberik/openkruise-controller/releases/download/v0.4.1/install.yaml
```

{{% /details %}}

## Define the Rollout

Create an OpenKruise `Rollout` to manage your Deployment. Each step defines how many replicas and what percentage of traffic goes to the canary.

```yaml {filename="rollout.yaml"}
apiVersion: rollouts.kruise.io/v1beta1
kind: Rollout
metadata:
  name: my-app
  annotations:
    rollout.kuberik.io/step-1-bake-time: "5m"
spec:
  workloadRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  strategy:
    canary:
      steps:
        - replicas: 1
          traffic: 10%
        - replicas: 5
          traffic: 50%
      trafficRoutings:
        - service: my-app
          gateway:
            httpRouteName: my-app
```

{{< callout type="default" >}}
Kuberik watches the rollout and enforces bake time at each step before allowing progression. If health checks fail during bake, the rollout is paused.

See the [OpenKruise Rollout documentation](https://openkruise.io/rollouts/user-manuals/strategy-canary-update) for full canary strategy options.
{{< /callout >}}

## Run Tests at Steps

Use `RolloutTest` to run a Job at a specific canary step. Kuberik pauses the rollout at that step, runs the Job, and proceeds only if it succeeds. If the test fails, the rollout stays paused at that step until you retry the test or skip it.

![A stepped rollout in the dashboard: each canary step is a stage of the deployment pipeline, and the final check watches the health checks before the deploy counts as done](/screenshots/dashboard/overview-prod.png)

```yaml {filename="smoke-test.yaml"}
apiVersion: rollout.kuberik.com/v1alpha1
kind: RolloutTest
metadata:
  name: smoke-test
spec:
  rolloutName: my-app
  stepIndex: 1
  jobTemplate:
    backoffLimit: 0
    template:
      spec:
        restartPolicy: Never
        containers:
          - name: test
            image: curlimages/curl
            command: ["curl", "--fail", "http://my-app-canary"]
```

`jobTemplate` is a Kubernetes Job spec. `stepIndex` is 1-based and matches the steps defined in the OpenKruise Rollout. Create one `RolloutTest` per step you want to test.

Once the deploy has failed, retry it from the dashboard's **Retry** button or with the `rollout.kuberik.com/retry` annotation on the Kuberik Rollout, and the failed tests at the current step run again. To let the step continue without them, also set `rollouttest.kuberik.com/retry-mode: skip` on the Kuberik Rollout: the failed tests are marked `Skipped` and count as passed.

{{< callout type="warning" >}}
Tests configured on the last step won't run. OpenKruise Rollouts completes without pausing at the final step, so the controller never gets a chance to execute them. Only configure `RolloutTest` for steps that aren't the last one.
{{< /callout >}}

## Kuberik Annotations

| Annotation | Purpose |
|------------|---------|
| `rollout.kuberik.io/step-<N>-ready-timeout` | {{< badge content="Timeout" color="orange" >}} Max wait time for pod readiness at step N |
| `rollout.kuberik.io/step-<N>-bake-time` | {{< badge content="Bake" color="blue" >}} Stabilization time after readiness at step N |
