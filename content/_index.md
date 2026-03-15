---
title: "Kuberik"
layout: "hextra-home"
---

<!-- prettier-ignore-start -->
{{< hextra/hero-container >}}
<div class="hx:w-full">
  {{< hextra/hero-badge >}}
    <div class="pulse-dot"></div>
    <span>GitOps-native Continuous Delivery</span>
  {{< /hextra/hero-badge >}}

  <div class="hx:mt-6 hx:mb-6">
  {{< hextra/hero-headline >}}
    <span class="text-gradient">GitOps Continuous Delivery</span><br/>
    for Kubernetes.
  {{< /hextra/hero-headline >}}
  </div>

  <div class="hx:mt-8 hx:mb-24">
  {{< hextra/hero-subtitle >}}
    Orchestrate complex rollouts with <strong>automated verification</strong>, <strong>safe promotions</strong>, and <strong>progressive delivery strategies</strong>.
  {{< /hextra/hero-subtitle >}}
  </div>

  <div class="hx:mt-12 hx:mb-6">
    {{< hextra/hero-button text="Get Started" link="/docs/getting-started/" >}}
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
    subtitle="Define complex multi-stage rollouts with fine-grained control over promotions."
    class="hx:aspect-auto hx:md:aspect-[1.1/1] hx:max-md:min-h-[340px]"
    icon="pipelines"
    link="/docs/guides/cross-environment-rollout/"
    image="images/rollouts_overview-shadow.png"
    imageDark="images/rollouts_overview_dark-shadow.png"
    imageClass="hx:top-[40%] hx:left-[24px] hx:w-[110%] hx:rounded-lg"
    style="background: radial-gradient(ellipse at 50% 80%,rgba(142,211,219,0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="Deployment Gates"
    subtitle="Safety first: use manual gates to protect your production environments."
    icon="gates"
    link="/docs/guides/manual-approvals/"
    style="background: radial-gradient(ellipse at 50% 80%,rgba(194,97,254,0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="Canary Strategies"
    subtitle="Native support for OpenKruise progressive rollout strategies."
    class="hx:aspect-auto hx:md:aspect-[1.1/1] hx:max-md:min-h-[340px]"
    icon="strategies"
    link="/docs/guides/canary-rollouts/"
    image="images/canary_strategies-shadow.png"
    imageDark="images/canary_strategies_dark-shadow.png"
    imageClass="hx:top-[40%] hx:left-[24px] hx:w-[110%] hx:rounded-lg"
    style="background: radial-gradient(ellipse at 50% 80%,rgba(97,254,194,0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="Health Verification"
    subtitle="Automated health checks ensure your services are running as expected at every step."
    class="hx:aspect-auto hx:md:aspect-[1.1/1] hx:max-md:min-h-[340px]"
    icon="health"
    link="/docs/guides/health-checks/"
    image="images/health_verification-shadow.png"
    imageDark="images/health_verification_dark-shadow.png"
    imageClass="hx:top-[40%] hx:left-[24px] hx:w-[110%] hx:rounded-lg"
    style="background: radial-gradient(ellipse at 50% 80%,rgba(221,210,59,0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="GitOps Automation"
    subtitle="Seamlessly integrate with FluxCD for image discovery and Kustomize patching."
    icon="rollbacks"
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
