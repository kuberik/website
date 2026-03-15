---
title: "Writing Documentation"
weight: 99
sidebar:
  exclude: true
---

Follow these guidelines to maintain high-quality, user-centric documentation.

## Core Philosophy

We follow the **Action-Oriented** approach. Users visit documentation to solve a problem, not to read a novel.

1.  **Result First**: Tell the user *what* they will achieve in the first sentence.
2.  **No Fluff**: Minimize conceptual explanations.
3.  **Declarative over Procedural**: Don't say "Step 1: Do this". Show the configuration and say "Apply this".

## Formatting Rules

### Steps
**Avoid** numbered headers like `## 1. Step Name`.
- Use standard markdown headers (`##` or `###`).
- Group code and commands logically.


### Code Blocks
All multi-line code blocks **MUST** include a filename attribute.

**Correct:**
```yaml {filename="config.yaml"}
apiVersion: v1
kind: Pod
```

### Headings
- Titles should be verbs (e.g., "Run Tests" not "Tests").
- Keep hierarchy flat.
- **No Prerequisites Sections**: Mention dependencies inline or assume the user has the basics (Cluster, CLI).

## Tone
- **Direct**: "Run this command" (Imperative).
- **Confident**: Avoid "please", "maybe", or "we recommend".
