---
layout: doc
outline: [1, 2]
tocDepth: 1
---

# API Reference

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
   Environment is the environment name</td>
</tr>
<tr><td><code>environmentUrl</code>
      
<br/>
<code>string</code>
</td>
<td>
   EnvironmentURL is the URL of the actual deployed environment (e.g., dashboard URL)</td>
</tr>
<tr><td><code>relationship</code>
      
<br/>
<a href="#EnvironmentRelationship"><code>EnvironmentRelationship</code></a>
</td>
<td>
   Relationship defines how this environment relates to another environment</td>
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

- [EnvironmentInfo](#EnvironmentInfo)

- [EnvironmentSpec](#EnvironmentSpec)
{{< /callout >}}

EnvironmentRelationship defines a relationship to another environment

<table>
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>environment</code>
      
<br/>
<code>string</code>
</td>
<td>
   Environment is the environment name this environment relates to</td>
</tr>
<tr><td><code>type</code>
      
<br/>
<a href="#RelationshipType"><code>RelationshipType</code></a>
</td>
<td>
   Type is the type of relationship: "After" or "Parallel"</td>
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
   Environment is the environment name (e.g., "production", "staging")</td>
</tr>
<tr><td><code>relationship</code>
      
<br/>
<a href="#EnvironmentRelationship"><code>EnvironmentRelationship</code></a>
</td>
<td>
   Relationship defines how this environment relates to another environment</td>
</tr>
<tr><td><code>backend</code>
      
<br/>
<a href="#BackendConfig"><code>BackendConfig</code></a>
</td>
<td>
   Backend contains backend-specific configuration</td>
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

RelationshipType defines the type of relationship between environments



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

# Rollout API


**Resource Types:**
    


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
</tbody>
</table>


### HealthStatus     {#HealthStatus}


(Alias of `string`)

{{< callout type="info" >}}
**Appears in:**

- [HealthCheckStatus](#HealthCheckStatus)
{{< /callout >}}





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
    
  
<tr><td><code>releasesImagePolicy</code>
      
<br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#localobjectreference-v1-core"><code>LocalObjectReference</code></a>
</td>
<td>
   ReleasesImagePolicy specifies the ImagePolicy that provides available releases</td>
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
   AvailableReleasesRetentionDays defines how many days of available releases to keep based on creation timestamp
When history is full, releases older than this retention period may be removed.
Defaults to 7 days if not specified.</td>
</tr>
<tr><td><code>availableReleasesMinCount</code>
      
<br/>
<code>int32</code>
</td>
<td>
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
   AvailableReleases is a list of all releases available in the releases repository.</td>
</tr>
<tr><td><code>releaseCandidates</code>
      
<br/>
<a href="#VersionInfo"><code>[]VersionInfo</code></a>
</td>
<td>
   ReleaseCandidates is a list of releases that are candidates for the next deployment.
These are filtered from AvailableReleases based on deployment history and version ordering.</td>
</tr>
<tr><td><code>gatedReleaseCandidates</code>
      
<br/>
<a href="#VersionInfo"><code>[]VersionInfo</code></a>
</td>
<td>
   GatedReleaseCandidates is a list of release candidates that have passed through all gates.
This shows which versions are actually available for deployment after gate evaluation.</td>
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
</tbody>
</table>