

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

