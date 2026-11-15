#!/bin/sh

set -e

# Reproducibility: the four controller modules are pinned in go.mod as Go
# pseudo-versions of each repo's main branch (no local `replace`). All four are
# public GitHub repos and resolve through the Go proxy, so no GOPRIVATE or
# GOFLAGS=-mod=mod setup is needed. If a repo is ever made private, run with
#   GOPRIVATE=github.com/kuberik/* GOFLAGS=-mod=mod sh build.sh
# so Go fetches over VCS directly (needs git credentials).
# To move the pin: cd scripts/genref && go get github.com/kuberik/<repo>@main

GENREF_VERSION=2c8f7e809fd890f52404f08803836ec870080af3
API_REF_SCRIPT_DIR=$(dirname $(realpath "$0"))
GENREF_REPO_DIR=${API_REF_SCRIPT_DIR}/genref
GENREF=${GENREF_REPO_DIR}/genref/genref
BUILD_TEMP_OUT=${API_REF_SCRIPT_DIR}/build

install_genref () {
    mkdir -p ${GENREF_REPO_DIR}
    cd ${GENREF_REPO_DIR}
    git init

    # Create origin
    git remote remove origin || true 2> /dev/null
    git remote add origin https://github.com/kubernetes-sigs/reference-docs.git

    # Configure sparse checkout
    git config core.sparsecheckout 1
    git config extensions.partialClone origin
    rm -f .git/info/sparse-checkout 2> /dev/null
    echo genref > .git/info/sparse-checkout

    # Fetch commit
    git fetch --depth 1 --filter=blob:none origin ${GENREF_VERSION}

    # Checkout files
    git checkout ${GENREF_VERSION}

    # Build the binary
    cd genref
    make genref
}

build () {
    cd $API_REF_SCRIPT_DIR
    pkill -f ${GENREF} || true
    ${GENREF} -o ${BUILD_TEMP_OUT}
}

if ! build; then
    install_genref
    build
fi

SITE_DIR=${API_REF_SCRIPT_DIR}/../../content/docs
API_REFERENCE_DIR=${SITE_DIR}/reference
mkdir -p ${API_REFERENCE_DIR}
# genref emits case-preserving heading ids ({#Rollout}) and #Rollout links, but
# Hextra's sidebar TOC lowercases heading ids. genref's templates have no
# `lower` function, so lowercase every id and in-page link here.
for f in ${BUILD_TEMP_OUT}/*.md; do
    perl -pi -e 's/(\{#)([^}]+)(\})/$1\L$2\E$3/g; s/(href="#)([^"]*)(")/$1\L$2\E$3/g; s/(\]\(#)([^)]*)(\))/$1\L$2\E$3/g' "$f"
done

# Fields whose json tag carries options print the whole tag as the field name
# ("metadata,omitempty,omitzero"); keep only the name.
for f in ${BUILD_TEMP_OUT}/*.md; do
    perl -pi -e 's/(<tr[^>]*><td><code>)([A-Za-z0-9_]+),[^<]*(<\/code>)/$1$2$3/' "$f"
    # per-field anchors: <tr id="Type-field,omitempty"> -> id="type-field" (lowercase, no tag options)
    perl -pi -e 's/<tr id="([^",]+)(?:,[^"]*)?"/"<tr id=\"" . lc($1) . "\""/e' "$f"
done

# Label each API group with its release state. For each module the pinned
# commit (last segment of the go.mod pseudo-version) is looked up in a bare,
# blobless clone: stable tags that contain it mean "Released in", otherwise the
# latest stable tag is named, and no tags at all means "not in a release yet".
label_groups () {
    WORK=$(mktemp -d)
    for f in ${BUILD_TEMP_OUT}/*.md; do
        name=$(basename $f .v1alpha1.md)
        ver=$(cd $API_REF_SCRIPT_DIR && go list -m -f '{{.Version}}' github.com/kuberik/${name})
        sha=${ver##*-}
        git clone -q --bare --filter=blob:none https://github.com/kuberik/${name}.git ${WORK}/${name}
        full=$(git -C ${WORK}/${name} rev-parse ${sha}^{commit})
        short=$(echo ${full} | cut -c1-7)
        stable=$(git -C ${WORK}/${name} tag | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | sort -V)
        containing=$(git -C ${WORK}/${name} tag --contains ${full} | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | sort -V | head -1)
        latest=$(echo "${stable}" | tail -1)
        if [ -n "${containing}" ]; then
            line="Released in ${name} ${containing}. This page documents main at ${short}."
        elif [ -n "${latest}" ] && git -C ${WORK}/${name} diff --quiet ${latest} ${full} -- api/v1alpha1; then
            line="Released in ${name} ${latest}: the API types are identical on main at ${short}."
        elif [ -n "${latest}" ]; then
            line="Latest release is ${name} ${latest}. This page documents main at ${short}, so it also lists API changes that are not in a release yet."
        else
            line="Not in a release yet. This page documents ${name} main at ${short}."
        fi
        # insert after the first "## Title" line
        LINE="${line}" perl -0pi -e 's/^(## [^\n]+\n)/$1\n$ENV{LINE}\n/m' $f
    done
    rm -rf ${WORK}
}
label_groups

cat ${API_REF_SCRIPT_DIR}/index-header.md ${BUILD_TEMP_OUT}/rollout-controller.v1alpha1.md ${BUILD_TEMP_OUT}/environment-controller.v1alpha1.md ${BUILD_TEMP_OUT}/openkruise-controller.v1alpha1.md ${BUILD_TEMP_OUT}/release-controller.v1alpha1.md > ${API_REFERENCE_DIR}/api.md
