

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