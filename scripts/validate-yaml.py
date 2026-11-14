#!/usr/bin/env python3
"""Validate kuberik YAML examples in the docs against the CRDs on origin/main.

Extracts every ```yaml block from content/docs/**/*.md, and validates each
document whose apiVersion/kind is a kuberik CRD against the CRD's OpenAPI
schema, read with `git show origin/main:<path>` from the product repos.
Unknown fields are errors (as with `kubectl apply --validate=strict`).
Other kinds (Deployment, Kustomization, ...) are skipped.

Usage: scripts/validate-yaml.py [--repos DIR] [content-dir]
Needs pyyaml and jsonschema (pip install pyyaml jsonschema). Exit 1 on errors.
Not wired into CI: it needs local clones of the product repos.
"""
import argparse, re, subprocess, sys
from pathlib import Path
import yaml, jsonschema

CRDS = {
    "rollout-controller": "config/crd/bases",
    "environment-controller": "config/crd/bases",
    "release-controller": "config/crd/bases",
    "openkruise-controller": "config/crd/bases",
    "datadog-controller": "vendir/crds",
}

def git(repo, *a):
    return subprocess.run(["git", "-C", str(repo), *a], capture_output=True, text=True, check=True).stdout

def strictify(s):
    """Turn a CRD structural schema into JSON Schema that rejects unknown fields."""
    if isinstance(s, dict):
        s = {k: strictify(v) for k, v in s.items()}
        if s.get("x-kubernetes-int-or-string"):
            s.pop("type", None)
            s["type"] = ["integer", "string"]
        if s.get("nullable"):
            t = s.get("type")
            if t:
                s["type"] = [t, "null"]
        if "properties" in s and "additionalProperties" not in s and not s.get("x-kubernetes-preserve-unknown-fields"):
            s["additionalProperties"] = False
        return s
    if isinstance(s, list):
        return [strictify(x) for x in s]
    return s

def load_crds(repos):
    out = {}
    for repo, path in CRDS.items():
        r = repos / repo
        for f in git(r, "ls-tree", "-r", "--name-only", "origin/main", path).split():
            if not f.endswith(".yaml"):
                continue
            for d in yaml.safe_load_all(git(r, "show", f"origin/main:{f}")):
                if not d or d.get("kind") != "CustomResourceDefinition":
                    continue
                spec = d["spec"]
                for v in spec["versions"]:
                    sch = v.get("schema", {}).get("openAPIV3Schema")
                    if sch:
                        out[(spec["group"] + "/" + v["name"], spec["names"]["kind"])] = (strictify(sch), repo, git(r, "rev-parse", "--short", "origin/main").strip())
    return out

FENCE = re.compile(r"^```(?:yaml|yml)\b[^\n]*\n(.*?)^```", re.S | re.M)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repos", default="/home/luka/projects/kuberik")
    ap.add_argument("content", nargs="?", default="content/docs")
    a = ap.parse_args()
    crds = load_crds(Path(a.repos))
    print("CRDs: " + ", ".join(sorted(f"{k}/{g.split('/')[0]}" for g, k in crds)) + "\n")
    checked = skipped = errors = 0
    for md in sorted(Path(a.content).rglob("*.md")):
        text = md.read_text()
        for m in FENCE.finditer(text):
            line = text[:m.start()].count("\n") + 1
            body = m.group(1)
            if "{{" in body:
                skipped += 1
                continue
            try:
                docs = list(yaml.safe_load_all(body))
            except yaml.YAMLError as e:
                print(f"{md}:{line}: YAML parse error: {str(e).splitlines()[0]}")
                errors += 1
                continue
            for d in docs:
                if not isinstance(d, dict) or "kind" not in d:
                    skipped += 1
                    continue
                key = (d.get("apiVersion"), d["kind"])
                if key not in crds:
                    skipped += 1
                    continue
                sch, repo, sha = crds[key]
                checked += 1
                v = jsonschema.Draft7Validator(sch)
                errs = sorted(v.iter_errors(d), key=lambda e: list(map(str, e.path)))
                # spec/status of examples need not be complete: drop "required" noise only for status
                for e in errs:
                    path = ".".join(map(str, e.path)) or "(root)"
                    if path.startswith("status"):
                        continue
                    print(f"{md}:{line}: {key[1]} {d.get('metadata', {}).get('name', '')} {path}: {e.message[:200]}")
                    errors += 1
    print(f"\nchecked {checked} kuberik documents, skipped {skipped} others, {errors} errors")
    return 1 if errors else 0

sys.exit(main())
