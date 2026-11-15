---
title: "Kuberik documentation"
linkTitle: "Docs"
description: "Install Kuberik, deploy your first app and learn how releases move through gated environments."
weight: 1
layout: docs-home
toc: false
# The docs front door (layouts/_partials/docs/home.html). Link titles come from the linked page when it exists;
# `title` here is only the fallback.
hero:
  eyebrow: "Documentation"
  lead: "Kuberik is a set of Kubernetes controllers that deploy each release your CI publishes one environment at a time, when its gates allow, and promote it once its health checks pass."
  primary: { title: "Deploy Your First App", url: "/docs/getting-started/" }
  secondary: { title: "Install", url: "/docs/installation/" }
journeys:
  - title: "Get started"
    url: "/docs/what-is-kuberik/"   # a pseudo-group has no index page: the card opens its first page (docs/group.html)
    icon: rocket
    outcome: "Install the controller and deploy an app with Flux."
    links:
      - { url: "/docs/what-is-kuberik/", title: "What Is Kuberik" }
      - { url: "/docs/installation/helm/", title: "Install with Helm" }
      - { url: "/docs/getting-started/", title: "Deploy Your First App" }
  - title: "Concepts"
    url: "/docs/concepts/"
    icon: book
    outcome: "How Rollouts, Environments and gates decide what deploys where."
    links:
      - { url: "/docs/concepts/architecture/", title: "How Kuberik Works" }
      - { url: "/docs/concepts/rollouts/", title: "Rollouts" }
      - { url: "/docs/concepts/environments/", title: "Environments" }
  - title: "Ship releases"
    url: "/docs/releases/"
    icon: releases
    outcome: "Publish releases from CI and move them through your environments."
    links:
      - { url: "/docs/releases/publish/", title: "Publish Releases from CI" }
      - { url: "/docs/releases/promote/", title: "Promote Across Environments" }
      - { url: "/docs/releases/canary/", title: "Roll Out with a Canary" }
  - title: "Gate deploys"
    url: "/docs/gates/"
    icon: gates
    outcome: "Hold a deploy until health checks, people or time windows allow it."
    links:
      - { url: "/docs/gates/health-checks/", title: "Verify with Health Checks" }
      - { url: "/docs/gates/approvals/", title: "Require a Manual Approval" }
      - { url: "/docs/gates/schedules/", title: "Set Deployment Windows" }
      - { url: "/docs/gates/dependencies/", title: "Wait for Service Dependencies" }
  - title: "Operate"
    url: "/docs/operate/"
    icon: operate
    outcome: "Pin, unblock and watch rollouts day to day."
    links:
      - { url: "/docs/operate/dashboard/", title: "Use the Dashboard" }
      - { url: "/docs/operate/manual-actions/", title: "Operate a Rollout with kubectl" }
      - { url: "/docs/operate/monitoring/", title: "Monitor Rollouts" }
      - { url: "/docs/operate/troubleshooting/", title: "Troubleshoot" }
  - title: "Integrations"
    url: "/docs/integrations/"
    icon: plug
    outcome: "Connect Kuberik to Flux, GitHub, Datadog and Prometheus."
    links:
      - { url: "/docs/integrations/fluxcd/", title: "Flux" }
      - { url: "/docs/integrations/github/", title: "GitHub" }
      - { url: "/docs/integrations/datadog/", title: "Datadog" }
      - { url: "/docs/integrations/prometheus/", title: "Prometheus" }
reference:
  - { url: "/docs/reference/api/", title: "API Reference", icon: braces, description: "Fields of every Kuberik custom resource." }
  - { url: "/docs/reference/annotations/", title: "Annotations", icon: tag, description: "Every annotation Kuberik reads or writes." }
---
