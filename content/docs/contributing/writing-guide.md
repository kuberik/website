---
title: "Contribute to the Docs"
description: "Write a Kuberik docs page that matches the rest: voice, page types, code blocks, callouts, figures and links."
type_: guide
weight: 90
sidebar:
  exclude: true
---

Write a docs page that reads like the rest of the Kuberik docs. Every page is checked against the product's main branch, so each fact must come from the code.

## Write in the product's voice

Use the controller's own terms: if the code says `BakeFailed`, write "the bake failed".

- Write in the second person, imperative and present tense: "Apply this Rollout."
- Leave out "please", "simply", "just", "easily", "we recommend", "powerful" and "seamless".
- Write no slogans, no mirrored "X. Y." pairs and no questions as headings.
- Say "released" when a tag exists. Something on main without a tag is still documented, with a callout that says which release it needs.
- Spell out environment names in full: development, staging, production.
- Capitalise a resource kind when you mean the resource (`Rollout`, `HealthCheck`) and write it in lower case when you mean the idea ("a rollout of 1.4.0").
- Use the shared example names: app and namespace `hello-world`, org `acme`, registry `ghcr.io/acme/...`.

## Pick a page type

Every page declares one type in its front matter as `type_` (with an underscore, because Hugo reserves `type`). The type fixes the skeleton:

| Type | Use for | Skeleton |
|---|---|---|
| `tutorial` | One end-to-end path for a new reader | Lead, "Before you start", steps, `## Check the result`, `## Next steps` |
| `guide` | One task the reader already knows they need | Lead, task sections with verb headings, `## Check the result`, optional `## Troubleshoot`, `## Next steps` |
| `concept` | How a thing works | Lead, a figure for flows, noun headings that each answer one question, `## Related` |
| `integration` | One external system | Lead, `## What you need`, setup sections, `## How it works`, `## Troubleshoot`, `## Next steps` |
| `reference` | Look-up tables | Lead, then tables only, one heading per resource |
| `index` | Section landing pages | One lead sentence. The section cards render automatically |

The lead is the first paragraph: at most two sentences and 45 words, stating the outcome. Guide and tutorial titles are verbs ("Require a Manual Approval"), concept and reference titles are nouns ("Rollouts"), integration titles are the product ("Flux"). Page titles use Title Case and headings use sentence case. Use H2 for sections and H3 only under an H2. Add a `linkTitle` when the title is longer than 28 characters.

Every page needs front matter like this:

```yaml {filename="content/docs/gates/approvals.md"}
title: "Require a Manual Approval"
linkTitle: "Manual Approvals"
description: "Hold a deploy until a person approves it in the dashboard or with kubectl."
type_: guide
weight: 20
```

The one-sentence `description` appears on cards, in search and in link previews.

## Write code blocks

Give every code block a `filename`. Shell commands use `{filename="Terminal"}`, their output goes in a separate `{filename="Output"}` block, and commands have no `$` prompt.

```yaml {filename="rollout.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: Rollout
metadata:
  name: hello-world
  namespace: hello-world
spec:
  releaseSourceRef:
    name: hello-world
  bakeTime: 10m  # health must hold this long
```

YAML examples are complete objects a reader can apply: `apiVersion`, `kind`, `metadata.name`, `metadata.namespace` and every required field, with no `...`. They must validate against the CRDs on main:

```bash {filename="Terminal"}
python3 scripts/validate-yaml.py
```

Keep comments short and lower case, at most one per four lines; longer explanations go in the prose. Write secrets as placeholders such as `<your-token>`.

## Use callouts sparingly

A page has at most two callouts, never two in a row, never first on the page, and one or two sentences each.

| Type | Use for |
|---|---|
| `info` | A fact the reader needs so they are not surprised |
| `warning` | An action that loses data, blocks deploys or bypasses a safety check |
| `important` | A version requirement, such as a feature that needs the next release |

Prerequisites are never a callout.

## Add figures and screenshots

Draw diagrams as inline SVG figures in the site's own style, coloured from the theme so they work in light and dark mode. Do not add mermaid diagrams. A figure says one thing, has at most seven nodes, and every label is a real resource, field or state name.

Take screenshots from the dashboard in the light theme at 1x, cropped to the region that matters, with alt text that says what the reader should see.

## Link between pages

Write links as absolute paths with a trailing slash, such as `/docs/concepts/rollouts/`, never `../`. Link the first mention of each resource kind on a page to its concept page, once. The link text is the destination's title or a verb phrase, never "here".

End every guide with `## Next steps` and every concept with `## Related`, using up to three links:

```markdown {filename="content/docs/gates/approvals.md"}
## Next steps

{{</* next "/docs/gates/schedules/" "/docs/operate/manual-actions/" */>}}
```

When you move a page, keep its old URL in `aliases:` in the front matter.

## Check the result

Build the site and check links. Hugo must report no errors and the link checker 0 broken internal links or anchors:

```bash {filename="Terminal"}
hugo -d public
python3 scripts/linkcheck.py public
```

Then open the page at phone and desktop widths, in light and dark mode. Keep pages within budget: a guide stays under 1,000 words, a concept under 1,200, an integration under 1,400 and a tutorial under 1,600.

## Next steps

{{< next "/docs/what-is-kuberik/" "/docs/reference/annotations/" >}}
