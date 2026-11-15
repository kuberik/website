---
title: "Annotations"
description: "Every annotation Kuberik reads or writes, with its values and effect."
type_: reference
weight: 20
---

Every annotation the Kuberik controllers and the dashboard read or write, grouped by the resource it goes on.

## Rollout {#rollout-action-annotations}

The rollout-controller reads these from a Kuberik `Rollout` in the Rollout's namespace unless the row names another reader.

| Annotation | Values | Default | Set by | Effect |
|---|---|---|---|---|
| `rollout.kuberik.com/force-deploy` | Release tag | None | You, dashboard | Deploys that tag now, past the gates, the unhealthy health-check hold and the failed-bake hold; the tag must be in the `ReleaseSource` catalogue, `spec.wantedVersion` wins, and the controller removes it after the tag deploys ([Deploy a specific version](/docs/operate/manual-actions/#deploy-a-specific-version)). |
| `rollout.kuberik.com/deploy-message` | Free text | `Manual deployment` for `spec.wantedVersion`, `Manual deployment, with force deploy` for `force-deploy` | You, dashboard | Message of the history entry for a deploy by hand (`force-deploy` or `spec.wantedVersion`), removed after the next deploy ([Deploy a specific version](/docs/operate/manual-actions/#deploy-a-specific-version)). |
| `rollout.kuberik.com/deploy-user` | User name | Kind `System`, name `rollout-controller` | You, dashboard | Recorded as `triggeredBy` with kind `User` for a deploy by hand, removed after the next deploy; the dashboard writes the signed-in user unless it is a service account ([Deploy a specific version](/docs/operate/manual-actions/#deploy-a-specific-version)). |
| `rollout.kuberik.com/bypass-gates` | Release tag | None | You, dashboard | Lets that build past every gate once if it is a release newer than the deployed one; health checks and a failed bake still hold it, and the controller removes it after the next deploy ([Let one build past the gates](/docs/operate/manual-actions/#let-one-build-past-the-gates)). |
| `rollout.kuberik.com/bypass-gates-only` | Comma-separated `RolloutGate` names | Every gate | You, dashboard | Narrows `bypass-gates` to the named gates and is removed with it when that build deploys; unknown names raise a `BypassGatesUnknown` warning event ([Let one build past the gates](/docs/operate/manual-actions/#let-one-build-past-the-gates)). |
| `rollout.kuberik.com/unblock-failed` | `"true"` | None | You | Lets the next automatic deploy through after a failed bake while gates and the unhealthy hold still apply, removed after that deploy ([Resume after a failed bake](/docs/operate/manual-actions/#resume-after-a-failed-bake)). |
| `rollout.kuberik.com/retry` | Any, ignored | None | You, dashboard | When the latest bake is `Failed`, resets it to `Deploying`, records `lastRetryTimestamp` and is removed at once ([Retry a failed bake](/docs/operate/manual-actions/#retry-a-failed-bake)). |
| `rollouttest.kuberik.com/retry-mode` | `retry`, `skip` | `retry` | You, dashboard | Read by the openkruise-controller with `retry`: `retry` runs failed RolloutTests again, `skip` marks them `Skipped`, and the controller removes it after acting ([Retry or skip a failed test](/docs/releases/canary/#retry-or-skip-a-failed-test)). |
| `dashboard.rollout.kuberik.com/theme` | `development`, `staging`, `test`, `production` or a hex colour | From the Environment tier | You | Read by the dashboard: the preset or colour of the Rollout's environment chip. |
| `dashboard.rollout.kuberik.com/theme-color` | Hex colour (`#7c3aed`) | The theme's colour | You | Read by the dashboard: overrides the chip colour. |
| `dashboard.rollout.kuberik.com/theme-label` | Text | The environment name | You | Read by the dashboard: the text on the environment chip. |

## Kustomization

The rollout-controller and the openkruise-controller read this from a Flux `Kustomization` in the Rollout's namespace.

| Annotation | Values | Default | Set by | Effect |
|---|---|---|---|---|
| `rollout.kuberik.com/substitute.<VAR>.from` | Rollout name | None | You | On each deploy the rollout-controller writes the release tag to `spec.postBuild.substitute.<VAR>`; the openkruise-controller uses it to find the Rollout behind a canary ([Set a Kustomization substitute](/docs/integrations/fluxcd/#set-a-kustomization-substitute)). |

## OCIRepository

These go on a Flux `OCIRepository`.

| Annotation | Values | Default | Set by | Effect |
|---|---|---|---|---|
| `rollout.kuberik.com/rollout` | Rollout name | None | You | On each deploy the rollout-controller writes the release tag to `spec.ref.tag` of an OCIRepository in the Rollout's namespace ([Set an OCIRepository tag](/docs/integrations/fluxcd/#set-an-ocirepository-tag)). |
| `rollout.kuberik.com/name` | Rollout name | None | You | Read only by the openkruise-controller to find the Rollout behind a canary; the rollout-controller does not patch the OCIRepository for it. |
| `rollout.kuberik.com/namespace` | Namespace | The OCIRepository's namespace | You | Namespace of the Rollout named by `rollout.kuberik.com/name`. |

## HealthCheck

Each class is served by its own controller, which reads only the annotations in its table.

### Any class

| Annotation | Values | Default | Set by | Effect |
|---|---|---|---|---|
| `kuberik.com/display-name` | Text | `metadata.name` | You | Read by the dashboard: the name it shows for the check. |

### Class `kustomization`

| Annotation | Values | Default | Set by | Effect |
|---|---|---|---|---|
| `healthcheck.kuberik.com/kustomization` | `<name>` or `<namespace>/<name>` | None, required | You | The rollout-controller reports the health of this Kustomization; a bare name is looked up in the HealthCheck's namespace ([Choose how a Kustomization is checked](/docs/gates/health-checks/#choose-how-a-kustomization-is-checked)). |
| `healthcheck.kuberik.com/requeue-interval` | Go duration (`30s`, `2m`) | `30s` | You | How often the check is evaluated again; values under `5s` count as `5s` and a value that does not parse uses the default ([Report Kustomization health](/docs/integrations/fluxcd/#report-kustomization-health)). |

### Classes `datadog` and `datadog-incidents`

| Annotation | Values | Default | Set by | Effect |
|---|---|---|---|---|
| `healthcheck.kuberik.com/datadog-monitor-ids` | Comma-separated monitor IDs | None | You | Class `datadog`: the check is unhealthy while any of these monitors alerts; set this, `datadog-monitor-tags`, or both ([Fail a deploy on alerting monitors](/docs/integrations/datadog/#fail-a-deploy-on-alerting-monitors)). |
| `healthcheck.kuberik.com/datadog-monitor-tags` | Comma-separated tags | None | You | Class `datadog`: also selects every monitor that carries all of these tags ([Fail a deploy on alerting monitors](/docs/integrations/datadog/#fail-a-deploy-on-alerting-monitors)). |
| `healthcheck.kuberik.com/datadog-group-tags` | Comma-separated tags (`service:api`) | Every group | You | Class `datadog`: counts only the groups of each selected monitor that match these tags ([Fail a deploy on alerting monitors](/docs/integrations/datadog/#fail-a-deploy-on-alerting-monitors)). |
| `healthcheck.kuberik.com/datadog-incident-query` | Datadog incident search query | None, required | You | Class `datadog-incidents`: the check is unhealthy while an open incident matches the query ([Hold deploys during an incident](/docs/integrations/datadog/#hold-deploys-during-an-incident)). |
| `healthcheck.kuberik.com/requeue-interval` | Go duration | `60s` | You | How often Datadog is polled; a value under `10s` or one that does not parse uses the default ([Fail a deploy on alerting monitors](/docs/integrations/datadog/#fail-a-deploy-on-alerting-monitors)). |

### Class `datadog-monitor-crd`

The datadog-controller creates these HealthChecks, named `datadog-check-<monitor>`, from an annotated `DatadogMonitor`.

| Annotation | Values | Default | Set by | Effect |
|---|---|---|---|---|
| `kuberik.com/datadog-monitor-name` | DatadogMonitor name | The monitor's name | datadog-controller | Finds the monitor when the HealthCheck has lost its owner reference ([Use DatadogMonitor resources](/docs/integrations/datadog/#use-datadogmonitor-resources)). |
| `kuberik.com/datadog-monitor-uid` | DatadogMonitor UID | The monitor's UID | datadog-controller | Records which DatadogMonitor the check was created from. |

### Class `prometheus-alert`

| Annotation | Values | Default | Set by | Effect |
|---|---|---|---|---|
| `healthcheck.kuberik.com/prometheus-url` | Prometheus base URL | None, required | You | The Prometheus server whose `ALERTS` series the prometheus-controller queries ([Fail a deploy on a firing alert](/docs/integrations/prometheus/#fail-a-deploy-on-a-firing-alert)). |
| `healthcheck.kuberik.com/prometheus-alert-labels` | Comma-separated `key=value` (`alertname=HighErrorRate,app=hello-world`) | None, required | You | The check is unhealthy while an alert with these labels fires ([Fail a deploy on a firing alert](/docs/integrations/prometheus/#fail-a-deploy-on-a-firing-alert)). |
| `healthcheck.kuberik.com/prometheus-credentials-secret` | `<name>` or `<namespace>/<name>` | No credentials | You | Secret with key `token` (bearer) or `username` and `password` (basic auth); a bare name is looked up in the HealthCheck's namespace ([Authenticate to Prometheus](/docs/integrations/prometheus/#authenticate-to-prometheus)). |
| `healthcheck.kuberik.com/requeue-interval` | Go duration | `30s` | You | How often Prometheus is queried; values under `5s` count as `5s` and a value that does not parse uses the default ([Fail a deploy on a firing alert](/docs/integrations/prometheus/#fail-a-deploy-on-a-firing-alert)). |
| `healthcheck.kuberik.com/observation-limit` | Decimal (`0.05`) | Inferred from a simple rule expression such as `rate(x[5m]) > 0.05` | You | The alert's threshold, shown in `status.observations`; needs `observation-direction` ([Read the status](/docs/integrations/prometheus/#read-the-status)). |
| `healthcheck.kuberik.com/observation-direction` | `Above`, `Below` | Inferred with the limit | You | Whether the value fails above or below the limit; without a valid direction the observation falls back to a count of firing alerts ([Read the status](/docs/integrations/prometheus/#read-the-status)). |
| `healthcheck.kuberik.com/observation-unit` | Text (`%`, `ms`) | None | You | Unit shown with the observed value ([Read the status](/docs/integrations/prometheus/#read-the-status)). |
| `healthcheck.kuberik.com/observation-name` | Text | The `alertname` label, else the rule name, else `alert` | You | Name of the observation ([Read the status](/docs/integrations/prometheus/#read-the-status)). |
| `healthcheck.kuberik.com/last-scrape-time` | RFC 3339 time | One requeue interval ago | prometheus-controller | Start of the next `ALERTS` range query, written after each query so an alert that fired between polls still counts. |

## DatadogMonitor

The datadog-controller reads this from a Datadog Operator `DatadogMonitor`.

| Annotation | Values | Default | Set by | Effect |
|---|---|---|---|---|
| `kuberik.com/health-check` | `"true"` | None | You | Creates a HealthCheck `datadog-check-<monitor>` of class `datadog-monitor-crd` that mirrors the monitor, with the monitor's labels and its other annotations copied ([Use DatadogMonitor resources](/docs/integrations/datadog/#use-datadogmonitor-resources)). |

## RolloutGate

The dashboard reads these to name a gate and say what releases it.

| Annotation | Values | Default | Set by | Effect |
|---|---|---|---|---|
| `gate.kuberik.com/pretty-name` | Text | The gate's name | You, rollout-controller, environment-controller | The gate's name in the dashboard; the controllers write it on the gates they create for schedules, dependencies, approval policies and Environments ([Allow deploys during business hours](/docs/gates/schedules/#allow-deploys-during-business-hours)). |
| `gate.kuberik.com/description` | Text | None | You, rollout-controller, environment-controller | The explanation the dashboard shows under the gate on the rollout page ([Allow deploys during business hours](/docs/gates/schedules/#allow-deploys-during-business-hours)). |

## RolloutSchedule and ClusterRolloutSchedule

The rollout-controller copies these to every gate it creates for the schedule.

| Annotation | Values | Default | Set by | Effect |
|---|---|---|---|---|
| `gate.kuberik.com/pretty-name` | Text | The gate's name | You | Becomes the gate's `gate.kuberik.com/pretty-name` ([Allow deploys during business hours](/docs/gates/schedules/#allow-deploys-during-business-hours)). |
| `gate.kuberik.com/description` | Text | None | You | Becomes the gate's `gate.kuberik.com/description` ([Allow deploys during business hours](/docs/gates/schedules/#allow-deploys-during-business-hours)). |

## ApprovalPolicy and ClusterApprovalPolicy

The rollout-controller keeps these in sync on every approval gate the policy owns, and removes them from the gate when you remove them from the policy.

| Annotation | Values | Default | Set by | Effect |
|---|---|---|---|---|
| `gate.kuberik.com/pretty-name` | Text | The gate's name (`approval-gate-…`) | You | Becomes the approval gate's `gate.kuberik.com/pretty-name` ([Require an approval](/docs/gates/approvals/#require-an-approval)). |
| `gate.kuberik.com/description` | Text | None | You | Becomes the approval gate's `gate.kuberik.com/description` ([Require an approval](/docs/gates/approvals/#require-an-approval)). |

## RolloutApproval

| Annotation | Values | Default | Set by | Effect |
|---|---|---|---|---|
| `approval.kuberik.com/by` | Your Kubernetes user name | None | You, dashboard | Who approved; the admission policy `kuberik-rolloutapproval-by` rejects any name but the requester's and any change after create, and the rollout-controller copies it to `status.history[].approval.by` on deploy ([Approve a build](/docs/gates/approvals/#approve-a-build)). |

## Environment

The environment-controller reads these from an `Environment`.

| Annotation | Values | Default | Set by | Effect |
|---|---|---|---|---|
| `environments.kuberik.com/take-over-site` | `"true"` | None | You | On an Environment in a `DuplicateSite` conflict, marks the other owners of the site deregistered in GitHub and takes the site; it is not removed ([Troubleshoot promotion](/docs/releases/promote/#troubleshoot)). |
| `environments.kuberik.com/skip-deregister` | `"true"` | None | You | On delete, removes the `environments.kuberik.com/deregister` finalizer without calling GitHub, for a dead cluster or a revoked token ([When a site leaves](/docs/concepts/environments/#when-a-site-leaves)). |

## ReleaseSlice

The release-controller writes this on every slice of a `ReleaseSource` catalogue.

| Annotation | Values | Default | Set by | Effect |
|---|---|---|---|---|
| `kuberik.com/source-identity` | `spec.oci.image` or the `imagePolicyRef` name | Set on every slice | release-controller | When the ReleaseSource's identity no longer matches, the controller lists the new source and rebuilds the catalogue from it, keeping the old one if the new source cannot be listed. |

## OpenKruise Rollout

The openkruise-controller reads and writes these on an OpenKruise `Rollout` (`rollouts.kruise.io`); `<N>` is the canary step number, from 1.

| Annotation | Values | Default | Set by | Effect |
|---|---|---|---|---|
| `rollout.kuberik.io/step-<N>-ready-timeout` | Go duration (`10m`) | No limit | You | If step N is not ready (paused, tests passed) within this time, the Rollout gets `Stalled` with reason `StepReadyTimeoutExceeded` and waits for you ([Define the canary steps](/docs/releases/canary/#define-the-canary-steps)). |
| `rollout.kuberik.io/step-<N>-bake-time` | Go duration (`5m`) | `0`, continue at once | You | How long step N stays ready before the controller resumes the canary; a step without RolloutTests only continues on its own when this is set ([Define the canary steps](/docs/releases/canary/#define-the-canary-steps)). |
| `internal.rollout.kuberik.io/step-<N>-started-at` | RFC 3339 time | Set on entering the step | openkruise-controller | Start of the step's ready timeout; a retry on the Kuberik Rollout moves it to the retry time. |
| `internal.rollout.kuberik.io/step-<N>-ready-at` | RFC 3339 time | Set when the step is ready | openkruise-controller | Start of the step's bake time. |
| `internal.rollout.kuberik.io/step-<N>-last-revision` | Canary revision | Set per step | openkruise-controller | The canary revision the step was last evaluated for. |
| `internal.rollout.kuberik.io/last-step-index` | Step number | Set per step | openkruise-controller | Detects a step change so the next step's times start fresh. |

## RolloutTest

| Annotation | Values | Default | Set by | Effect |
|---|---|---|---|---|
| `kuberik.com/display-name` | Text | `metadata.name` | You | Read by the dashboard: the test's name in the retry dialog. |
| `rollout.kuberik.com/link.<label>` | URL | None | You | Read by the dashboard: a link named `<label>` on the test's row in the rollout's pipeline; a `Logs`, `CI` or `Trace` label (any case) replaces the link of that name the dashboard builds from the test job's `DD_SERVICE` and `DD_ENV` variables. |

## OCI artifact

The release-controller reads these from each release's OCI manifest, manifest annotations first and then the config descriptor's, when it adds the release to a `ReleaseSource` catalogue; set them in CI when you push.

| Annotation | Values | Default | Set by | Effect |
|---|---|---|---|---|
| `org.opencontainers.image.revision` | Git commit SHA | None | Your CI | The commit the build came from, used by the environment-controller as the GitHub deployment ref, so it must be a commit in the repository ([Publishing releases](/docs/releases/publish/)). |
| `org.opencontainers.image.version` | Semantic version | None | Your CI | The release's version, which a service dependency compares against the consumer's constraint ([Declare the contract on the images](/docs/gates/dependencies/#declare-the-contract-on-the-images)). |
| `org.opencontainers.image.created` | RFC 3339 time | None | Your CI | The release's creation time; other formats are ignored ([Publishing releases](/docs/releases/publish/)). |
| `org.opencontainers.image.source` | Repository URL | None | Your CI | Copied to the Rollout's `status.source` ([Publishing releases](/docs/releases/publish/)). |
| `org.opencontainers.image.title` | Text | None | Your CI | Copied to the Rollout's `status.title` ([Publishing releases](/docs/releases/publish/)). |
| `org.opencontainers.image.description` | Text | None | Your CI | Copied to the Rollout's `status.description` ([Publishing releases](/docs/releases/publish/)). |
| `com.kuberik.rollout.requires.<contract>` | Semver constraint (`^1.66.0`) | None | Your CI | What this release requires of `<contract>`, checked by a `RolloutDependency`; at most 32 per image, contract name up to 64 bytes, value up to 256 ([Declare the contract on the images](/docs/gates/dependencies/#declare-the-contract-on-the-images)). |

## Example

The dashboard annotations stay on the Rollout in Git.

```yaml {filename="rollout.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: Rollout
metadata:
  name: hello-world
  namespace: hello-world
  annotations:
    dashboard.rollout.kuberik.com/theme: production
    dashboard.rollout.kuberik.com/theme-label: "Production EU"
spec:
  releaseSourceRef:
    name: hello-world
```

The rollout-controller removes `force-deploy`, `deploy-message` and `deploy-user` after the deploy, so set them with `kubectl annotate` rather than keeping them in Git.

```bash {filename="Terminal"}
kubectl -n hello-world annotate rollout hello-world --overwrite \
  rollout.kuberik.com/force-deploy=1.4.0 \
  rollout.kuberik.com/deploy-message="Roll back the checkout fix" \
  rollout.kuberik.com/deploy-user=emma.clarke@acme.com
```
