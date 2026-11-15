---
title: "GitHub"
description: "Report deployments to GitHub and show commit changes in the dashboard."
type_: integration
weight: 20
---

Kuberik records every deploy as a GitHub deployment, which is how [Environments](/docs/concepts/environments/) in different clusters agree on what may go to production. The dashboard also signs people in to GitHub to show the commits and pull requests each deploy ships.

## What you need

| For | You need | Notes |
|---|---|---|
| Environments | environment-controller | The Helm chart installs it with `integrations.environment.enabled=true`. |
| Environments | A GitHub token per app namespace | Classic: `repo_deployment` for public repositories, `repo` for private ones. Fine-grained: **Deployments: Read and write** on the repository. |
| Dashboard changes | A GitHub App, on the cluster that serves the dashboard | Read-only access to **Contents**, **Pull requests** and **Checks**. |

The token and the GitHub App are independent: set up either one without the other.

## Create a token

The environment-controller only creates, lists and reads deployments and deployment statuses, so a token limited to deployments is enough.

- Classic token: on [github.com/settings/tokens](https://github.com/settings/tokens), choose **Generate new token (classic)** and select `repo_deployment` (public repositories) or `repo` (private repositories).
- Fine-grained token: on [github.com/settings/personal-access-tokens](https://github.com/settings/personal-access-tokens), select the repository the Environments report to and grant **Deployments: Read and write**.

## Store the token

The controller reads the token from the key `token` of a Secret in the Environment's own namespace. The Secret name defaults to `github-token`:

```bash {filename="Terminal"}
kubectl create secret generic github-token -n hello-world \
  --from-literal=token=<your-token>
```

Create it in every cluster and namespace that has an Environment. To use another name, set it in the Environment's `backend.secret`.

## Point an Environment at the repository

`backend.project` is the repository the deployments are recorded in, as `owner/repo`:

```yaml {filename="environment.yaml"}
apiVersion: environments.kuberik.com/v1alpha1
kind: Environment
metadata:
  name: hello-world-production
  namespace: hello-world
spec:
  rolloutRef:
    name: hello-world
  name: hello-world
  environment: production
  backend:
    type: github
    project: acme/hello-world
    secret: github-token     # the default
```

Every deployment is created on the release's commit, which the release controller reads from the image's `org.opencontainers.image.revision` annotation. That commit must exist in `backend.project`, so build your images from that repository and set the annotation in CI.

## Show commit changes in the dashboard {#dashboard-commit-changelists}

The dashboard can show what a deploy ships: the commits in the **Change version** dialog, and on the **Changes** page every merged pull request, where it stands per service and environment, and the check runs on its merge commit. Each person signs in through a GitHub App and sees only the repositories they can already read.

![The Change version dialog deploying 4.44.0-44 of checkout-api to staging: the running build 4.43.0-43 above the held 4.44.0-44, Commits to deploy with two commits, their authors and shas, the Pin build switch, an optional note and Deploy](/images/docs/integrations/github-change-version.png "The commit list is read from GitHub with the signed-in person's access.")

{{% steps %}}

### Create a GitHub App

In the org that owns your source repositories, open **Settings → Developer settings → GitHub Apps → New GitHub App**:

| Field | Value |
|---|---|
| Callback URL | `https://<dashboard-host>/api/auth/github/callback` |
| Expire user authorization tokens | Unchecked |
| Webhook → Active | Unchecked |
| Repository permissions | **Contents**, **Pull requests** and **Checks**: Read-only |

`<dashboard-host>` is the host people open the dashboard on. With several clusters that is the hub; the other clusters send sign-ins to it and need no app.

### Install the app

Choose **Install App** and install it on the org, for the repositories your [Rollouts](/docs/concepts/rollouts/) are built from.

### Create the Secret

On the app's **General** page, copy the **Client ID** and choose **Generate a new client secret**. The private key is not used.

```bash {filename="Terminal"}
kubectl -n kuberik-system create secret generic github-app-credentials \
  --from-literal=clientId=<client-id> \
  --from-literal=clientSecret=<client-secret>
```

### Restart the dashboard

When the Helm chart runs the dashboard (`dashboard.enabled=true`; it is off by default), it maps the Secret's `clientId` and `clientSecret` keys to the dashboard's `GITHUB_APP_CLIENT_ID` and `GITHUB_APP_CLIENT_SECRET`. The dashboard reads them at start, so restart it once the Secret exists:

```bash {filename="Terminal"}
kubectl -n kuberik-system rollout restart deployment rollout-dashboard
```

The chart looks for a Secret named `github-app-credentials`. If yours has another name, set it in the chart values and upgrade:

```yaml {filename="values.yaml"}
dashboard:
  githubApp:
    existingSecret: acme-github-app   # default github-app-credentials
```

### Sign in

Open `https://<dashboard-host>/api/auth/github/status` in a browser tab where you are signed in to the dashboard. With dashboard sign-in turned on, a request without your session gets the sign-in redirect instead of this answer:

```json {filename="Output"}
{"configured":true,"connected":false}
```

The dashboard header now offers **Connect GitHub**. Sign in once; the commit lists fill in from then on.

{{% /steps %}}

![The Changes page for the signed-in user: Your changes with a chip per repository, In flight, three pull requests grouped under the environment each has reached, and Landed, with four changes](/images/docs/integrations/github-changes.png)

## How it works

For each entry in a Rollout's history, the environment-controller creates a GitHub deployment on the release's commit, with the task `deploy:kuberik/<name>` and the environment `kuberik/<name>/<environment>`. It then posts a status for the bake: `in_progress` while deploying and baking, `success` or `failure` when the bake ends, `inactive` when it is cancelled. The payload names the site and wave. Environments in other clusters read these deployments to decide which releases they may deploy, so the clusters never connect to each other.

The repository's **Environments** page in GitHub shows the same history. The dashboard reads commits, pull requests and check runs with each person's own GitHub sign-in, never with the controller's token.

## Troubleshoot

Errors from the GitHub side are in the environment-controller's log:

```bash {filename="Terminal"}
kubectl logs -n kuberik-system deployment/environment-controller-manager
```

| Symptom | Cause | Fix |
|---|---|---|
| `failed to get GitHub token secret github-token` | The Secret is not in the Environment's namespace, or has another name. | Create it in that namespace, or set `backend.secret`. |
| `token key not found in secret` | The Secret has no `token` key. | Recreate it with `--from-literal=token=<your-token>`. |
| `failed to create GitHub deployment` | The token cannot write deployments to the repository, or the release's commit is not in it. | Check the token's scope and repository access, and the image's revision annotation. |
| The dashboard shows **Not configured** | The dashboard has no `GITHUB_APP_CLIENT_ID` or `GITHUB_APP_CLIENT_SECRET`. | Create the Secret in `kuberik-system`, check `dashboard.githubApp.existingSecret`, and restart the dashboard. |
| GitHub says `redirect_uri is not associated with this application` | The app's Callback URL does not match `https://<dashboard-host>/api/auth/github/callback`, scheme and host included. | Correct the Callback URL. |

## Next steps

{{< next "/docs/releases/promote/" "/docs/concepts/environments/" >}}
