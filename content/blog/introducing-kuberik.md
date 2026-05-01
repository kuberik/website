---
title: "Introducing Kuberik"
date: 2026-04-27
authors:
  - name: Luka Rumora
    link: https://github.com/LittleChimera
    image: https://github.com/LittleChimera.png
tags:
  - Announcement
---

After almost ten years of watching CD tooling change without the underlying model changing, I built Kuberik. It is a Kubernetes-native controller that runs inside your cluster and owns the full delivery journey as declarative, pluggable resources, from release detection through canary rollouts, health checks, environment promotions, and automatic rollback.

<!--more-->

## The state so far

I have used Jenkins, GitLab CI, Drone, GitHub Actions over the years. Each generation brought better interfaces and tighter integrations. But the way teams implement continuous delivery stayed exactly the same: you write the steps yourself. The canary, the health checks, the rollback trigger, the promotion conditions. Each of those is bespoke code that lives in your pipeline, is tested by nobody, and fails in production in ways that are hard to trace.

Pipelines also model only the happy path. When something goes wrong or you need to act outside the normal sequence, the pipeline has nothing for you. Roll back a single environment without touching others. Pin a version during an incident. Force a deploy past the gates. None of this is exceptional, it is routine, and it ends up as more bespoke code on top.

GitOps with Flux or ArgoCD addresses part of this. They reconcile a desired state from git, but they do not orchestrate how that state gets there. A change merged to main syncs to every cluster at once. There is no built-in way to roll changes out progressively across environments. Argo Rollouts and Flagger handle the mechanics of a single rollout but nothing beyond. Teams end up stitching all of these together with CI pipeline glue, and the glue becomes the thing nobody wants to touch. There are more complete solutions, but they come with centralized infrastructure, external dependencies, and operational overhead that most teams would rather avoid.

## How Kuberik works

Kuberik is a delivery controller, not a stack of scripts. It watches your container registry for new image releases. When a new version appears, it takes over. It runs the canary, checks health, promotes across environments, and rolls back if something goes wrong. Every step is a declarative, pluggable Kubernetes resource. Canary rollouts, health checks, environment promotions, and rollback are not logic you write into a pipeline. They are resources you declare, the same way you would declare a Deployment or a Service. The controller takes it from there.

The design encodes a set of behaviours that are easy to get wrong when you reimplement them in a script. Each environment is autonomous, so rollback is always a local operation. Kuberik will not roll out into an unhealthy environment. It will not undo a manual deployment made during an incident. It processes versions sequentially so every version gets properly verified. You can attach test hooks at any stage of the rollout. You can force deploy a specific version when you need to bypass the gates entirely. You can define deployment windows and Kuberik enforces them. Getting all of this right in a CI pipeline means writing and maintaining the logic yourself, in every pipeline, across every team. With Kuberik, the model scales across every service: written once, reused everywhere.

Deploying to production should just work. Check out [how Kuberik works](/docs/what-is-kuberik/#you-release-kuberik-delivers) and the [getting started guide](/docs/getting-started/).

For the story behind Kuberik, see [Building Kuberik](https://littlechimera.com/posts/building-kuberik/) on my personal blog.
