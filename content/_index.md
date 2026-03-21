---
title: "Kuberik"
layout: "hextra-home"
---

<!-- prettier-ignore-start -->
{{< hextra/hero-container >}}
<div class="hx:w-full">
  {{< hextra/hero-badge >}}
    <div class="pulse-dot"></div>
    <span>Kubernetes-native Continuous Delivery</span>
  {{< /hextra/hero-badge >}}

  <div class="hx:mt-6 hx:mb-6">
  {{< hextra/hero-headline >}}
    <span class="text-gradient">Safe, Hands-Off Deployments</span><br/>
    for Kubernetes
  {{< /hextra/hero-headline >}}
  </div>

  <div class="hx:mt-8 hx:mb-24">
  {{< hextra/hero-subtitle >}}
    Declarative multi-stage progressive delivery from commit to production — batteries included
  {{< /hextra/hero-subtitle >}}
  </div>

  <div class="hx:mt-12 hx:mb-6 hx:flex hx:gap-4 hx:flex-wrap">
    {{< hextra/hero-button text="Get Started" link="/docs/getting-started/" >}}
    <a href="https://github.com/kuberik/rollout-controller" target="_blank" rel="noreferrer" class="not-prose hx:font-medium hx:cursor-pointer hx:px-6 hx:py-3 hx:rounded-full hx:text-center hx:inline-block hx:border hx:border-gray-300 hx:dark:border-neutral-600 hx:text-gray-700 hx:dark:text-gray-300 hx:hover:bg-gray-100 hx:dark:hover:bg-neutral-800 hx:transition-all hx:ease-in hx:duration-200">View on GitHub</a>
  </div>
</div>
<div class="hx:mx-auto hx:flex hx:justify-center hx:items-center" style="max-width: 300px;">
  {{< inline-svg path="logo.svg" class="hx:w-full hx:h-auto hx:drop-shadow-2xl" themeAware="true" >}}
</div>
{{< /hextra/hero-container >}}


<div class="hx:mt-24 hx:mb-12">
</div>

{{< hextra/feature-grid >}}
  {{< hextra/feature-card
    title="Multi-Stage Pipelines"
    subtitle="Promote releases across environments with dependencies between stages."
    class="hx:aspect-auto"
    icon="pipelines"
    link="/docs/guides/cross-environment-rollout/"
    style="background: radial-gradient(ellipse at 50% 80%,rgba(142,211,219,0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="Deployment Gates"
    subtitle="Control when and which releases deploy — with schedules, manual approvals, or custom conditions."
    class="hx:aspect-auto"
    icon="gates"
    link="/docs/guides/manual-approvals/"
    style="background: radial-gradient(ellipse at 50% 80%,rgba(194,97,254,0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="Canary Rollouts"
    subtitle="Gradually roll out changes to a subset of users before full promotion."
    class="hx:aspect-auto"
    icon="strategies"
    link="/docs/guides/canary-rollouts/"
    style="background: radial-gradient(ellipse at 50% 80%,rgba(97,254,194,0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="Automated Testing"
    subtitle="Run smoke tests, integration tests, or any verification Job as part of your rollout pipeline."
    class="hx:aspect-auto"
    icon="testing"
    link="/docs/guides/canary-rollouts/"
    style="background: radial-gradient(ellipse at 50% 80%,rgba(221,210,59,0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="Monitoring Integration"
    subtitle="Connect Datadog, Prometheus, or custom metrics to continuously validate deployments."
    class="hx:aspect-auto"
    icon="monitoring"
    link="/docs/guides/health-checks/"
    style="background: radial-gradient(ellipse at 50% 80%,rgba(254,142,97,0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="GitOps Native"
    subtitle="Define and control your entire delivery process through Git."
    class="hx:aspect-auto"
    icon="gitops"
    link="/docs/integrations/fluxcd/"
    style="background: radial-gradient(ellipse at 50% 80%,rgba(142,53,74,0.15),hsla(0,0%,100%,0));"
  >}}
{{< /hextra/feature-grid >}}
<!-- prettier-ignore-end -->

<div class="hx:bg-gray-50/50 dark:hx:bg-gray-900/50 hx:py-32 hx:mx-auto hx:mt-12 hx:mb-12">
  <div class="hx:max-w-screen-xl hx:mx-auto hx:px-6 hx:flex hx:flex-col hx:items-center">
    <h2 class="hx:text-2xl hx:font-black hx:text-gray-900 hx:dark:text-white hx:uppercase hx:tracking-widest hx:text-center hx:mb-16">Ecosystem Integrations</h2>
    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 2rem; margin: 0 auto; max-width: 100%;">
      <div class="hx:flex hx:items-center hx:gap-4 hx:grayscale hover:hx:grayscale-0 hx:transition-all hx:cursor-pointer">
        {{< inline-svg path="logos/github.svg" class="hx:h-10 hx:w-auto" themeAware="true" >}}
        <span class="hx:text-sm hx:font-bold hx:text-gray-400">GITHUB</span>
      </div>
      <div class="hx:flex hx:items-center hx:gap-4 hx:grayscale hover:hx:grayscale-0 hx:transition-all hx:cursor-pointer">
        {{< inline-svg path="logos/fluxcd.svg" class="hx:h-10 hx:w-auto" themeAware="true" >}}
        <span class="hx:text-sm hx:font-bold hx:text-gray-400">FLUXCD</span>
      </div>
      <div class="hx:flex hx:items-center hx:gap-4 hx:grayscale hover:hx:grayscale-0 hx:transition-all hx:cursor-pointer">
        {{< inline-svg path="logos/datadog.svg" class="hx:h-10 hx:w-auto" themeAware="true" >}}
        <span class="hx:text-sm hx:font-bold hx:text-gray-400">DATADOG</span>
      </div>
      <div class="hx:flex hx:items-center hx:gap-4 hx:grayscale hover:hx:grayscale-0 hx:transition-all hx:cursor-pointer">
        {{< inline-svg path="logos/openkruise.svg" class="hx:h-10 hx:w-auto" themeAware="true" >}}
        <span class="hx:text-sm hx:font-bold hx:text-gray-400">OPENKRUISE</span>
      </div>
      <div class="hx:flex hx:items-center hx:gap-4 hx:grayscale hover:hx:grayscale-0 hx:transition-all hx:cursor-pointer">
        {{< inline-svg path="logos/prometheus.svg" class="hx:h-10 hx:w-auto" themeAware="true" >}}
        <span class="hx:text-sm hx:font-bold hx:text-gray-400">PROMETHEUS</span>
      </div>
    </div>
  </div>
</div>
