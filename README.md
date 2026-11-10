# Marmot

Marmot is an open, end to end encrypted protocol that runs on a distributed relay network and stays fast and reliable. Keys define identity, not platforms.

## Build the Documentation Locally

In order to build the website locally, you'll need [Node.js](https://nodejs.org/) >= 22 (or basically the latest LTS version).

The setup is straightforward:

```bash
# Install dependencies
npm install

# Serve locally (by default on port 8080)
npm start
```

## Markdown Features

See [the Vuepress docs](https://vuepress.vuejs.org/guide/markdown.html) for additional ways to mark up text in the docs.

## GitHub content sync

Apps and the Development Kit directory share the listings in
[`awesome-marmot`](https://github.com/marmot-protocol/awesome-marmot).
Releases imports MDK's versioned release notes and GitHub release metadata, plus
Marmot TypeScript's changelog entries matched to published GitHub releases.
Unreleased sections, changelog-only versions, nightly builds and duplicate MDK
artifact releases are excluded. The page defaults to MDK and shows one project
at a time; TypeScript is available through the project selector.

```sh
npm run sync:github
npm run test:content
```

The generated snapshot in `docs/.vuepress/data/github-content.json` makes local
preview and the deployed site work without browser requests to GitHub. The importer
also writes separate `catalog.json` and `releases.json` browser snapshots so catalog
pages do not download release notes. These files are regenerated and cached together.
Page-specific components load on demand; speculative prefetching of the entire
documentation library is disabled. The importer
pins each source revision, preserves upstream descriptions and labels, disables raw
HTML, and resolves relative links to their source. All sources must validate before
the snapshot is replaced. A failed sync prevents deployment, retaining the live site.

The deployment workflow checks for changes twice daily at 06:00 and 18:00 UTC, on website pushes,
and on manual runs. GitHub may delay scheduled runs. Only content changes trigger
scheduled deployments. This becomes active once the workflow is merged into the
website's default branch; local edits do not enable it.

For immediate upstream-triggered runs, the workflow also accepts a
`repository_dispatch` event with type `marmot-content-updated`. An upstream workflow
or webhook must send this to the website repository using an appropriately scoped
GitHub App installation token or repository token. No such credential or upstream
hook is configured by this checkout. The scheduled sync works without that setup.

`GITHUB_TOKEN` is optional locally and used for API rate limits in CI. It is never
written to the snapshot or exposed to browsers. Changes to an upstream catalog
format or an unclassified project in a mixed category stop the sync with a specific
error; update the mapping in `scripts/github-content.mjs` and its focused tests.

Documentation at `/docs/` mirrors the integration guides and selected API references
listed in `docs/.vuepress/data/documentation-sources.mjs`. MDK and Marmot TypeScript
are each pinned to their latest stable release commit, so guides do not silently
track unreleased APIs. Every page shows its version and original source. Updating
a release tag's contents or publishing a newer stable release triggers a new
snapshot on the next sync. Older versions remain available through GitHub tags.

Each guide has its own JSON snapshot under `docs/.vuepress/data/documentation/`,
loaded with its page rather than bundled into every marketing page. Links between
mirrored guides stay on the website; other references stay on GitHub at the source
revision. Raw HTML is disabled, code examples remain inert text, and upstream
callout/code-group syntax is presented as ordinary Markdown. To add a guide, add
its source manifest entry and matching page wrapper under `docs/docs/`.
