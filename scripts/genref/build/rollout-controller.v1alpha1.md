

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