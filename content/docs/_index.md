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
    outcome: "Install Kuberik and deploy an app with Flux."
  - title: "Concepts"
    url: "/docs/concepts/"
    icon: book
    outcome: "How Rollouts, Environments and gates decide what deploys where."
  - title: "Ship releases"
    url: "/docs/releases/"
    icon: releases
    outcome: "Publish releases from CI and move them through your environments."
  - title: "Gate deploys"
    url: "/docs/gates/"
    icon: gates
    outcome: "Hold a deploy until health checks, people or time windows allow it."
  - title: "Operate"
    url: "/docs/operate/"
    icon: operate
    outcome: "Pin, unblock, roll back and watch rollouts day to day."
  - title: "Integrations"
    url: "/docs/integrations/"
    icon: plug
    outcome: "Connect Kuberik to Flux, GitHub, Datadog and Prometheus."
reference:
  - { url: "/docs/reference/api/", title: "API Reference", icon: braces, description: "Every field of the Rollout, Environment, OpenKruise and Release resources." }
  - { url: "/docs/reference/annotations/", title: "Annotations", icon: tag, description: "Every annotation Kuberik reads or writes." }
---
