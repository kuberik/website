---
title: "Use the Dashboard"
description: "Find a rollout, read where a build is and what holds it, follow a pull request, and approve, skip, pin, retry or roll back from the Kuberik dashboard."
type_: guide
weight: 10
---

Find any app or rollout, see where each build stands and what holds it, and act on it from the dashboard. For the kubectl way, see [Operate a Rollout with kubectl](/docs/operate/manual-actions/) and, for approvals, [Require a Manual Approval](/docs/gates/approvals/).


## Find an app or a rollout

The sidebar pages list what needs you across every cluster; the command palette jumps to one object.

1. Open **Home** for **Attention**, **Your changes** and the **Fleet** card, or **Rollouts**, **Apps** and **Environments** for the whole fleet.
2. Press <kbd>Ctrl</kbd> <kbd>K</kbd> (<kbd>⌘</kbd> <kbd>K</kbd> on a Mac), or select **Search** at the top of the sidebar.
3. Type part of a name. Results are grouped as **Rollouts**, **Builds**, **Apps**, **Environments**, **Changes**, **Namespaces** and **Commands**.
4. To find a pull request, paste its GitHub URL, `owner/repo#123` or a commit sha into the box, then select **Open change #123 · repo**.

![The command palette with the URL of pull request 80 in exampleco/checkout-api pasted in and a single result, Open change #80 · checkout-api, 4 of 7 live, queued for 2](/images/docs/dashboard/command-palette-pr.png)

## Read a rollout

An app's Progress tab shows how far each build has gone; a rollout's Gates tab shows why it has not gone further.

1. Open an app from **Apps**, then select the **Progress** tab.
2. When two or more releases are in flight, pick one in the release list, beside the drawing or above it on a narrow screen. The drawing shows every environment as a column, its regions grouped by **Wave**, and each place's state: deployed, deploying, checking, held (with the rule that holds it), waiting for approval, failed, or **Not reached**.
3. Select a place in the drawing to open that rollout. When the app waits or failed, the banner above also has **Open rollout**. To find what a banner's words mean and how to clear them, look them up in [What the dashboard shows](/docs/operate/troubleshooting/#what-the-dashboard-shows).

![The Progress card of hello-waves-app on build c6f19d2, 5 of 5 places deployed: dev-local in development, eu-west-1 in staging, and production in two waves, eu-west-1 and us-east-1 in wave 1 and ap-south-1 in wave 2](/images/docs/operate/dashboard-progress.png)

4. On the rollout, select the **Gates** tab. **Gated by** lists every gate, the environment before this one and the services this one depends on (its count is gates only), **Downstream** the rollouts that deploy after it. Below it, **Held builds**, **Waiting on** and **Depends on this** list held builds, dependencies and dependents. **All dependencies ›** opens the whole dependency network.

![The Gates graph of billing-edge in production: two gates hold build 5.8.0-62, the closed Business hours window and Release approval, which needs approval, each with a Skip once button, and billing-edge in production runs 5.7.1-61](/images/docs/operate/dashboard-gated-by.png)

5. On a rendered-manifests rollout, select **View source** in the rollout header to read the files that are deployed ([Rendered manifests](/docs/concepts/propagation/#rendered-manifests)).

## Follow a change

The Changes page tracks your pull requests after merge, so you can see which service and environment each one has reached.

1. Open **Changes**. Your failing change, if any, leads in a banner at the top.
2. Select a change, then read its page.

| Where | What it shows |
|---|---|
| **Attention** | Your other failing changes, then approvals you can give |
| **Your changes** | Your repositories with a change in flight; **By repo** groups them |
| **Team** | Other people's repositories with a change in flight |
| Strip under the change's title | One row per service, one box per environment, a mark per region; a mark opens that rollout |
| **History** and **Summary** | What happened to the change, and the time from merge to the first deploy and to production |

Until the dashboard is connected to [GitHub](/docs/integrations/github/), these pages show **Changes need GitHub**.

## Act on a rollout

Use these when a gate, a bad build or a failed deploy needs a person.

### Approve a build

1. On the **Gates** tab, find the approval gate that reads **Needs you**. It reads **Needs approval** when you cannot approve it.
2. Select **Approve**. When the gate holds the build in several regions the button reads **Approve all** and approves every region at once.
3. Confirm **Approve *build* in *place*?** (or **for *places*** when it covers several) with **Approve**.

**Approve** also appears on Home, Changes and the app page wherever a build waits for you.

### Skip a gate once

1. On the **Gates** tab, select **Skip once** on a schedule, approval or hand-written gate. Health checks and pins have no Skip once, and the button shows only when you may change the rollout.
2. Read the dialog, **Skip *gate* once**: every other rule still applies, and the gate keeps holding every other build.
3. Optionally select the other rollouts the gate holds, then confirm. When production is selected, type the build, or the gate's name when the selected production rollouts hold different builds.

### Change version and pin

1. On the rollout's **Overview**, select **Change version**.
2. Pick a build, or search by sha, version or commit.
3. Turn on **Pin build** to keep the rollout on this build until the pin is cleared. A rollback always pins.
4. When rules still hold the build, write why they should not apply and type the build to confirm. Select **Deploy to *environment***.

![The Change version dialog deploying the held build 4.45.0-45 of checkout-api to production: one rule, After staging, still holds it, then the commits to deploy, the Pin build switch, a required reason and the typed confirmation](/images/docs/dashboard/change-version.png)

To let the rollout follow new releases again, select **Clear pin** on the Overview banner or on the pin's tile in the **Gates** tab.

### Retry a failed deploy

1. On the rollout's **Overview**, select **Retry** on the **Deployment failed** banner.
2. Confirm **Redeploy to *environment*?**. When tests failed, the dialog offers to retry the tests or skip them instead.

### Roll back a failed deploy

1. For a rollback, select **Roll back** on the **Deployment failed** banner of the rollout's **Overview**. It shows when the rollout has deployed an earlier build.
2. The deploy dialog opens on the earlier build, with the pin always on. Confirm the deploy.

The rollout stays on that build, under a **Rolled back** banner, until you select **Clear pin**.

## Check the result

After **Approve** a toast reads **Approved *build***, and the gate's tile reads **Approved**. A skipped gate reads **Skipped once for *build*** until that build deploys. A pinned rollout shows **Clear pin** on its Overview until you clear it.

## Next steps

{{< next "/docs/operate/manual-actions/" "/docs/gates/approvals/" "/docs/gates/schedules/" >}}
