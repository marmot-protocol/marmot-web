import { readFile, writeFile, rename, appendFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'
import { collectDocumentation } from './documentation.mjs'
import { browserSnapshots } from './content-snapshots.mjs'
import { parseCatalog, parseChangelog, selectReleases, releaseVersion, makeUpdate } from './github-content.mjs'

export async function syncGithubContent({ output = fileURLToPath(new URL('../docs/.vuepress/data/github-content.json', import.meta.url)), fetchImpl = fetch } = {}) {
  const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  async function request(url, optional = false) {
    const response = await fetchImpl(url, { headers: url.startsWith('https://api.github.com/') ? headers : {}, signal: AbortSignal.timeout(30000) })
    if (optional && response.status === 404) return null
    if (!response.ok) throw new Error(`GitHub sync failed (${response.status}): ${url}`)
    return response
  }
  async function json(path) { return (await request(`https://api.github.com/repos/marmot-protocol/${path}`)).json() }
  async function raw(repo, sha, path, optional = false) {
    const response = await request(`https://raw.githubusercontent.com/marmot-protocol/${repo}/${sha}/${path}`, optional)
    return response?.text() ?? null
  }
  async function releases(repo) {
    const result = []
    for (let page = 1; page <= 30; page++) {
      const batch = await json(`${repo}/releases?per_page=100&page=${page}`)
      if (!Array.isArray(batch)) throw new Error(`Invalid releases response: ${repo}`)
      result.push(...batch)
      if (batch.length < 100) return result
    }
    throw new Error(`Release pagination limit exceeded: ${repo}`)
  }
  const repoNames = ['awesome-marmot', 'mdk', 'marmot-ts']
  const sources = await Promise.all(repoNames.map(async repo => {
    const commit = await json(`${repo}/commits/HEAD`)
    if (!/^[a-f0-9]{40}$/.test(commit.sha)) throw new Error(`Invalid source revision: ${repo}`)
    return { repo, sha: commit.sha }
  }))
  const [catalogSource, mdkSource, tsSource] = sources
  const blob = (source, path) => `https://github.com/marmot-protocol/${source.repo}/blob/${source.sha}/${path}`
  const [catalogText, changelog, mdkAll, tsAll] = await Promise.all([
    raw('awesome-marmot', catalogSource.sha, 'README.md'),
    raw('marmot-ts', tsSource.sha, 'CHANGELOG.md'), releases('mdk'), releases('marmot-ts'),
  ])
  const catalog = parseCatalog(catalogText, blob(catalogSource, 'README.md'))
  const mdkReleases = selectReleases(mdkAll, 'MDK')
  const tsReleases = selectReleases(tsAll, 'Marmot TypeScript')
  if (!mdkReleases.length || !tsReleases.length) throw new Error('No published releases found')
  // Read release notes at a single default-branch revision so corrections are mirrored too.
  // Earlier releases without a versioned document use their original GitHub release body.
  const updates = []
  for (const release of mdkReleases) {
    const version = releaseVersion(release.tag_name), path = `docs/release/${version}.md`
    const notes = await raw('mdk', mdkSource.sha, path, true)
    const body = notes ?? release.body
    if (!body?.trim()) throw new Error(`Empty MDK release: ${version}`)
    updates.push(makeUpdate('MDK', version, body, notes ? blob(mdkSource, path) : release.html_url, release))
  }
  const tsEntries = parseChangelog(changelog)
  for (const entry of tsEntries) {
    const release = tsReleases.find(item => releaseVersion(item.tag_name) === entry.version)
    // Only published GitHub releases belong in the release feed. Changelog-only
    // versions and the upstream Unreleased section are not release announcements.
    if (release) updates.push(makeUpdate('Marmot TypeScript', entry.version, entry.body, blob(tsSource, 'CHANGELOG.md'), release))
  }
  for (const release of tsReleases) {
    const version = releaseVersion(release.tag_name)
    if (!tsEntries.some(entry => entry.version === version)) {
      if (!release.body?.trim()) throw new Error(`Empty TypeScript release: ${version}`)
      updates.push(makeUpdate('Marmot TypeScript', version, release.body, release.html_url, release))
    }
  }
  updates.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || '') || a.project.localeCompare(b.project) || b.version.localeCompare(a.version, undefined, { numeric: true }))
  if (new Set(updates.map(item => item.id)).size !== updates.length) throw new Error('Duplicate update IDs')
  const documents = await collectDocumentation({ mdkReleases, tsReleases, json, raw })
  const documentationFingerprint = createHash('sha256').update(JSON.stringify(documents)).digest('hex')
  const documentationDirectory = join(dirname(output), 'documentation')
  let documentationMissing = false
  for (const document of documents) {
    try {
      const existing = JSON.parse(await readFile(join(documentationDirectory, `${document.id}.json`), 'utf8'))
      if (JSON.stringify(existing) !== JSON.stringify(document)) documentationMissing = true
    } catch (error) { if (error.code === 'ENOENT') documentationMissing = true; else throw error }
  }
  const payload = { documentationFingerprint, catalogSource: blob(catalogSource, 'README.md'), catalog, updates }
  // Unrelated upstream commits do not trigger a website deployment. Source links use
  // immutable revisions, but those revisions are excluded from the content fingerprint.
  let stable = JSON.stringify(payload)
  for (const source of sources) {
    stable = stable.replaceAll(`https://github.com/marmot-protocol/${source.repo}/blob/${source.sha}/`, `https://github.com/marmot-protocol/${source.repo}/blob/REVISION/`)
  }
  const fingerprint = createHash('sha256').update(stable).digest('hex')
  let previous
  try { previous = JSON.parse(await readFile(output, 'utf8')) } catch (error) { if (error.code !== 'ENOENT') throw error }
  const contentChanged = previous?.fingerprint !== fingerprint || documentationMissing
  const next = contentChanged
    ? { schemaVersion: 1, syncedAt: new Date().toISOString(), fingerprint, sources, ...payload }
    : previous
  const snapshots = browserSnapshots(next)
  let snapshotsMissing = false
  for (const [name, snapshot] of Object.entries(snapshots)) {
    try {
      const existing = JSON.parse(await readFile(join(dirname(output), name), 'utf8'))
      if (JSON.stringify(existing) !== JSON.stringify(snapshot)) snapshotsMissing = true
    } catch (error) { if (error.code === 'ENOENT') snapshotsMissing = true; else throw error }
  }
  const changed = contentChanged || snapshotsMissing
  if (changed) {
    // Nothing is replaced until every source has fetched and validated successfully.
    await mkdir(documentationDirectory, { recursive: true })
    for (const document of documents) {
      const target = join(documentationDirectory, `${document.id}.json`)
      await writeFile(`${target}.tmp`, JSON.stringify(document, null, 2) + '\n')
      await rename(`${target}.tmp`, target)
    }
    for (const [name, snapshot] of Object.entries(snapshots)) {
      const target = join(dirname(output), name)
      await writeFile(`${target}.tmp`, JSON.stringify(snapshot, null, 2) + '\n')
      await rename(`${target}.tmp`, target)
    }
    await writeFile(`${output}.tmp`, JSON.stringify(next, null, 2) + '\n')
    await rename(`${output}.tmp`, output)
  }
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `changed=${changed}\n`)
  return { changed, projects: catalog.length, updates: updates.length, guides: documents.length }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await syncGithubContent()
  console.log(`${result.changed ? 'Synced' : 'Unchanged'}: ${result.projects} projects, ${result.updates} update entries, ${result.guides} documentation pages.`)
}
