---
title: "Use the Dashboard"
description: "Find and read rollouts, follow a pull request, and approve, skip, pin, retry or roll back from the Kuberik dashboard."
type_: guide
weight: 10
---

Find any rollout, read what holds it and act on it.

## Find an app or a rollout

Search reaches every app, rollout and pull request.

1. Open **Home** for what needs you, or **Rollouts**, **Apps** and **Environments** for the whole fleet.
2. Press <kbd>Ctrl</kbd> <kbd>K</kbd> (<kbd>⌘</kbd> <kbd>K</kbd> on a Mac), or select **Search** at the top of the sidebar.
3. Type part of a name.
4. To find a pull request, paste its GitHub URL, `owner/repo#123` or a commit sha, then select **Open change #123 · repo**.

![The command palette resolving a pasted pull request URL to Open change #80 · checkout-api](/images/docs/dashboard/command-palette-pr.png)

## Read a rollout

**Progress** shows where a release is, **Gates** what holds it.

1. Open an app from **Apps**, then select the **Progress** tab.
2. With several releases in flight, pick one in the release list. The drawing shows every environment, its regions grouped by **Wave**, and each place's state: deployed, deploying, checking, held, waiting for approval, failed, or **Not reached**.
3. Select a place in the drawing to open that rollout. When the app waits or failed, the banner above also has **Open rollout**; [What the dashboard shows](/docs/operate/troubleshooting/#what-the-dashboard-shows) explains each banner.

![The Progress card of hello-waves-app on build c6f19d2, deployed to development, staging and two production waves](/images/docs/operate/dashboard-progress.png)

4. On the rollout, select the **Gates** tab. **Gated by** lists every gate, the environment before this one and the services it depends on, **Downstream** the rollouts that deploy after it. **All dependencies ›** opens the dependency network.

![The Gates graph of billing-edge in production: Business hours and Release approval hold build 5.8.0-62, each with Skip once](/images/docs/operate/dashboard-gated-by.png)

5. On a rendered-manifests rollout, select **View source** in the rollout header to read the deployed files ([Rendered manifests](/docs/concepts/propagation/#rendered-manifests)).

## Follow a change

The Changes page tracks each merged pull request through every service and environment.

1. Open **Changes**. Your failing change, if any, leads in a banner at the top.
2. Select a change, then read its page.

| Where | What it shows |
|---|---|
| **Attention** | Your other failing changes, then approvals you can give |
| **Your changes** | Your repositories with a change in flight |
| **Team** | Other people's repositories with a change in flight |
| Strip under the title | A row per service, a box per environment, a mark per region that opens its rollout |
| **History** and **Summary** | What happened, and the time from merge to the first deploy and to production |

Without a [GitHub](/docs/integrations/github/) connection, these pages show **Changes need GitHub**.

## Act on a rollout

Each action sits next to what it changes: a gate's tile or the rollout page.

### Approve a build

1. On the **Gates** tab, find the approval gate that reads **Needs you**. It reads **Needs approval** when you cannot approve it.
2. Select **Approve**. When the build waits in several regions, it reads **Approve all** and approves them all.
3. Confirm the **Approve *build*** dialog with **Approve**.

Home, Changes and the app page show **Approve** too.

### Skip a gate once

1. On the **Gates** tab, select **Skip once** on a schedule, approval or hand-written gate. Health checks and pins have no Skip once, and the button shows only when you may change the rollout.
2. Read the dialog, **Skip *gate* once**: every other rule still applies, and the gate keeps holding every other build.
3. Optionally select the other rollouts the gate holds, then confirm. When production is selected, type the build, or the gate's name when the selected rollouts hold different builds.

### Change version and pin

1. On the rollout's **Overview**, select **Change version**.
2. Pick a build, or search by sha, version or commit.
3. Turn on **Pin build** to keep the rollout on this build until you clear it. Without the pin, a build that is not the newest stays only until its bake succeeds, and then the rollout deploys the newest build its rules allow.
4. In production, write why and type the build. Elsewhere the note is optional, and you type the build too when it failed on this rollout. Select **Deploy to *environment***.

![The Change version dialog for held build 4.45.0-45 of checkout-api in production: the rule it overrides, the Pin build switch, a reason and the typed confirmation](/images/docs/dashboard/change-version.png)

{{< callout type="warning" >}}
Change version skips every rule, including the wait for the earlier environment's bake: a build development never baked, or failed, deploys to staging at once. Once staging bakes it, production may take it.
{{< /callout >}}

To follow new releases again, select **Clear pin** on the Overview banner or the pin's tile.

### Retry a failed deploy

1. On the rollout's **Overview**, select **Retry** on the **Deployment failed** banner.
2. Confirm **Redeploy to *environment*?**. When tests failed, it offers to retry or skip them.

<div id="roll-back-a-failed-deploy"></div>

### Roll back

1. After a failed deploy, select **Roll back** on the **Deployment failed** banner of the rollout's **Overview**. It deploys the build before the failed one.
2. Otherwise, select **Roll back** in the rollout header. It shows whenever an older build exists, and goes to the last older build this environment ran, else to the release just below the running one. To pick the build yourself, choose an older one in **Change version**.
3. A rollback always pins, so the dialog has no **Pin build** switch. Confirm with **Roll back**; in production, write why and type the build first.

The rollout stays on that build, under a **Rolled back** banner, until you select **Clear pin**. A force-deploy back does not hold: see [Deploy a specific version](/docs/operate/manual-actions/#deploy-a-specific-version).

## Check the result

After **Approve**, the gate's tile reads **Approved**. A skipped gate reads **Skipped once for *build*** until that build deploys.

## Next steps

{{< next "/docs/operate/manual-actions/" "/docs/gates/approvals/" "/docs/gates/schedules/" >}}
