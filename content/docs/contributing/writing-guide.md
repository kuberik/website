---
title: "Contribute to the Docs"
description: "Write a Kuberik docs page that matches the rest: voice, page types, code blocks, callouts, figures and links."
type_: guide
weight: 90
sidebar:
  exclude: true
excludeSearch: true
prev: false
next: false
---

Write a docs page that matches the rest of the Kuberik docs, every fact taken from the product's main branch.

## Write in the product's voice

Use the controller's own terms: if the code says `BakeTimeFailed`, write "the bake failed".

- Use second person, imperative, present tense: "Apply this Rollout."
- Leave out "please", "simply", "just", "easily", "we recommend", "powerful" and "seamless".
- No slogans, no mirrored "X. Y." pairs and no questions as headings.
- Use an em dash at most once per paragraph; prefer a full stop or a colon.
- Write as if everything on main is released: no availability chips, per-feature controller minimums or released-versus-main split. Install pages give one command and one minimum; release-day facts go to the release notes, and blog release posts keep their versions.
- Say "released" when a tag exists, never "merged", for versions of Kuberik.
- Capitalise a kind for the resource (`Rollout`, `HealthCheck`) and use lower case for the idea ("a rollout of 1.4.0").

Use the same names on every page:

- Spell out development, staging and production everywhere, including YAML names, namespaces, paths and alt text; never dev, stg or prod. Show a literal path in an external repository as it is.
- Write "Kuberik" in prose and `kuberik` in code, and "Flux", not FluxCD.
- Example people have western names: Emma Clarke, James Porter, Olivia Hart, Daniel Brooks.
- Example names: app and namespace `hello-world`, apps `checkout` and `payments`, org `acme`, registry `ghcr.io/acme/...`.

## Pick a page type

Every page declares `type_` in its front matter (Hugo reserves `type`), which fixes the skeleton:

| Type | Use for | Skeleton |
|---|---|---|
| `tutorial` | One end-to-end path for a new reader | Lead, "Before you start", steps, `## Check the result`, `## Next steps` |
| `guide` | One task the reader knows they need | Lead, task sections with verb headings, `## Check the result`, optional `## Troubleshoot`, `## Next steps` |
| `concept` | How a thing works | Lead, a figure for flows, noun headings that each answer one question, `## Related` |
| `integration` | One external system | Lead, `## What you need`, setup sections, `## How it works`, `## Troubleshoot`, `## Next steps` |
| `reference` | Look-up tables | Lead, then tables only, one heading per resource |
| `index` | Section landing pages | One lead sentence; cards render automatically |

The lead is the first paragraph: at most two sentences and 45 words, stating the outcome. Guide and tutorial titles are verbs ("Require a Manual Approval"), concept and reference titles are nouns ("Rollouts"), integration titles are the product ("Flux"). Titles use Title Case, headings sentence case, and H3 sits only under an H2. Add a `linkTitle`, the sidebar label, only for titles over 28 characters, as a shortening in the title's own words.

Front matter looks like this:

```yaml {filename="content/docs/gates/dependencies.md"}
title: "Wait for Service Dependencies"
description: "Hold a service until the service it needs has shipped a compatible version."
type_: guide
weight: 40
aliases: ["/docs/guides/service-dependencies/"]
```

The one-sentence `description` appears on cards, in search and in link previews. A page without `images` previews with `static/images/og/kuberik.png`; a blog post needs its own 1200 by 630 image:

```yaml {filename="content/blog/v0.9.0.md"}
images:
  - /screenshots/dashboard/og-v0.9.0.png
imageAlt: "The dashboard home with merged pull requests"
```

## Write code blocks

Give every code block a `filename`. Shell commands use `{filename="Terminal"}` with no `$` prompt, and their output a separate `{filename="Output"}` block.

```yaml {filename="rollout.yaml"}
apiVersion: kuberik.com/v1alpha1
kind: Rollout
metadata:
  name: hello-world
  namespace: hello-world
spec:
  releaseSourceRef:
    name: hello-world
  bakeTime: 10m  # healthy this long
```

YAML examples are complete objects a reader can apply: `apiVersion`, `kind`, `metadata.name`, `metadata.namespace` and every required field, with no `...`. They must validate against the CRDs on main: clone rollout-controller, environment-controller, release-controller, openkruise-controller and datadog-controller side by side, and pass their parent directory with `--repos`:

```bash {filename="Terminal"}
pip install pyyaml jsonschema
python3 scripts/validate-yaml.py --repos <directory-with-the-clones>
```

Keep comments lower case, at most one per four lines and four words on a long line so they do not clip on a phone; explain more in the prose. Write secrets as placeholders such as `<your-token>`.

## Use callouts sparingly

A page has at most two callouts, never two in a row, never first, and one or two sentences each.

| Type | Use for |
|---|---|
| `info` | A fact that would otherwise surprise the reader |
| `warning` | An action that loses data, blocks deploys or bypasses a safety check |
| `important` | A hard requirement to meet before a step, never a version caveat |

Prerequisites are never a callout.

## Add figures and screenshots

Add a wide drawing (632 units) and a narrow one (318 units) to `scripts/docs-figs.mjs` and run `node scripts/docs-figs.mjs`, which writes `layouts/_partials/docs-figs/<id>.html`; never edit that file. Insert the figure with the `fig` shortcode:

```markdown {filename="content/docs/concepts/rollouts.md"}
{{</* fig id="rollout-bake" caption="The bake status of the newest deploy." */>}}
```

Colours come from the theme, so dark mode needs no second drawing. Do not add mermaid. A figure says one thing in at most seven nodes, each label a real resource, field or state name.

Capture every dashboard screenshot in light and dark from the same mock-mode state, at 1x, cropped flush to the card or dialog. `<name>.png` and `<name>.dark.png` hold the desktop layout, `<name>.phone.png` and `<name>.phone.dark.png` the phone layout (under 768 pixels); the render hook picks by theme and screen, and light without JavaScript. A phone capture never replaces the desktop file, but one desktop capture may serve phones if it reads at 390 pixels. Never edit text in a capture, and write alt text that says what is shown.

The quoted title after the path becomes the caption; the alt text stays the screen-reader description. Leave the title out for no caption:

```markdown {filename="content/docs/example.md"}
![The Gates tab of a held rollout, with one closed schedule](/images/docs/example-gates.png "A closed schedule holds the build until it opens.")
```

## Link between pages

Write links as absolute paths with a trailing slash, such as `/docs/concepts/rollouts/`, never `../`. Link the first mention of each resource kind to its concept page, once. The link text is the destination's title or a verb phrase, never "here".

End every guide with `## Next steps` and every concept with `## Related`, using up to three links:

```markdown {filename="content/docs/gates/approvals.md"}
## Next steps

{{</* next "/docs/gates/schedules/" "/docs/operate/manual-actions/" */>}}
```

A moved page keeps its old URL in `aliases:`.

## Check the result

Build the site, then check links and previews, with no errors:

```bash {filename="Terminal"}
hugo -d public --baseURL https://kuberik.com/
python3 scripts/linkcheck.py public
node scripts/check-previews.mjs public
```

Open the page at phone and desktop widths, light and dark. Word budgets count prose only: front matter and code blocks do not count. Budgets: guide 1,000, concept 1,200, integration 1,400, tutorial 1,600, and the Troubleshoot page 2,000, because readers jump to one symptom there.

## Next steps

{{< next "/docs/what-is-kuberik/" "/docs/reference/annotations/" >}}
