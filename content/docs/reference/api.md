---
title: "API Reference"
weight: 1
---

This page includes the full API documentation of the Kuberik project.

---


# Environment API


**Resource Types:**
    


### BackendConfig     {#BackendConfig}



{{< callout type="info" >}}
**Appears in:**

- [EnvironmentSpec](#EnvironmentSpec)
{{< /callout >}}

BackendConfig contains backend-specific configuration

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>type</code>
      
<br/>
<code>string</code>
</td>
<td>
   Type specifies the backend to use (e.g., "github")</td>
</tr>
<tr><td><code>project</code>
      
<br/>
<code>string</code>
</td>
<td>
   Project is the project identifier (backend-specific format, e.g., "owner/repo" for GitHub)</td>
</tr>
<tr><td><code>secret</code>
      
<br/>
<code>string</code>
</td>
<td>
   Secret is the name of the Kubernetes Secret containing the backend authentication token</td>
</tr>
</tbody>
</table>


## Environment     {#Environment}




Environment is the Schema for the environments API

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>metadata,omitempty,omitzero</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#objectmeta-v1-meta"><code>ObjectMeta</code></a>
</td>
<td>
   metadata is a standard object metadataRefer to the Kubernetes API documentation for the fields of the <code>metadata</code> field.</td>
</tr>
<tr><td><code>spec</code>
      
<br/>
<a href="#EnvironmentSpec"><code>EnvironmentSpec</code></a>
</td>
<td>
   spec defines the desired state of Environment</td>
</tr>
<tr><td><code>status,omitempty,omitzero</code>
      
<br/>
<a href="#EnvironmentStatus"><code>EnvironmentStatus</code></a>
</td>
<td>
   status defines the observed state of Environment</td>
</tr>
</tbody>
</table>


### EnvironmentInfo     {#EnvironmentInfo}



{{< callout type="info" >}}
**Appears in:**

- [EnvironmentStatus](#EnvironmentStatus)
{{< /callout >}}

EnvironmentInfo represents information about an environment's deployment.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>environment</code>
      
<br/>
<code>string</code>
</td>
<td>
   Environment is the canonical tier name (dev, test, staging, prod)</td>
</tr>
<tr><td><code>environmentUrl</code>
      
<br/>
<code>string</code>
</td>
<td>
   EnvironmentURL is the URL of the actual deployed environment (e.g., dashboard URL)</td>
</tr>
<tr><td><code>history</code>
      
<br/>
<a href="#DeploymentHistoryEntry"><code>[]DeploymentHistoryEntry</code></a>
</td>
<td>
   History contains deployment history entries for this environment</td>
</tr>
</tbody>
</table>


### EnvironmentRelationship     {#EnvironmentRelationship}



{{< callout type="info" >}}
**Appears in:**

- [EnvironmentSpec](#EnvironmentSpec)
{{< /callout >}}

EnvironmentRelationship is the deprecated relationship to another environment.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>environment</code>
      
<br/>
<code>string</code>
</td>
<td>
   Environment is the environment name this environment related to.</td>
</tr>
<tr><td><code>type</code>
      
<br/>
<a href="#RelationshipType"><code>RelationshipType</code></a>
</td>
<td>
   Type is the relationship type.</td>
</tr>
</tbody>
</table>


### EnvironmentSpec     {#EnvironmentSpec}



{{< callout type="info" >}}
**Appears in:**

- [Environment](#Environment)
{{< /callout >}}

EnvironmentSpec defines the desired state of Environment

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>rolloutRef</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#localobjectreference-v1-core"><code>LocalObjectReference</code></a>
</td>
<td>
   RolloutRef is a reference to the Rollout that this Environment manages</td>
</tr>
<tr><td><code>name</code>
      
<br/>
<code>string</code>
</td>
<td>
   Name is the name of the GitHub deployment (the "kuberik" prefix will be automatically added for GitHub backend if not already present)</td>
</tr>
<tr><td><code>environment</code>
      
<br/>
<code>string</code>
</td>
<td>
   Environment is the tier this Environment belongs to. Tiers have a fixed
order, earliest first: dev, test, staging, prod. Each tier accepts the
aliases listed below; aliases of one tier are the same environment for
wave grouping, upstream lookup and GitHub matching (the GitHub
environment name is kept as written here). An Environment is gated on
the nearest earlier tier that has registered sites for the same name.</td>
</tr>
<tr><td><code>relationship</code>
      
<br/>
<a href="#EnvironmentRelationship"><code>EnvironmentRelationship</code></a>
</td>
<td>
   Relationship is DEPRECATED and ignored: environment order is fixed
(dev, test, staging, prod). It is still accepted so that existing
manifests keep applying; the Environment reports a Deprecated condition.
It will be removed in a later release.</td>
</tr>
<tr><td><code>backend</code>
      
<br/>
<a href="#BackendConfig"><code>BackendConfig</code></a>
</td>
<td>
   Backend contains backend-specific configuration</td>
</tr>
<tr><td><code>site</code>
      
<br/>
<code>string</code>
</td>
<td>
   Site identifies where this instance of the environment runs (e.g. a region
or cluster name such as "eu-west-1"). Members of the same environment that
run in different clusters are told apart by site. When empty, the
controller's default site is used (key "site" of the optional
kuberik-cluster-info ConfigMap in the controller namespace), and when that
is not set either, the site is "default". Only one Environment (across
clusters) may own a given deployment name, tier and site; a second one is
reported with WaveReady=False, reason DuplicateSite, and posts nothing.</td>
</tr>
<tr><td><code>wave</code>
      
<br/>
<code>int32</code>
</td>
<td>
   Wave is the rollout wave of this site within its environment ("prod wave 1").
Waves of one environment roll out in order: wave N starts a version only
after every site of wave N-1 baked it. Defaults to 1.</td>
</tr>
<tr><td><code>lockstep</code>
      
<br/>
<code>bool</code>
</td>
<td>
   Lockstep, when true, stops the wave-1 leader from selecting a new version
until every wave of this environment has baked the currently selected one.
The wave-1 leader's value governs; a disagreeing member surfaces a
LockstepMismatch condition.</td>
</tr>
<tr><td><code>requeueInterval</code>
      
<br/>
<code>string</code>
</td>
<td>
   RequeueInterval specifies how often the controller should reconcile this Environment
If not specified, defaults to 1 minute. Must be a valid duration string (e.g., "1m", "30s", "5m").</td>
</tr>
</tbody>
</table>


### EnvironmentStatus     {#EnvironmentStatus}



{{< callout type="info" >}}
**Appears in:**

- [Environment](#Environment)
{{< /callout >}}

EnvironmentStatus defines the observed state of Environment.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>lastStatusChangeTime</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   LastStatusChangeTime is the last time the status was updated (only updated when status changes)</td>
</tr>
<tr><td><code>currentVersion</code>
      
<br/>
<code>string</code>
</td>
<td>
   CurrentVersion is the current version being deployed</td>
</tr>
<tr><td><code>rolloutGateRef</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#localobjectreference-v1-core"><code>LocalObjectReference</code></a>
</td>
<td>
   RolloutGateRef is a reference to the RolloutGate that was created/updated</td>
</tr>
<tr><td><code>environmentInfos</code>
      
<br/>
<a href="#EnvironmentInfo"><code>[]EnvironmentInfo</code></a>
</td>
<td>
   EnvironmentInfos tracks deployment information for each environment.
Each environment has environment URL and relationships (not per version).</td>
</tr>
<tr><td><code>wave</code>
      
<br/>
<a href="#WaveStatus"><code>WaveStatus</code></a>
</td>
<td>
   Wave is set for Environments with a site and describes their wave state.</td>
</tr>
<tr><td><code>conditions</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#condition-v1-meta"><code>[]Condition</code></a>
</td>
<td>
   conditions represent the current state of the Environment resource.
Each condition has a unique type and reflects the status of a specific aspect of the resource.<br/><br/>Standard condition types include:
- "Available": the resource is fully functional
- "Progressing": the resource is being created or updated
- "Degraded": the resource failed to reach or maintain its desired state<br/><br/>The status of each condition is one of True, False, or Unknown.</td>
</tr>
</tbody>
</table>


### RelationshipType     {#RelationshipType}


(Alias of `string`)

{{< callout type="info" >}}
**Appears in:**

- [EnvironmentRelationship](#EnvironmentRelationship)
{{< /callout >}}

RelationshipType is the type of the deprecated spec.relationship.




### SiteOwner     {#SiteOwner}



{{< callout type="info" >}}
**Appears in:**

- [WaveBlocker](#WaveBlocker)
{{< /callout >}}

SiteOwner identifies the Environment object that owns a site.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>cluster</code>
      
<br/>
<code>string</code>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>namespace</code>
      
<br/>
<code>string</code>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>name</code>
      
<br/>
<code>string</code>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
</tbody>
</table>


### WaveBlocker     {#WaveBlocker}



{{< callout type="info" >}}
**Appears in:**

- [WaveStatus](#WaveStatus)
{{< /callout >}}

WaveBlocker is the machine-readable form of a WaveReady=False condition. The
condition message is display text and may change; these fields are the contract.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>reason</code>
      
<br/>
<code>string</code>
</td>
<td>
   Reason is the WaveReady reason.</td>
</tr>
<tr><td><code>environment</code>
      
<br/>
<code>string</code>
</td>
<td>
   Environment is the canonical tier of the member waited on or at fault.</td>
</tr>
<tr><td><code>site</code>
      
<br/>
<code>string</code>
</td>
<td>
   Site is the member waited on.</td>
</tr>
<tr><td><code>waitingOn</code>
      
<br/>
<code>string</code>
</td>
<td>
   WaitingOn is what the wave waits for.</td>
</tr>
<tr><td><code>outcome</code>
      
<br/>
<code>string</code>
</td>
<td>
   Outcome is set when a leader's bake ended badly.</td>
</tr>
<tr><td><code>revision</code>
      
<br/>
<code>string</code>
</td>
<td>
   Revision is the full revision concerned.</td>
</tr>
<tr><td><code>pinnedVersion</code>
      
<br/>
<code>string</code>
</td>
<td>
   PinnedVersion is the version the Rollout pins (Pinned).</td>
</tr>
<tr><td><code>selectedVersion</code>
      
<br/>
<code>string</code>
</td>
<td>
   SelectedVersion is the tag of the wave's pick (Pinned).</td>
</tr>
<tr><td><code>owner</code>
      
<br/>
<a href="#SiteOwner"><code>SiteOwner</code></a>
</td>
<td>
   Owner is the existing owner of the site (DuplicateSite).</td>
</tr>
<tr><td><code>waves</code>
      
<br/>
<code>[]int32</code>
</td>
<td>
   Waves are the waves present (InvalidTopology, wave gap).</td>
</tr>
<tr><td><code>missingWaves</code>
      
<br/>
<code>[]int32</code>
</td>
<td>
   MissingWaves are the waves absent from the sequence (InvalidTopology, wave gap).</td>
</tr>
<tr><td><code>names</code>
      
<br/>
<code>[]string</code>
</td>
<td>
   Names are the alias names registered for one tier (InvalidTopology), the
offending name (UnknownTier), or, for DuplicateSite, names[0] is the
deployment name the existing owner holds the site for.</td>
</tr>
</tbody>
</table>


### WaveMemberStatus     {#WaveMemberStatus}



{{< callout type="info" >}}
**Appears in:**

- [WaveStatus](#WaveStatus)
{{< /callout >}}

WaveMemberStatus is one site of a wave as observed in the backend.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>environment</code>
      
<br/>
<code>string</code>
</td>
<td>
   Environment of the member.</td>
</tr>
<tr><td><code>site</code>
      
<br/>
<code>string</code>
</td>
<td>
   Site of the member.</td>
</tr>
<tr><td><code>wave</code>
      
<br/>
<code>int32</code>
</td>
<td>
   Wave of the member.</td>
</tr>
<tr><td><code>revision</code>
      
<br/>
<code>string</code>
</td>
<td>
   Revision of the member's newest deployment.</td>
</tr>
<tr><td><code>bakeStatus</code>
      
<br/>
<code>string</code>
</td>
<td>
   BakeStatus of the member's newest deployment.</td>
</tr>
<tr><td><code>deregistered</code>
      
<br/>
<code>bool</code>
</td>
<td>
   Deregistered is true when the member was removed and no longer counts.</td>
</tr>
</tbody>
</table>


### WaveRole     {#WaveRole}


(Alias of `string`)

{{< callout type="info" >}}
**Appears in:**

- [WaveStatus](#WaveStatus)
{{< /callout >}}

WaveRole is the role a site plays inside its (environment, wave).




### WaveStatus     {#WaveStatus}



{{< callout type="info" >}}
**Appears in:**

- [EnvironmentStatus](#EnvironmentStatus)
{{< /callout >}}

WaveStatus describes the site/wave view the controller used for the last gate decision.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>site</code>
      
<br/>
<code>string</code>
</td>
<td>
   Site is the effective site of this Environment (spec or controller default).</td>
</tr>
<tr><td><code>environment</code>
      
<br/>
<code>string</code>
</td>
<td>
   Environment is the environment name this site was registered under in
GitHub. Deregistration uses it even after spec.environment changed.</td>
</tr>
<tr><td><code>name</code>
      
<br/>
<code>string</code>
</td>
<td>
   Name is the deployment name as written to GitHub (with the kuberik prefix).
Deregistration uses it even after spec.name changed.</td>
</tr>
<tr><td><code>wave</code>
      
<br/>
<code>int32</code>
</td>
<td>
   Wave is the effective wave of this Environment.</td>
</tr>
<tr><td><code>role</code>
      
<br/>
<a href="#WaveRole"><code>WaveRole</code></a>
</td>
<td>
   Role is Leader or Follower within (environment, wave). It is also the role
recorded on the next GitHub deployment this site creates.</td>
</tr>
<tr><td><code>leader</code>
      
<br/>
<code>string</code>
</td>
<td>
   Leader is the site leading this (environment, wave).</td>
</tr>
<tr><td><code>selectedRevision</code>
      
<br/>
<code>string</code>
</td>
<td>
   SelectedRevision is the revision the leader of this wave currently selected.</td>
</tr>
<tr><td><code>members</code>
      
<br/>
<a href="#WaveMemberStatus"><code>[]WaveMemberStatus</code></a>
</td>
<td>
   Members are the registered sites of this environment and of its upstream environment.</td>
</tr>
<tr><td><code>blocker</code>
      
<br/>
<a href="#WaveBlocker"><code>WaveBlocker</code></a>
</td>
<td>
   Blocker explains why the site is not Ready; nil when WaveReady is True.</td>
</tr>
</tbody>
</table>

# OpenKruise Integration API


**Resource Types:**
    


## RolloutTest     {#RolloutTest}




RolloutTest is the Schema for the rollouttests API

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>metadata,omitempty,omitzero</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#objectmeta-v1-meta"><code>ObjectMeta</code></a>
</td>
<td>
   metadata is a standard object metadataRefer to the Kubernetes API documentation for the fields of the <code>metadata</code> field.</td>
</tr>
<tr><td><code>spec</code>
      
<br/>
<a href="#RolloutTestSpec"><code>RolloutTestSpec</code></a>
</td>
<td>
   spec defines the desired state of RolloutTest</td>
</tr>
<tr><td><code>status,omitempty,omitzero</code>
      
<br/>
<a href="#RolloutTestStatus"><code>RolloutTestStatus</code></a>
</td>
<td>
   status defines the observed state of RolloutTest</td>
</tr>
</tbody>
</table>


### RolloutTestSpec     {#RolloutTestSpec}



{{< callout type="info" >}}
**Appears in:**

- [RolloutTest](#RolloutTest)
{{< /callout >}}

RolloutTestSpec defines the desired state of RolloutTest

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>rolloutName</code>
      
<br/>
<code>string</code>
</td>
<td>
   RolloutName is the name of the Rollout to watch.</td>
</tr>
<tr><td><code>stepIndex</code>
      
<br/>
<code>int32</code>
</td>
<td>
   StepIndex is the index of the step in the Rollout strategy to execute the test at.</td>
</tr>
<tr><td><code>jobTemplate</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#jobspec-v1-batch"><code>k8s.io/api/batch/v1.JobSpec</code></a>
</td>
<td>
   JobTemplate is the template for the Job to run.</td>
</tr>
</tbody>
</table>


### RolloutTestStatus     {#RolloutTestStatus}



{{< callout type="info" >}}
**Appears in:**

- [RolloutTest](#RolloutTest)
{{< /callout >}}

RolloutTestStatus defines the observed state of RolloutTest.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>conditions</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#condition-v1-meta"><code>[]Condition</code></a>
</td>
<td>
   Conditions store the status conditions of the RolloutTest.</td>
</tr>
<tr><td><code>observedCanaryRevision</code>
      
<br/>
<code>string</code>
</td>
<td>
   ObservedCanaryRevision is the canaryRevision from the Rollout that the current job was created for.
When the canaryRevision changes, it indicates a new rollout and the old job should be deleted.</td>
</tr>
<tr><td><code>phase</code>
      
<br/>
<a href="#RolloutTestPhase"><code>RolloutTestPhase</code></a>
</td>
<td>
   Phase represents the current phase of the RolloutTest</td>
</tr>
<tr><td><code>jobName</code>
      
<br/>
<code>string</code>
</td>
<td>
   JobName is the name of the Job created for this test</td>
</tr>
<tr><td><code>retryCount</code>
      
<br/>
<code>int32</code>
</td>
<td>
   RetryCount is the number of times the job has been retried (from job status)</td>
</tr>
<tr><td><code>activePods</code>
      
<br/>
<code>int32</code>
</td>
<td>
   ActivePods is the number of active pods for the job</td>
</tr>
<tr><td><code>succeededPods</code>
      
<br/>
<code>int32</code>
</td>
<td>
   SucceededPods is the number of succeeded pods for the job</td>
</tr>
<tr><td><code>failedPods</code>
      
<br/>
<code>int32</code>
</td>
<td>
   FailedPods is the number of failed pods for the job</td>
</tr>
</tbody>
</table>

# Release API


**Resource Types:**
    


### AlphabeticalPolicy     {#AlphabeticalPolicy}



{{< callout type="info" >}}
**Appears in:**

- [OrderPolicy](#OrderPolicy)
{{< /callout >}}

AlphabeticalPolicy orders tags alphabetically.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>order</code>
      
<br/>
<code>string</code>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
</tbody>
</table>


### ArtifactMetadata     {#ArtifactMetadata}



{{< callout type="info" >}}
**Appears in:**

- [ReleaseSourceStatus](#ReleaseSourceStatus)
{{< /callout >}}

ArtifactMetadata is the artifact-level metadata of the newest release.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>type</code>
      
<br/>
<code>string</code>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>sourceURL</code>
      
<br/>
<code>string</code>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>title</code>
      
<br/>
<code>string</code>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>description</code>
      
<br/>
<code>string</code>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
</tbody>
</table>


### NumericalPolicy     {#NumericalPolicy}



{{< callout type="info" >}}
**Appears in:**

- [OrderPolicy](#OrderPolicy)
{{< /callout >}}

NumericalPolicy orders tags numerically.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>order</code>
      
<br/>
<code>string</code>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
</tbody>
</table>


### OCISource     {#OCISource}



{{< callout type="info" >}}
**Appears in:**

- [ReleaseSourceSpec](#ReleaseSourceSpec)
{{< /callout >}}

OCISource configures an OCI repository source.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>image</code>
      
<br/>
<code>string</code>
</td>
<td>
   Image is the repository, e.g. ghcr.io/org/app.</td>
</tr>
<tr><td><code>secretRef</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#localobjectreference-v1-core"><code>LocalObjectReference</code></a>
</td>
<td>
   SecretRef names a kubernetes.io/dockerconfigjson Secret.</td>
</tr>
<tr><td><code>insecure</code>
      
<br/>
<code>bool</code>
</td>
<td>
   Insecure allows plain HTTP registries.</td>
</tr>
<tr><td><code>filterTags</code>
      
<br/>
<a href="#TagFilter"><code>TagFilter</code></a>
</td>
<td>
   FilterTags has the Flux ImagePolicy shape.</td>
</tr>
<tr><td><code>policy</code>
      
<br/>
<a href="#OrderPolicy"><code>OrderPolicy</code></a>
</td>
<td>
   Policy has the Flux ImagePolicy shape. Required with image: release
order and admission are defined by it (with imagePolicyRef the
ImagePolicy carries it).</td>
</tr>
<tr><td><code>imagePolicyRef</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#localobjectreference-v1-core"><code>LocalObjectReference</code></a>
</td>
<td>
   ImagePolicyRef reads image, secretRef, filterTags and policy from an
existing Flux ImagePolicy and its ImageRepository (spec only); policy
and filterTags must not be set with it.</td>
</tr>
</tbody>
</table>


### OrderPolicy     {#OrderPolicy}



{{< callout type="info" >}}
**Appears in:**

- [OCISource](#OCISource)
{{< /callout >}}

OrderPolicy picks how tags are ordered (Flux ImagePolicy shape). At most one member.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>semver</code>
      
<br/>
<a href="#SemVerPolicy"><code>SemVerPolicy</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>alphabetical</code>
      
<br/>
<a href="#AlphabeticalPolicy"><code>AlphabeticalPolicy</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>numerical</code>
      
<br/>
<a href="#NumericalPolicy"><code>NumericalPolicy</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
</tbody>
</table>


### Release     {#Release}



{{< callout type="info" >}}
**Appears in:**

- [ReleaseSlice](#ReleaseSlice)
{{< /callout >}}

Release is one catalogue entry. It is a superset of rollout-controller's
VersionInfo (tag, digest, version, revision, created, requires,
metadataUnresolved).<br/><br/>CEL cost: Requires and Metadata sit inside a list with maxItems 1000, so
their rules are written as a single self.all(k, ...) over a bounded map
(maxProperties 32 / 8) and string maxLengths are declared on the values'
schema so the apiserver can estimate cost.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>tag</code>
      
<br/>
<code>string</code>
</td>
<td>
   Tag is the deployable reference. Unique per source.</td>
</tr>
<tr><td><code>digest</code>
      
<br/>
<code>string</code>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>version</code>
      
<br/>
<code>string</code>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>revision</code>
      
<br/>
<code>string</code>
</td>
<td>
   Revision is a git SHA by contract.</td>
</tr>
<tr><td><code>sequence</code>
      
<br/>
<code>int64</code>
</td>
<td>
   Sequence is the admission order. Readers sort by it (not by created).
Sequence order equals policy order: incremental releases get max+1..,
backfilled releases get min-1.. going down. Never renumbered.</td>
</tr>
<tr><td><code>created</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   Created is source-provided, else firstSeen (createdObserved=true).</td>
</tr>
<tr><td><code>createdObserved</code>
      
<br/>
<code>bool</code>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>firstSeen</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   FirstSeen is when this catalogue first admitted the release.</td>
</tr>
<tr><td><code>requires</code>
      
<br/>
<code>map[string]string</code>
</td>
<td>
   Requires: keys <= 64, values <= 256 (same as VersionInfo.Requires).</td>
</tr>
<tr><td><code>metadataUnresolved</code>
      
<br/>
<code>bool</code>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>url</code>
      
<br/>
<code>string</code>
</td>
<td>
   URL of the release page.</td>
</tr>
<tr><td><code>metadata</code>
      
<br/>
<code>map[string]string</code>
</td>
<td>
   Metadata is source-specific and small; OCI v1 leaves it empty.</td>
</tr>
</tbody>
</table>


### ReleaseRef     {#ReleaseRef}



{{< callout type="info" >}}
**Appears in:**

- [ReleaseSourceStatus](#ReleaseSourceStatus)
{{< /callout >}}

ReleaseRef identifies the newest release.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>tag</code>
      
<br/>
<code>string</code>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>created</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>revision</code>
      
<br/>
<code>string</code>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
</tbody>
</table>


## ReleaseSlice     {#ReleaseSlice}




ReleaseSlice holds a bounded chunk of a ReleaseSource catalogue. Like
EndpointSlice it has no spec/status. Labelled kuberik.com/release-source,
owned (controller=true) by its ReleaseSource, named <source>-<5-digit index>.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>metadata</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#objectmeta-v1-meta"><code>ObjectMeta</code></a>
</td>
<td>
   <em>No description provided. </em>Refer to the Kubernetes API documentation for the fields of the <code>metadata</code> field.</td>
</tr>
<tr><td><code>source</code>
      
<br/>
<code>string</code>
</td>
<td>
   Source is the owning ReleaseSource name. Immutable.</td>
</tr>
<tr><td><code>sealed</code>
      
<br/>
<code>bool</code>
</td>
<td>
   Sealed slices take no new releases. Once true stays true.
Always serialised (no omitempty) and defaulted to false so the
transition rule also sees true -> false from clients that drop zero values.</td>
</tr>
<tr><td><code>oldestCreated</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>newestCreated</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>releases</code>
      
<br/>
<a href="#Release"><code>[]Release</code></a>
</td>
<td>
   Releases sorted by sequence ascending.</td>
</tr>
</tbody>
</table>


## ReleaseSource     {#ReleaseSource}




ReleaseSource is the Schema for the releasesources API.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>metadata</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#objectmeta-v1-meta"><code>ObjectMeta</code></a>
</td>
<td>
   <em>No description provided. </em>Refer to the Kubernetes API documentation for the fields of the <code>metadata</code> field.</td>
</tr>
<tr><td><code>spec</code>
      
<br/>
<a href="#ReleaseSourceSpec"><code>ReleaseSourceSpec</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>status</code>
      
<br/>
<a href="#ReleaseSourceStatus"><code>ReleaseSourceStatus</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
</tbody>
</table>


### ReleaseSourceSpec     {#ReleaseSourceSpec}



{{< callout type="info" >}}
**Appears in:**

- [ReleaseSource](#ReleaseSource)
{{< /callout >}}

ReleaseSourceSpec is a discriminated union: exactly one source member must
be set. v1 has only oci.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>oci</code>
      
<br/>
<a href="#OCISource"><code>OCISource</code></a>
</td>
<td>
   OCI lists tags of an OCI repository.</td>
</tr>
<tr><td><code>interval</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#duration-v1-meta"><code>Duration</code></a>
</td>
<td>
   Interval between syncs. Jittered +-10% by the controller.</td>
</tr>
<tr><td><code>suspend</code>
      
<br/>
<code>bool</code>
</td>
<td>
   Suspend stops syncing while true.</td>
</tr>
<tr><td><code>retention</code>
      
<br/>
<a href="#Retention"><code>Retention</code></a>
</td>
<td>
   Retention controls when whole old slices are dropped.</td>
</tr>
</tbody>
</table>


### ReleaseSourceStatus     {#ReleaseSourceStatus}



{{< callout type="info" >}}
**Appears in:**

- [ReleaseSource](#ReleaseSource)
{{< /callout >}}

ReleaseSourceStatus defines the observed state of ReleaseSource.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>observedGeneration</code>
      
<br/>
<code>int64</code>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>newest</code>
      
<br/>
<a href="#ReleaseRef"><code>ReleaseRef</code></a>
</td>
<td>
   Newest is the newest release in the catalogue.</td>
</tr>
<tr><td><code>count</code>
      
<br/>
<code>int32</code>
</td>
<td>
   Count of releases in the catalogue.</td>
</tr>
<tr><td><code>sliceCount</code>
      
<br/>
<code>int32</code>
</td>
<td>
   SliceCount is the number of ReleaseSlices of this source. Slice names
are not listed (an unbounded catalogue would overflow any list bound);
readers select slices by the kuberik.com/release-source label.</td>
</tr>
<tr><td><code>openSlice</code>
      
<br/>
<code>string</code>
</td>
<td>
   OpenSlice is the name of the slice taking new releases ("" if none).</td>
</tr>
<tr><td><code>backfillComplete</code>
      
<br/>
<code>bool</code>
</td>
<td>
   BackfillComplete is true once the catalogue reaches back to the
retention window (or the registry has no older tags). While false the
controller keeps walking older tags in policy-descending order.</td>
</tr>
<tr><td><code>nextSliceIndex</code>
      
<br/>
<code>int32</code>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>artifact</code>
      
<br/>
<a href="#ArtifactMetadata"><code>ArtifactMetadata</code></a>
</td>
<td>
   Artifact metadata of the newest release.</td>
</tr>
<tr><td><code>cursor</code>
      
<br/>
<code>string</code>
</td>
<td>
   Cursor is source-opaque (e.g. an ETag).</td>
</tr>
<tr><td><code>lastSyncTime</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>conditions</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#condition-v1-meta"><code>[]Condition</code></a>
</td>
<td>
   Conditions: Ready, SourceReachable, Syncing.</td>
</tr>
</tbody>
</table>


### Retention     {#Retention}



{{< callout type="info" >}}
**Appears in:**

- [ReleaseSourceSpec](#ReleaseSourceSpec)
{{< /callout >}}

Retention mirrors Rollout.availableReleasesRetentionDays / MinCount.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>days</code>
      
<br/>
<code>int32</code>
</td>
<td>
   Days after which a release counts as expired. 0 means age never expires anything.</td>
</tr>
<tr><td><code>minCount</code>
      
<br/>
<code>int32</code>
</td>
<td>
   MinCount is the number of newest releases always kept.</td>
</tr>
</tbody>
</table>


### SemVerPolicy     {#SemVerPolicy}



{{< callout type="info" >}}
**Appears in:**

- [OrderPolicy](#OrderPolicy)
{{< /callout >}}

SemVerPolicy orders tags by semantic version within a range.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>range</code>
      
<br/>
<code>string</code>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
</tbody>
</table>


### TagFilter     {#TagFilter}



{{< callout type="info" >}}
**Appears in:**

- [OCISource](#OCISource)
{{< /callout >}}

TagFilter filters tags by regular expression (Flux ImagePolicy shape).

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>pattern</code>
      
<br/>
<code>string</code>
</td>
<td>
   Pattern is a regular expression tags must match.</td>
</tr>
<tr><td><code>extract</code>
      
<br/>
<code>string</code>
</td>
<td>
   Extract is a capture-group expression applied before ordering.</td>
</tr>
</tbody>
</table>

# Rollout API


**Resource Types:**
    


### BlockedRelease     {#BlockedRelease}



{{< callout type="info" >}}
**Appears in:**

- [RolloutDependencyStatus](#RolloutDependencyStatus)
{{< /callout >}}

BlockedRelease describes a consumer release candidate held back by this
dependency, and why.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>tag</code>
      
<br/>
<code>string</code>
</td>
<td>
   Tag is the image tag of the blocked release candidate.</td>
</tr>
<tr><td><code>requiredVersion</code>
      
<br/>
<code>string</code>
</td>
<td>
   RequiredVersion is the version constraint the candidate places on the
provider's contract, verbatim from its requires annotation.</td>
</tr>
<tr><td><code>reason</code>
      
<br/>
<code>string</code>
</td>
<td>
   Reason is a short, machine-readable reason the candidate is blocked.</td>
</tr>
</tbody>
</table>


## ClusterRolloutSchedule     {#ClusterRolloutSchedule}




ClusterRolloutSchedule is the Schema for the clusterrolloutschedules API.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>metadata</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#objectmeta-v1-meta"><code>ObjectMeta</code></a>
</td>
<td>
   <em>No description provided. </em>Refer to the Kubernetes API documentation for the fields of the <code>metadata</code> field.</td>
</tr>
<tr><td><code>spec</code>
      
<br/>
<a href="#ClusterRolloutScheduleSpec"><code>ClusterRolloutScheduleSpec</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>status</code>
      
<br/>
<a href="#ClusterRolloutScheduleStatus"><code>ClusterRolloutScheduleStatus</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
</tbody>
</table>


### ClusterRolloutScheduleSpec     {#ClusterRolloutScheduleSpec}



{{< callout type="info" >}}
**Appears in:**

- [ClusterRolloutSchedule](#ClusterRolloutSchedule)
{{< /callout >}}

ClusterRolloutScheduleSpec defines the desired state of ClusterRolloutSchedule.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>rolloutSelector</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#labelselector-v1-meta"><code>LabelSelector</code></a>
</td>
<td>
   RolloutSelector is a label selector to match Rollouts across namespaces.</td>
</tr>
<tr><td><code>namespaceSelector</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#labelselector-v1-meta"><code>LabelSelector</code></a>
</td>
<td>
   NamespaceSelector is a label selector to match namespaces.
If empty, applies to all namespaces.</td>
</tr>
<tr><td><code>rules</code>
      
<br/>
<a href="#ScheduleRule"><code>[]ScheduleRule</code></a>
</td>
<td>
   Rules is a list of schedule rules.
The schedule is active if ANY rule matches the current time/date.</td>
</tr>
<tr><td><code>timezone</code>
      
<br/>
<code>string</code>
</td>
<td>
   Timezone is the IANA timezone for the schedule (e.g., "America/New_York").
Defaults to "UTC" if not specified.</td>
</tr>
<tr><td><code>action</code>
      
<br/>
<a href="#RolloutScheduleAction"><code>RolloutScheduleAction</code></a>
</td>
<td>
   Action defines what to do when the schedule is active.
- "Allow": Gate passes when active, blocks when inactive
- "Deny": Gate blocks when active, passes when inactive</td>
</tr>
</tbody>
</table>


### ClusterRolloutScheduleStatus     {#ClusterRolloutScheduleStatus}



{{< callout type="info" >}}
**Appears in:**

- [ClusterRolloutSchedule](#ClusterRolloutSchedule)
{{< /callout >}}

ClusterRolloutScheduleStatus defines the observed state of ClusterRolloutSchedule.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>active</code>
      
<br/>
<code>bool</code>
</td>
<td>
   Active indicates if the schedule is currently active (any rule matches).</td>
</tr>
<tr><td><code>activeRules</code>
      
<br/>
<code>[]string</code>
</td>
<td>
   ActiveRules is a list of rule names that are currently active.</td>
</tr>
<tr><td><code>nextTransition</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   NextTransition is the timestamp when the active state will next change.</td>
</tr>
<tr><td><code>managedGates</code>
      
<br/>
<code>[]string</code>
</td>
<td>
   ManagedGates is a list of RolloutGate names being managed by this schedule.
Format: "namespace/name"</td>
</tr>
<tr><td><code>matchingRollouts</code>
      
<br/>
<code>int</code>
</td>
<td>
   MatchingRollouts is the count of rollouts currently matched by the selectors.</td>
</tr>
<tr><td><code>conditions</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#condition-v1-meta"><code>[]Condition</code></a>
</td>
<td>
   Conditions represents the current state of the schedule.</td>
</tr>
</tbody>
</table>


### DateRange     {#DateRange}



{{< callout type="info" >}}
**Appears in:**

- [ScheduleRule](#ScheduleRule)
{{< /callout >}}

DateRange represents a date range.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>start</code>
      
<br/>
<code>string</code>
</td>
<td>
   Start date in YYYY-MM-DD format</td>
</tr>
<tr><td><code>end</code>
      
<br/>
<code>string</code>
</td>
<td>
   End date in YYYY-MM-DD format</td>
</tr>
</tbody>
</table>


### DayOfWeek     {#DayOfWeek}


(Alias of `string`)

{{< callout type="info" >}}
**Appears in:**

- [ScheduleRule](#ScheduleRule)
{{< /callout >}}

DayOfWeek represents a day of the week.




### DeploymentHistoryEntry     {#DeploymentHistoryEntry}



{{< callout type="info" >}}
**Appears in:**

- [RolloutStatus](#RolloutStatus)
{{< /callout >}}

DeploymentHistoryEntry represents a single entry in the deployment history.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>id</code>
      
<br/>
<code>int64</code>
</td>
<td>
   ID is a unique auto-incrementing identifier for this history entry.</td>
</tr>
<tr><td><code>version</code>
      
<br/>
<a href="#VersionInfo"><code>VersionInfo</code></a>
</td>
<td>
   Version is the version information that was deployed.</td>
</tr>
<tr><td><code>timestamp</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   Timestamp is the time when the deployment occurred.</td>
</tr>
<tr><td><code>message</code>
      
<br/>
<code>string</code>
</td>
<td>
   Message provides a descriptive message about this deployment entry
This field contains human-readable information about the deployment context.
For automatic deployments, it includes information about gate bypass and failed bake unblock.
For manual deployments (when wantedVersion is specified), it can contain a custom message
provided via the "rollout.kuberik.com/deployment-message" annotation, or defaults to "Manual deployment".</td>
</tr>
<tr><td><code>triggeredBy</code>
      
<br/>
<a href="#TriggeredByInfo"><code>TriggeredByInfo</code></a>
</td>
<td>
   TriggeredBy indicates what triggered this deployment.
Kind can be "User" for manual deployments triggered by a user, or "System" for automatic deployments.
Name contains the name of the user or system that triggered the deployment.
For user-triggered deployments, this is extracted from the "rollout.kuberik.com/deploy-user" annotation.
For system-triggered deployments, this is typically "rollout-controller".</td>
</tr>
<tr><td><code>bakeStatus</code>
      
<br/>
<code>string</code>
</td>
<td>
   BakeStatus tracks the bake state for this deployment (e.g., None, InProgress, Succeeded, Failed, Cancelled)
The bake process ensures that the deployment is stable and healthy before marking as successful.</td>
</tr>
<tr><td><code>bakeStatusMessage</code>
      
<br/>
<code>string</code>
</td>
<td>
   BakeStatusMessage provides details about the bake state for this deployment
This field contains human-readable information about why the bake status is what it is.</td>
</tr>
<tr><td><code>bakeStartTime</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   BakeStartTime is the time when the bake period started for this deployment
This is when the rollout controller began monitoring the deployment for stability.</td>
</tr>
<tr><td><code>bakeEndTime</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   BakeEndTime is the time when the bake period ended for this deployment
This is when the bake process completed (either successfully or with failure).</td>
</tr>
<tr><td><code>failedHealthChecks</code>
      
<br/>
<a href="#FailedHealthCheck"><code>[]FailedHealthCheck</code></a>
</td>
<td>
   FailedHealthChecks contains all health checks that failed during bake.
This field is populated when bake fails due to health check errors.</td>
</tr>
<tr><td><code>lastRetryTimestamp</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   LastRetryTimestamp is the time when a retry was most recently requested for this deployment.
When set, downstream controllers (health checks, kruise rollout step gates) use this as a
cutoff: stale failure conditions with LastTransitionTime older than LastRetryTimestamp are
ignored as they reflect the pre-retry state.</td>
</tr>
</tbody>
</table>


### FailedHealthCheck     {#FailedHealthCheck}



{{< callout type="info" >}}
**Appears in:**

- [DeploymentHistoryEntry](#DeploymentHistoryEntry)
{{< /callout >}}

FailedHealthCheck represents a health check that failed during bake.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code>
      
<br/>
<code>string</code>
</td>
<td>
   Name is the name of the health check.</td>
</tr>
<tr><td><code>namespace</code>
      
<br/>
<code>string</code>
</td>
<td>
   Namespace is the namespace of the health check.</td>
</tr>
<tr><td><code>message</code>
      
<br/>
<code>string</code>
</td>
<td>
   Message is the error message from the health check.</td>
</tr>
<tr><td><code>observations</code>
      
<br/>
<a href="#HealthCheckObservation"><code>[]HealthCheckObservation</code></a>
</td>
<td>
   Observations is a snapshot of the health check's status.observations taken
when the failure was recorded. It is not updated afterwards, so the figure
survives the health check recovering.</td>
</tr>
</tbody>
</table>


## HealthCheck     {#HealthCheck}




HealthCheck is the Schema for the healthchecks API.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>metadata</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#objectmeta-v1-meta"><code>ObjectMeta</code></a>
</td>
<td>
   <em>No description provided. </em>Refer to the Kubernetes API documentation for the fields of the <code>metadata</code> field.</td>
</tr>
<tr><td><code>spec</code>
      
<br/>
<a href="#HealthCheckSpec"><code>HealthCheckSpec</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>status</code>
      
<br/>
<a href="#HealthCheckStatus"><code>HealthCheckStatus</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
</tbody>
</table>


### HealthCheckObservation     {#HealthCheckObservation}



{{< callout type="info" >}}
**Appears in:**

- [FailedHealthCheck](#FailedHealthCheck)

- [HealthCheckStatus](#HealthCheckStatus)
{{< /callout >}}

HealthCheckObservation is one typed fact a health check evaluated.
Numeric fields are decimal strings (e.g. "8.2", "0.082") so no precision is lost
and the CRD stays float-free.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code>
      
<br/>
<code>string</code>
</td>
<td>
   Name of the observed quantity, shown as the label ("error rate", "p99 latency").</td>
</tr>
<tr><td><code>kind</code>
      
<br/>
<a href="#HealthCheckObservationKind"><code>HealthCheckObservationKind</code></a>
</td>
<td>
   Kind picks the drawing: Threshold (value vs limit), Ratio (value of total),
Count (value), State (no number; label only).</td>
</tr>
<tr><td><code>value</code>
      
<br/>
<code>string</code>
</td>
<td>
   Value is the observed number, as a decimal string.</td>
</tr>
<tr><td><code>limit</code>
      
<br/>
<code>string</code>
</td>
<td>
   Limit is the boundary for a Threshold observation, as a decimal string.</td>
</tr>
<tr><td><code>total</code>
      
<br/>
<code>string</code>
</td>
<td>
   Total is the denominator for a Ratio observation, as a decimal string.</td>
</tr>
<tr><td><code>direction</code>
      
<br/>
<a href="#HealthCheckObservationDirection"><code>HealthCheckObservationDirection</code></a>
</td>
<td>
   Direction, for Threshold: Above is bad when value > limit; Below is bad when value < limit.</td>
</tr>
<tr><td><code>unit</code>
      
<br/>
<code>string</code>
</td>
<td>
   Unit of the numbers: Percent (a ratio 0..1), Milliseconds, Seconds, Count, or free text.</td>
</tr>
<tr><td><code>window</code>
      
<br/>
<code>string</code>
</td>
<td>
   Window the observation covers, e.g. "5m".</td>
</tr>
<tr><td><code>healthy</code>
      
<br/>
<code>bool</code>
</td>
<td>
   Healthy says whether this observation alone is within bounds, so a consumer
can mark the offending one when several are listed.</td>
</tr>
<tr><td><code>observedTime</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   ObservedTime is when the provider last evaluated this observation.</td>
</tr>
</tbody>
</table>


### HealthCheckObservationDirection     {#HealthCheckObservationDirection}


(Alias of `string`)

{{< callout type="info" >}}
**Appears in:**

- [HealthCheckObservation](#HealthCheckObservation)
{{< /callout >}}

HealthCheckObservationDirection says which side of a Threshold limit is bad.




### HealthCheckObservationKind     {#HealthCheckObservationKind}


(Alias of `string`)

{{< callout type="info" >}}
**Appears in:**

- [HealthCheckObservation](#HealthCheckObservation)
{{< /callout >}}

HealthCheckObservationKind selects how an observation is drawn.




### HealthCheckSelectorConfig     {#HealthCheckSelectorConfig}



{{< callout type="info" >}}
**Appears in:**

- [RolloutSpec](#RolloutSpec)
{{< /callout >}}

HealthCheckSelectorConfig defines how to select HealthChecks for a rollout.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>selector</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#labelselector-v1-meta"><code>LabelSelector</code></a>
</td>
<td>
   Selector specifies the label selector for matching HealthChecks</td>
</tr>
<tr><td><code>namespaceSelector</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#labelselector-v1-meta"><code>LabelSelector</code></a>
</td>
<td>
   NamespaceSelector specifies the namespace selector for matching HealthChecks
If not specified, only HealthChecks in the same namespace as the Rollout will be considered</td>
</tr>
</tbody>
</table>


### HealthCheckSpec     {#HealthCheckSpec}



{{< callout type="info" >}}
**Appears in:**

- [HealthCheck](#HealthCheck)
{{< /callout >}}

HealthCheckSpec defines the desired state of HealthCheck.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>class</code>
      
<br/>
<code>string</code>
</td>
<td>
   Class specifies the type of health check (e.g., 'kustomization')</td>
</tr>
</tbody>
</table>


### HealthCheckStatus     {#HealthCheckStatus}



{{< callout type="info" >}}
**Appears in:**

- [HealthCheck](#HealthCheck)
{{< /callout >}}

HealthCheckStatus defines the observed state of HealthCheck.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>status</code>
      
<br/>
<a href="#HealthStatus"><code>HealthStatus</code></a>
</td>
<td>
   Status indicates the health state of the check (e.g., 'Healthy', 'Unhealthy', 'Pending')</td>
</tr>
<tr><td><code>lastErrorTime</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   LastErrorTime is the timestamp of the most recent error state</td>
</tr>
<tr><td><code>message</code>
      
<br/>
<code>string</code>
</td>
<td>
   Message provides additional details about the health status</td>
</tr>
<tr><td><code>lastChangeTime</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   LastChangeTime is the timestamp when the health status last changed</td>
</tr>
<tr><td><code>observations</code>
      
<br/>
<a href="#HealthCheckObservation"><code>[]HealthCheckObservation</code></a>
</td>
<td>
   Observations are the facts the check last evaluated, most important first.
Consumers (the dashboard) draw the first one as the headline figure; Message
stays the human sentence. Providers may leave this empty.</td>
</tr>
</tbody>
</table>


### HealthStatus     {#HealthStatus}


(Alias of `string`)

{{< callout type="info" >}}
**Appears in:**

- [HealthCheckStatus](#HealthCheckStatus)
{{< /callout >}}





### ProviderRolloutReference     {#ProviderRolloutReference}



{{< callout type="info" >}}
**Appears in:**

- [RolloutDependencySpec](#RolloutDependencySpec)
{{< /callout >}}

ProviderRolloutReference identifies the Rollout that provides a contract.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code>
      
<br/>
<code>string</code>
</td>
<td>
   Name is the name of the providing Rollout.</td>
</tr>
<tr><td><code>namespace</code>
      
<br/>
<code>string</code>
</td>
<td>
   Namespace is the namespace of the providing Rollout.
Defaults to the namespace of the RolloutDependency.</td>
</tr>
</tbody>
</table>


### ReleaseCandidate     {#ReleaseCandidate}



{{< callout type="info" >}}
**Appears in:**

- [RolloutStatus](#RolloutStatus)
{{< /callout >}}

ReleaseCandidate is a release the Rollout could deploy next. It is
deliberately lean: full release metadata (digest, revision, version,
requires) lives in the ReleaseSlice catalogue and in history entries.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>tag</code>
      
<br/>
<code>string</code>
</td>
<td>
   Tag is the release tag.</td>
</tr>
<tr><td><code>created</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   Created is the release creation time.</td>
</tr>
<tr><td><code>firstSeen</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   FirstSeen is when the catalogue first admitted this release.</td>
</tr>
<tr><td><code>gated</code>
      
<br/>
<code>bool</code>
</td>
<td>
   Gated is true when the release passes every gate.</td>
</tr>
<tr><td><code>blockedBy</code>
      
<br/>
<code>[]string</code>
</td>
<td>
   BlockedBy lists the gates that do not let this release through.</td>
</tr>
</tbody>
</table>


### ReleaseSourceStatusRef     {#ReleaseSourceStatusRef}



{{< callout type="info" >}}
**Appears in:**

- [RolloutStatus](#RolloutStatus)
{{< /callout >}}

ReleaseSourceStatusRef is a Rollout's view of its ReleaseSource.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code>
      
<br/>
<code>string</code>
</td>
<td>
   Name of the ReleaseSource.</td>
</tr>
<tr><td><code>ready</code>
      
<br/>
<code>bool</code>
</td>
<td>
   Ready mirrors the ReleaseSource Ready condition.</td>
</tr>
<tr><td><code>count</code>
      
<br/>
<code>int32</code>
</td>
<td>
   Count is the number of releases in the catalogue.</td>
</tr>
<tr><td><code>newest</code>
      
<br/>
<code>string</code>
</td>
<td>
   Newest is the tag of the newest release in the catalogue.</td>
</tr>
<tr><td><code>observedAt</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   ObservedAt is when name, ready, count or newest last changed.</td>
</tr>
</tbody>
</table>


## Rollout     {#Rollout}




Rollout is the Schema for the rollouts API.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>metadata</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#objectmeta-v1-meta"><code>ObjectMeta</code></a>
</td>
<td>
   <em>No description provided. </em>Refer to the Kubernetes API documentation for the fields of the <code>metadata</code> field.</td>
</tr>
<tr><td><code>spec</code>
      
<br/>
<a href="#RolloutSpec"><code>RolloutSpec</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>status</code>
      
<br/>
<a href="#RolloutStatus"><code>RolloutStatus</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
</tbody>
</table>


## RolloutDependency     {#RolloutDependency}




RolloutDependency is the Schema for the rolloutdependencies API

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>metadata,omitzero</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#objectmeta-v1-meta"><code>ObjectMeta</code></a>
</td>
<td>
   metadata is a standard object metadataRefer to the Kubernetes API documentation for the fields of the <code>metadata</code> field.</td>
</tr>
<tr><td><code>spec</code>
      
<br/>
<a href="#RolloutDependencySpec"><code>RolloutDependencySpec</code></a>
</td>
<td>
   spec defines the desired state of RolloutDependency</td>
</tr>
<tr><td><code>status,omitzero</code>
      
<br/>
<a href="#RolloutDependencyStatus"><code>RolloutDependencyStatus</code></a>
</td>
<td>
   status defines the observed state of RolloutDependency</td>
</tr>
</tbody>
</table>


### RolloutDependencySpec     {#RolloutDependencySpec}



{{< callout type="info" >}}
**Appears in:**

- [RolloutDependency](#RolloutDependency)
{{< /callout >}}

RolloutDependencySpec defines the desired state of RolloutDependency.<br/><br/>A RolloutDependency gates a consumer Rollout on the deployed contract version
of a provider Rollout. Each release candidate of the consumer declares what it
requires of the contract via a "com.kuberik.rollout.requires.<contract>" OCI
annotation. A candidate is admitted only once the provider has successfully
deployed a release whose own contract version
(org.opencontainers.image.version) satisfies that constraint. The result is a
topological rollout: providers advance before the consumers that depend on
them.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>rolloutRef</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#localobjectreference-v1-core"><code>LocalObjectReference</code></a>
</td>
<td>
   RolloutRef references the consumer Rollout that this dependency gates.
The Rollout must live in the same namespace as this RolloutDependency.<br/><br/>The name is validated here because corev1.LocalObjectReference defaults it
to the empty string, which would otherwise be admitted and then fail every
lookup.</td>
</tr>
<tr><td><code>providerRef</code>
      
<br/>
<a href="#ProviderRolloutReference"><code>ProviderRolloutReference</code></a>
</td>
<td>
   ProviderRef references the Rollout that provides the contract.</td>
</tr>
<tr><td><code>contract</code>
      
<br/>
<code>string</code>
</td>
<td>
   Contract is the contract name matched against the consumer's
"com.kuberik.rollout.requires.<contract>" annotations.
Defaults to the name of the provider Rollout.</td>
</tr>
</tbody>
</table>


### RolloutDependencyStatus     {#RolloutDependencyStatus}



{{< callout type="info" >}}
**Appears in:**

- [RolloutDependency](#RolloutDependency)
{{< /callout >}}

RolloutDependencyStatus defines the observed state of RolloutDependency.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>conditions</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#condition-v1-meta"><code>[]Condition</code></a>
</td>
<td>
   conditions represent the current state of the RolloutDependency resource.<br/><br/>Condition types:
- "Ready": the dependency was evaluated and its gate is in sync
- "Satisfied": no release the consumer could deploy next is held back by
  this dependency</td>
</tr>
<tr><td><code>providedVersion</code>
      
<br/>
<code>string</code>
</td>
<td>
   ProvidedVersion is the contract version currently deployed by the provider
Rollout, taken from the OCI version annotation of its deployed release with
the numeric per-build ordinal stripped. A real pre-release identifier
("2.0.0-alpha.1") is preserved, because it means the triple has not
shipped.</td>
</tr>
<tr><td><code>providedTag</code>
      
<br/>
<code>string</code>
</td>
<td>
   ProvidedTag is the image tag of the provider release that ProvidedVersion
was read from.</td>
</tr>
<tr><td><code>admittedVersions</code>
      
<br/>
<code>[]string</code>
</td>
<td>
   AdmittedVersions lists the consumer release candidate tags admitted by this
dependency. This is the allow list published to the managed RolloutGate.
Named for symmetry with RolloutGate.allowedVersions, which also holds tags.
Capped at the newest entries; see maxPublishedReleases.</td>
</tr>
<tr><td><code>blockedReleases</code>
      
<br/>
<a href="#BlockedRelease"><code>[]BlockedRelease</code></a>
</td>
<td>
   BlockedReleases lists the consumer release candidates held back by this
dependency, with the constraint each places on the contract.
Capped at the newest entries; see maxPublishedReleases.</td>
</tr>
<tr><td><code>gateName</code>
      
<br/>
<code>string</code>
</td>
<td>
   GateName is the name of the RolloutGate managed by this dependency.</td>
</tr>
</tbody>
</table>


## RolloutGate     {#RolloutGate}




RolloutGate is the Schema for the rolloutgates API.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>metadata</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#objectmeta-v1-meta"><code>ObjectMeta</code></a>
</td>
<td>
   <em>No description provided. </em>Refer to the Kubernetes API documentation for the fields of the <code>metadata</code> field.</td>
</tr>
<tr><td><code>spec</code>
      
<br/>
<a href="#RolloutGateSpec"><code>RolloutGateSpec</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>status</code>
      
<br/>
<a href="#RolloutGateStatus"><code>RolloutGateStatus</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
</tbody>
</table>


### RolloutGateSpec     {#RolloutGateSpec}



{{< callout type="info" >}}
**Appears in:**

- [RolloutGate](#RolloutGate)
{{< /callout >}}

RolloutGateSpec defines the desired state of RolloutGate.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>rolloutRef</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#localobjectreference-v1-core"><code>LocalObjectReference</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>passing</code>
      
<br/>
<code>bool</code>
</td>
<td>
   Passing is true if the RolloutGate is passing.</td>
</tr>
<tr><td><code>allowedVersions</code>
      
<br/>
<code>[]string</code>
</td>
<td>
   AllowedVersions is a list of versions that Rollout can be updated to.</td>
</tr>
</tbody>
</table>


### RolloutGateStatus     {#RolloutGateStatus}



{{< callout type="info" >}}
**Appears in:**

- [RolloutGate](#RolloutGate)
{{< /callout >}}

RolloutGateStatus defines the observed state of RolloutGate.




### RolloutGateStatusSummary     {#RolloutGateStatusSummary}



{{< callout type="info" >}}
**Appears in:**

- [RolloutStatus](#RolloutStatus)
{{< /callout >}}

RolloutGateStatusSummary summarizes the status of a gate relevant to this rollout.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code>
      
<br/>
<code>string</code>
</td>
<td>
   Name is the name of the gate.</td>
</tr>
<tr><td><code>passing</code>
      
<br/>
<code>bool</code>
</td>
<td>
   Passing is true if the gate is passing, false if it is blocking.</td>
</tr>
<tr><td><code>allowedVersions</code>
      
<br/>
<code>[]string</code>
</td>
<td>
   AllowedVersions is a list of versions that are allowed by the gate.</td>
</tr>
<tr><td><code>message</code>
      
<br/>
<code>string</code>
</td>
<td>
   Message is a message describing the status of the gate.</td>
</tr>
<tr><td><code>bypassGates</code>
      
<br/>
<code>bool</code>
</td>
<td>
   BypassGates indicates whether this gate was bypassed for the current deployment.</td>
</tr>
</tbody>
</table>


## RolloutSchedule     {#RolloutSchedule}




RolloutSchedule is the Schema for the rolloutschedules API.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>metadata</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#objectmeta-v1-meta"><code>ObjectMeta</code></a>
</td>
<td>
   <em>No description provided. </em>Refer to the Kubernetes API documentation for the fields of the <code>metadata</code> field.</td>
</tr>
<tr><td><code>spec</code>
      
<br/>
<a href="#RolloutScheduleSpec"><code>RolloutScheduleSpec</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
<tr><td><code>status</code>
      
<br/>
<a href="#RolloutScheduleStatus"><code>RolloutScheduleStatus</code></a>
</td>
<td>
   <em>No description provided. </em></td>
</tr>
</tbody>
</table>


### RolloutScheduleAction     {#RolloutScheduleAction}


(Alias of `string`)

{{< callout type="info" >}}
**Appears in:**

- [ClusterRolloutScheduleSpec](#ClusterRolloutScheduleSpec)

- [RolloutScheduleSpec](#RolloutScheduleSpec)
{{< /callout >}}

RolloutScheduleAction defines the action to take when the schedule is active.




### RolloutScheduleSpec     {#RolloutScheduleSpec}



{{< callout type="info" >}}
**Appears in:**

- [RolloutSchedule](#RolloutSchedule)
{{< /callout >}}

RolloutScheduleSpec defines the desired state of RolloutSchedule.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>rolloutSelector</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#labelselector-v1-meta"><code>LabelSelector</code></a>
</td>
<td>
   RolloutSelector is a label selector to match Rollouts in the same namespace.</td>
</tr>
<tr><td><code>rules</code>
      
<br/>
<a href="#ScheduleRule"><code>[]ScheduleRule</code></a>
</td>
<td>
   Rules is a list of schedule rules.
The schedule is active if ANY rule matches the current time/date.</td>
</tr>
<tr><td><code>timezone</code>
      
<br/>
<code>string</code>
</td>
<td>
   Timezone is the IANA timezone for the schedule (e.g., "America/New_York").
Defaults to "UTC" if not specified.</td>
</tr>
<tr><td><code>action</code>
      
<br/>
<a href="#RolloutScheduleAction"><code>RolloutScheduleAction</code></a>
</td>
<td>
   Action defines what to do when the schedule is active.
- "Allow": Gate passes when active, blocks when inactive
- "Deny": Gate blocks when active, passes when inactive</td>
</tr>
</tbody>
</table>


### RolloutScheduleStatus     {#RolloutScheduleStatus}



{{< callout type="info" >}}
**Appears in:**

- [RolloutSchedule](#RolloutSchedule)
{{< /callout >}}

RolloutScheduleStatus defines the observed state of RolloutSchedule.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>active</code>
      
<br/>
<code>bool</code>
</td>
<td>
   Active indicates if the schedule is currently active (any rule matches).</td>
</tr>
<tr><td><code>activeRules</code>
      
<br/>
<code>[]string</code>
</td>
<td>
   ActiveRules is a list of rule names that are currently active.</td>
</tr>
<tr><td><code>nextTransition</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   NextTransition is the timestamp when the active state will next change.</td>
</tr>
<tr><td><code>managedGates</code>
      
<br/>
<code>[]string</code>
</td>
<td>
   ManagedGates is a list of RolloutGate names being managed by this schedule.</td>
</tr>
<tr><td><code>matchingRollouts</code>
      
<br/>
<code>int</code>
</td>
<td>
   MatchingRollouts is the count of rollouts currently matched by the selector.</td>
</tr>
<tr><td><code>conditions</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#condition-v1-meta"><code>[]Condition</code></a>
</td>
<td>
   Conditions represents the current state of the schedule.</td>
</tr>
</tbody>
</table>


### RolloutSpec     {#RolloutSpec}



{{< callout type="info" >}}
**Appears in:**

- [Rollout](#Rollout)
{{< /callout >}}

RolloutSpec defines the desired state of Rollout.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>releaseSourceRef</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#localobjectreference-v1-core"><code>LocalObjectReference</code></a>
</td>
<td>
   ReleaseSourceRef names a ReleaseSource (kuberik.com, served by release-controller)
in the same namespace that provides this Rollout's releases. When set (and the
release-controller CRDs are installed) the Rollout reads its releases from the
source's ReleaseSlice catalogue. This is the only release path: a Rollout
without it gets no releases and reports ReleasesUpdated=False and Ready=False
with reason ReleaseSourceRequired.</td>
</tr>
<tr><td><code>releasesImagePolicy</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#localobjectreference-v1-core"><code>LocalObjectReference</code></a>
</td>
<td>
   Deprecated: ignored; removed in the next release. Releases come from
releaseSourceRef; to migrate an existing Flux ImagePolicy, create a
ReleaseSource with spec.oci.imagePolicyRef. A Rollout that sets it reports
ReleasesImagePolicyIgnored=True.
A value type, so Go clients always send "releasesImagePolicy: {}".</td>
</tr>
<tr><td><code>wantedVersion</code>
      
<br/>
<code>string</code>
</td>
<td>
   WantedVersion specifies a specific version to deploy, overriding the automatic version selection</td>
</tr>
<tr><td><code>versionHistoryLimit</code>
      
<br/>
<code>int32</code>
</td>
<td>
   VersionHistoryLimit defines the maximum number of entries to keep in the deployment history</td>
</tr>
<tr><td><code>availableReleasesRetentionDays</code>
      
<br/>
<code>int32</code>
</td>
<td>
   Deprecated: ignored; retention is ReleaseSource.spec.retention. Removed in the next release.
AvailableReleasesRetentionDays defines how many days of available releases to keep based on creation timestamp
When history is full, releases older than this retention period may be removed.
Defaults to 7 days if not specified.</td>
</tr>
<tr><td><code>availableReleasesMinCount</code>
      
<br/>
<code>int32</code>
</td>
<td>
   Deprecated: ignored; retention is ReleaseSource.spec.retention. Removed in the next release.
AvailableReleasesMinCount defines the minimum number of available releases to always keep
When history is full, at least this many releases will be retained regardless of other criteria.
Defaults to 30 if not specified.</td>
</tr>
<tr><td><code>bakeTime</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#duration-v1-meta"><code>Duration</code></a>
</td>
<td>
   BakeTime specifies how long to wait after bake starts before marking as successful
If no errors happen within the bake time, the rollout is baked successfully.
If not specified, no bake time is enforced.</td>
</tr>
<tr><td><code>deployTimeout</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#duration-v1-meta"><code>Duration</code></a>
</td>
<td>
   DeployTimeout specifies the maximum time to wait for bake to start before marking as failed
If bake doesn't start within deployTimeout (i.e., health checks don't become healthy),
the rollout should be marked as failed.
If not specified, the rollout will wait indefinitely for bake to start.</td>
</tr>
<tr><td><code>healthCheckSelector</code>
      
<br/>
<a href="#HealthCheckSelectorConfig"><code>HealthCheckSelectorConfig</code></a>
</td>
<td>
   HealthCheckSelector specifies how to select HealthChecks for this rollout</td>
</tr>
</tbody>
</table>


### RolloutStatus     {#RolloutStatus}



{{< callout type="info" >}}
**Appears in:**

- [Rollout](#Rollout)
{{< /callout >}}

RolloutStatus defines the observed state of Rollout.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>conditions</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#condition-v1-meta"><code>[]Condition</code></a>
</td>
<td>
   Conditions represents the current state of the rollout process.</td>
</tr>
<tr><td><code>history</code>
      
<br/>
<a href="#DeploymentHistoryEntry"><code>[]DeploymentHistoryEntry</code></a>
</td>
<td>
   History tracks the deployment history of this Rollout.
Each entry contains the version deployed and the timestamp of the deployment.</td>
</tr>
<tr><td><code>availableReleases</code>
      
<br/>
<a href="#VersionInfo"><code>[]VersionInfo</code></a>
</td>
<td>
   Deprecated: ignored; no longer written (cleared on reconcile). Read
status.candidates and the ReleaseSlice catalogue instead. Removed in the next release.
AvailableReleases is a list of all releases available in the releases repository.</td>
</tr>
<tr><td><code>releaseCandidates</code>
      
<br/>
<a href="#VersionInfo"><code>[]VersionInfo</code></a>
</td>
<td>
   Deprecated: ignored; no longer written (cleared on reconcile). Read status.candidates instead.
Removed in the next release.
ReleaseCandidates is a list of releases that are candidates for the next deployment.
These are filtered from AvailableReleases based on deployment history and version ordering.</td>
</tr>
<tr><td><code>gatedReleaseCandidates</code>
      
<br/>
<a href="#VersionInfo"><code>[]VersionInfo</code></a>
</td>
<td>
   Deprecated: ignored; no longer written (cleared on reconcile). Read status.candidates
(gated field) instead. Removed in the next release.
GatedReleaseCandidates is a list of release candidates that have passed through all gates.
This shows which versions are actually available for deployment after gate evaluation.</td>
</tr>
<tr><td><code>releaseSource</code>
      
<br/>
<a href="#ReleaseSourceStatusRef"><code>ReleaseSourceStatusRef</code></a>
</td>
<td>
   ReleaseSource summarises the ReleaseSource this Rollout reads (slices mode only).</td>
</tr>
<tr><td><code>candidates</code>
      
<br/>
<a href="#ReleaseCandidate"><code>[]ReleaseCandidate</code></a>
</td>
<td>
   Candidates is the working set in slices mode: the K newest releases newer
than the deployed one, plus any release newer than the deployed one that a
gate's allowedVersions, the force-deploy or bypass-gates annotation, or
spec.wantedVersion names. Newest first.</td>
</tr>
<tr><td><code>gates</code>
      
<br/>
<a href="#RolloutGateStatusSummary"><code>[]RolloutGateStatusSummary</code></a>
</td>
<td>
   Gates summarizes the status of each gate relevant to this rollout.</td>
</tr>
<tr><td><code>artifactType</code>
      
<br/>
<code>string</code>
</td>
<td>
   ArtifactType is the media/artifact type of the image extracted from the manifest.
This includes OCI artifact types, container image types, and other media types.
This field is set once for the entire rollout based on the latest available release.</td>
</tr>
<tr><td><code>source</code>
      
<br/>
<code>string</code>
</td>
<td>
   Source is the source information extracted from OCI annotations.
This typically contains the repository URL or source code location.
This field is set once for the entire rollout based on the latest available release.</td>
</tr>
<tr><td><code>title</code>
      
<br/>
<code>string</code>
</td>
<td>
   Title is the title of the image extracted from OCI annotations.
This field is set once for the entire rollout based on the latest available release.</td>
</tr>
<tr><td><code>description</code>
      
<br/>
<code>string</code>
</td>
<td>
   Description is the description of the image extracted from OCI annotations.
This field is set once for the entire rollout based on the latest available release.</td>
</tr>
</tbody>
</table>


### ScheduleRule     {#ScheduleRule}



{{< callout type="info" >}}
**Appears in:**

- [ClusterRolloutScheduleSpec](#ClusterRolloutScheduleSpec)

- [RolloutScheduleSpec](#RolloutScheduleSpec)
{{< /callout >}}

ScheduleRule defines a time-based rule.
The schedule is active if the current time/date matches this rule.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code>
      
<br/>
<code>string</code>
</td>
<td>
   Name is an optional identifier for this rule</td>
</tr>
<tr><td><code>timeRange</code>
      
<br/>
<a href="#TimeRange"><code>TimeRange</code></a>
</td>
<td>
   TimeRange restricts the rule to specific times of day</td>
</tr>
<tr><td><code>daysOfWeek</code>
      
<br/>
<a href="#DayOfWeek"><code>[]DayOfWeek</code></a>
</td>
<td>
   DaysOfWeek restricts the rule to specific days of the week</td>
</tr>
<tr><td><code>dateRange</code>
      
<br/>
<a href="#DateRange"><code>DateRange</code></a>
</td>
<td>
   DateRange restricts the rule to specific date range</td>
</tr>
</tbody>
</table>


### TimeRange     {#TimeRange}



{{< callout type="info" >}}
**Appears in:**

- [ScheduleRule](#ScheduleRule)
{{< /callout >}}

TimeRange represents a time range within a day.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>start</code>
      
<br/>
<code>string</code>
</td>
<td>
   Start time in HH:MM format (24-hour)</td>
</tr>
<tr><td><code>end</code>
      
<br/>
<code>string</code>
</td>
<td>
   End time in HH:MM format (24-hour)</td>
</tr>
</tbody>
</table>


### TriggeredByInfo     {#TriggeredByInfo}



{{< callout type="info" >}}
**Appears in:**

- [DeploymentHistoryEntry](#DeploymentHistoryEntry)
{{< /callout >}}

TriggeredByInfo indicates what triggered a deployment.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>kind</code>
      
<br/>
<code>string</code>
</td>
<td>
   Kind indicates the type of trigger: "User" for manual deployments triggered by a user,
or "System" for automatic deployments triggered by the rollout controller.</td>
</tr>
<tr><td><code>name</code>
      
<br/>
<code>string</code>
</td>
<td>
   Name contains the name of the user or system that triggered the deployment.
For user-triggered deployments, this is extracted from the "rollout.kuberik.com/deploy-user" annotation.
For system-triggered deployments, this is typically "rollout-controller".</td>
</tr>
</tbody>
</table>


### VersionInfo     {#VersionInfo}



{{< callout type="info" >}}
**Appears in:**

- [DeploymentHistoryEntry](#DeploymentHistoryEntry)

- [RolloutStatus](#RolloutStatus)
{{< /callout >}}

VersionInfo represents detailed information about a version.

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>tag</code>
      
<br/>
<code>string</code>
</td>
<td>
   Tag is the image tag (e.g., "v1.2.3", "latest").</td>
</tr>
<tr><td><code>digest</code>
      
<br/>
<code>string</code>
</td>
<td>
   Digest is the image digest if available from the ImagePolicy.</td>
</tr>
<tr><td><code>version</code>
      
<br/>
<code>string</code>
</td>
<td>
   Version is the semantic version extracted from OCI annotations if available.</td>
</tr>
<tr><td><code>revision</code>
      
<br/>
<code>string</code>
</td>
<td>
   Revision is the revision information extracted from OCI annotations if available.</td>
</tr>
<tr><td><code>created</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#time-v1-meta"><code>Time</code></a>
</td>
<td>
   Created is the creation timestamp extracted from OCI annotations if available.</td>
</tr>
<tr><td><code>requires</code>
      
<br/>
<code>map[string]string</code>
</td>
<td>
   Requires maps a contract name to what this release requires of that
contract, extracted from "com.kuberik.rollout.requires.<contract>" OCI
annotations. Values are version constraints as defined by
github.com/Masterminds/semver, applied verbatim — note that a bare version
is an exact match there, not a floor.
RolloutDependency uses these to gate this release on the deployed version of
the Rollout providing each contract.<br/><br/>Bounded because it is populated from image annotations, which are outside
this controller's trust boundary, and is stored on every release and every
history entry.</td>
</tr>
<tr><td><code>metadataUnresolved</code>
      
<br/>
<code>bool</code>
</td>
<td>
   MetadataUnresolved is true when this release's OCI manifest could not be
read, so Requires and the version fields say nothing about the image.
A RolloutDependency blocks such a release rather than reading the absent
annotations as "declares no requirement", which would open the gate
whenever the registry is unreachable.</td>
</tr>
</tbody>
</table>