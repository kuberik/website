---
title: "GitHub Integration"
weight: 2
---

The Kuberik [Environment API](/docs/concepts/environments/) uses the GitHub [Environments](https://docs.github.com/en/rest/deployments/environments) and [Deployments](https://docs.github.com/en/rest/deployments/deployments) APIs as a coordination layer for multi-cluster promotions.



## Setup

### Create GitHub Token

- Go to [github.com/settings/tokens](https://github.com/settings/tokens)
- Click **Generate new token (classic)**
- Select scopes:
   - `repo:deployment` (Read and write access to deployments)
- Copy the generated token

{{< callout type="warning" >}}
Store this token securely. It provides write access to your repository.
{{< /callout >}}

### Create Kubernetes Secret

```bash
kubectl create secret generic github-credentials \
  --from-literal=token=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
  -n default
```

Verify:
```bash
kubectl get secret github-credentials
```

### Configure Environment Backend

Reference the secret in your Environment:

```yaml
apiVersion: environments.kuberik.com/v1alpha1
kind: Environment
metadata:
  name: production
spec:
  rolloutRef:
    name: my-app
  name: "production"
  backend:
    type: github
    project: "my-org/my-repo"    # owner/repo format
    secret: "github-credentials"  # Secret name
```

---







## Next Steps

{{< cards >}}
  {{< card title="Automated Promotion" link="/docs/guides/cross-environment-rollout/" icon="switch-horizontal" subtitle="Multi-stage pipelines" >}}
  {{< card title="Environments Concept" link="/docs/concepts/environments/" icon="server" subtitle="How environments work" >}}
{{< /cards >}}
