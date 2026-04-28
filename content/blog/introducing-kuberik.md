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

## The problem with pipeline scripts

Jenkins, GitLab CI, Drone, GitHub Actions. Every few years the tooling changed, the interfaces got better, the integrations got tighter. But the way teams implement continuous delivery stayed exactly the same: you write the steps yourself. The canary, the health checks, the rollback trigger, the promotion conditions. Each of those is bespoke code that lives in your pipeline, is tested by nobody, and fails in production in ways that are hard to trace.

The second problem is that a pipeline only models the happy path. When something goes wrong or you need to act outside the normal sequence, the pipeline has nothing for you. You need to roll back a single environment without touching others. You need to pin a version while an incident is in progress. You need to force a deploy and skip the gates. You need per-environment deployment windows and health checks that block promotions automatically. None of this is exceptional, it is routine. And because the pipeline has no model for it, it all ends up as more bespoke code on top, harder to test than the pipeline itself.

The existing Kubernetes-native tools do not close this gap. GitOps tools like Flux and ArgoCD stop at the boundary of the rollout. Argo Rollouts and Flagger handle single-environment rollout mechanics but nothing beyond. Teams end up stitching these together with CI pipeline glue, and the glue becomes the thing nobody wants to touch. There are more complete solutions, but they come with centralized infrastructure, external dependencies, and operational overhead that most teams would rather avoid.

## How Kuberik works

Kuberik watches your container registry for new image releases. When a new version appears, it takes over. It runs the canary, checks health, promotes across environments, and rolls back if something goes wrong. Every step is a declarative, pluggable Kubernetes resource. Canary rollouts, health checks, environment promotions, and rollback are not logic you write into a pipeline. They are resources you declare, the same way you would declare a Deployment or a Service. The controller takes it from there.

The design encodes a set of behaviours that are easy to get wrong when you reimplement them in a script. Each environment is autonomous, so rollback is always a local operation. Kuberik will not roll out into an unhealthy environment. It will not undo a manual deployment made during an incident. It processes versions sequentially so every version gets properly verified. You can attach test hooks at any stage of the rollout. You can force deploy a specific version when you need to bypass the gates entirely. You can define deployment windows and Kuberik enforces them. Getting all of this right in a CI pipeline means writing and maintaining the logic yourself, in every pipeline, across every team.

Deploying to production should just work. Check out [how Kuberik works](/docs/what-is-kuberik/#you-release-kuberik-delivers) and the [getting started guide](/docs/getting-started/).
