

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