

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