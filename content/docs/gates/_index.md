---
title: "Gate Deploys"
description: "Hold a deploy until health checks, people, time windows or other services allow it."
type_: index
weight: 40
aliases: ["/docs/guides/"]
---

Hold a deploy until health checks, people, time windows or other services allow it.

{{< cards >}}
  {{< card title="Verify with Health Checks" link="/docs/gates/health-checks/" icon="shield-check" subtitle="Fail a deploy when the app is unhealthy during bake time" >}}
  {{< card title="Require a Manual Approval" link="/docs/gates/approvals/" icon="user" subtitle="Hold a deploy until a person approves it" >}}
  {{< card title="Set Deployment Windows" link="/docs/gates/schedules/" icon="clock" subtitle="Allow or deny deploys by time and date" >}}
  {{< card title="Wait for Service Dependencies" link="/docs/gates/dependencies/" icon="share" subtitle="Hold a service until the one it needs has shipped" >}}
{{< /cards >}}
