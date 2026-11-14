---
title: "Use the Dashboard"
description: "Find a rollout, read where a build is and what holds it, follow a pull request, and approve, skip, pin or retry from the Kuberik dashboard."
type_: guide
weight: 10
---

Find any app or rollout in a few keystrokes, see where each build stands and what holds it, and act on it without leaving the dashboard. Every action here has a kubectl equivalent in [Operate a Rollout by Hand](/docs/operate/manual-actions/).

{{< callout type="important" >}}
Needs rollout-dashboard after v0.9.2. Older dashboards have a Dependencies tab instead of Gates, and no Progress tab or Skip once.
{{< /callout >}}

## Find an app or a rollout

The sidebar pages answer "what needs me" across every cluster, and the command palette jumps straight to one object.

1. Open **Home** for what needs you now: **Attention**, **Your changes** and the **Fleet** card. **Rollouts**, **Apps** and **Environments** list the same fleet by rollout, by app and by environment.
2. Press <kbd>Ctrl</kbd> <kbd>K</kbd> (<kbd>⌘</kbd> <kbd>K</kbd> on a Mac), or select **Search** at the top of the sidebar.
3. Type part of a name. Results are grouped as **Rollouts**, **Builds**, **Apps**, **Environments**, **Changes**, **Namespaces** and **Commands**.
4. To find a pull request, paste its GitHub URL, `owner/repo#123` or a commit sha into the box, then select **Open change #123 · repo**.

![The command palette with a GitHub pull request URL pasted in and a single result, Open change #12 · kuberik-testing](/images/docs/dashboard/command-palette-pr.png)

On a rollout page the palette also lists **Overview**, **History**, **Gates**, **Logs** and **Change version…** for that rollout.

## Read a rollout

An app's Progress tab shows how far each build has gone; a rollout's Gates tab shows why it has not gone further.

1. Open an app from **Apps**, then select the **Progress** tab.
2. Pick a build in the list on the left. The drawing shows every environment as a column, its regions grouped by **Wave**, and each place's state: on the build, held (with the rule that holds it), or **Not reached**.
3. Select **Open rollout** on the banner, or a place in the drawing, to open that rollout.

![The Progress drawing of hello-world-app: development and staging are on the build, production eu-west is held by Business Hours Only in wave 1, and us-east and ap-south are not reached](/images/docs/dashboard/progress-tab.png)

4. On the rollout, select the **Gates** tab. **Gated by** lists every gate and the environment before this one, **Downstream** the rollouts that deploy after it. Below the drawing, **Held builds** lists what is waiting, **Waiting on** the services this one depends on, and **Depends on this** the services that wait on it. **All dependencies ›** opens the whole dependency network.

![The Gated by column of hello-world-app in production eu-west: a closed Business Hours Only schedule and two approvals that need approval hold the rollout, each with a Skip once button](/images/docs/dashboard/gates-tab.png)

## Follow a change

The Changes page tracks your pull requests after merge, so you can see which service and environment each one has reached.

1. Open **Changes**. It lists **Attention** (your changes that failed or wait for approval), **Your changes**, and **Team**. Expand **By repo** to group your changes by repository.
2. Select a change. The strip under its title has one row per service and one box per environment, with a mark for each region; select a mark to open that rollout.
3. Read **History** for what happened to the change and **Summary** for the time from merge to the first deploy and to production. **Open PR** opens the pull request on GitHub.

The Changes pages read pull requests through GitHub. Until the dashboard is connected, they show **Changes need GitHub**; see [GitHub](/docs/integrations/github/).

## Act on a rollout

Use these when a gate, a bad build or a failed deploy needs a person. They apply to one rollout unless the dialog says otherwise.

### Approve a build

1. On the **Gates** tab, find the approval gate that reads **Needs you**. It reads **Needs approval** when you cannot approve it.
2. Select **Approve**. When the gate holds the build in several regions the button reads **Approve all** and approves every region at once.
3. Confirm **Approve *build* in *place*?** with **Approve**.

The same button appears on Home, Changes and the app page wherever a build waits for your approval. See [Require a Manual Approval](/docs/gates/approvals/) for who can approve.

### Skip a gate once

1. On the **Gates** tab, select **Skip once** on a schedule, approval or hand-written gate. Health checks and pins have no Skip once.
2. Read the dialog, **Skip *gate* once**: every other rule still applies, and the gate keeps holding every other build.
3. Optionally select the other rollouts the gate holds, then confirm. When production is selected, type the build, or the gate's name when several builds are selected.

### Change version and pin

1. On the rollout's **Overview**, select **Change version**.
2. Pick a build, or search for one by sha, version or commit.
3. Turn on **Pin build** to keep the rollout on this build until the pin is cleared. A rollback always pins.
4. When rules still hold the build, write why they should not apply and type the build to confirm. Select **Deploy to *environment***.

![The Change version dialog deploying 3ea2311 to production: three rules still hold the build, the Pin build switch, a reason field and the typed confirmation](/images/docs/dashboard/change-version.png)

To let the rollout follow new releases again, select **Clear pin** on the Overview banner or on the pin's tile in the **Gates** tab.

### Retry a failed deploy

1. On the rollout's **Overview**, select **Retry** on the failure panel.
2. Confirm **Redeploy to *environment*?**. When tests failed, the dialog offers to retry the tests or skip them instead.

## Check the result

After **Approve** a toast reads **Approved *build***, and the gate's tile reads **Approved**. A skipped gate reads **Skipped once for *build*** until that build deploys. A pinned rollout shows **Clear pin** on its Overview until you clear it.

## Next steps

- [Operate a Rollout by Hand](/docs/operate/manual-actions/) for the kubectl version of every action
- [Require a Manual Approval](/docs/gates/approvals/)
- [Set Deployment Windows](/docs/gates/schedules/)
