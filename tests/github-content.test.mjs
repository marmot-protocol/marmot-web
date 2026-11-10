import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCatalog, parseChangelog, renderNotes, selectReleases, makeUpdate } from '../scripts/github-content.mjs'
const source = 'https://github.com/marmot-protocol/mdk/blob/abc/docs/release/1.0.0.md'

test('catalog keeps separate components from one repository, descriptions and source labels', () => {
  const text = `## Marmot v2 · recently updated
### Apps
- [Example app](https://github.com/org/app) · **v2, active, alpha** · Try the [web app](https://example.com).
### SDKs and libraries
- [Example engine](https://github.com/org/app/tree/main/engine) · **v2, active, experimental** · Engine inside the app.
### Agents and automation
- [Agent](https://github.com/org/agent) · **v2, active** · Agent tool.`
  const rows = parseCatalog(text, source)
  assert.equal(rows.length, 3)
  assert.equal(rows[0].category, 'Apps')
  assert.deepEqual(rows[0].labels, ['v2','active','alpha'])
  assert.match(rows[0].descriptionHtml, /href="https:\/\/example.com\/"/)
  assert.equal(rows[1].category, 'SDKs and libraries')
  assert.equal(rows[2].category, 'Agents and automation')
})

test('upstream format or category changes fail instead of silently dropping projects', () => {
  assert.throws(() => parseCatalog('## Unexpected\n- [New](https://example.com) · **v2, active** · A project.', source), /Classify/)
  assert.throws(() => parseCatalog('- [New](https://example.com) missing labels', source), /Unrecognised/)
})

test('release selection excludes drafts, nightlies and duplicate MDK artifact releases', () => {
  const rows = ['v1.0.0', 'marmotkit-v1.0.0', 'wn-agent-v1.0.0', 'v1.1.0-nightly.1', 'v1.1.0-beta.1'].map(tag_name => ({tag_name, published_at:'2026-11-01',draft:false}))
  rows.push({tag_name:'v2.0.0',published_at:'2026-11-02',draft:true})
  assert.deepEqual(selectReleases(rows, 'MDK').map(r => r.tag_name), ['v1.0.0','v1.1.0-beta.1'])
})

test('changelog distinguishes unreleased, published and undated entries', () => {
  const entries = parseChangelog('## Unreleased\n\n### Fixed\n\n- Upcoming.\n\n## 1.0.0\n\n### Added\n\n- Shipped.')
  assert.equal(entries.length,2)
  assert.equal(makeUpdate('TS', entries[0].version, entries[0].body, source).status,'Unreleased')
  const undated=makeUpdate('TS','1.0.0',entries[1].body,source)
  assert.equal(undated.status,'Changelog')
  assert.equal(undated.publishedAt,null)
  const prerelease=makeUpdate('TS','1.1.0-beta.1','Notes',source,{prerelease:true,published_at:'2026-11-01',html_url:'https://github.com/org/repo/releases/tag/v1.1.0-beta.1'})
  assert.equal(prerelease.status,'Prerelease')
})

test('mirrored notes preserve compatibility text, resolve links and cannot execute raw markup', () => {
  const html=renderNotes('## Compatibility\n\nDo not downgrade. [Upgrade](../integration/1.0.0.md)\n\n<script>alert(1)</script>\n\n![tracking](https://example.com/pixel)\n\n[bad](javascript:alert(1))',source)
  assert.match(html, /Do not downgrade/)
  assert.match(html, /https:\/\/github.com\/marmot-protocol\/mdk\/blob\/abc\/docs\/integration\/1.0.0.md/)
  assert.doesNotMatch(html, /<script|<img|href="javascript:/)
  assert.match(html, /<h4>Compatibility<\/h4>/)
})

test('sync follows release pagination, preserves snapshots on failure and detects edited notes', async () => {
  const { syncGithubContent } = await import('../scripts/sync-github-content.mjs')
  const { mkdtemp, readFile, rm } = await import('node:fs/promises')
  const { tmpdir } = await import('node:os')
  const { join } = await import('node:path')
  const directory = await mkdtemp(join(tmpdir(), 'marmot-sync-test-'))
  const output = join(directory, 'content.json')
  const calls = []
  let fail = false, failGuide = false, note = 'Original compatibility note.'
  const release = tag_name => ({tag_name,draft:false,prerelease:false,published_at:'2026-11-01T12:00:00Z',html_url:`https://github.com/org/repo/releases/tag/${tag_name}`,body:'Release body.'})
  const fetchImpl = async url => {
    calls.push(url)
    if (url.includes('/commits/')) return Response.json({sha:'a'.repeat(40)})
    if (url.includes('/releases?')) {
      if (url.includes('/mdk/')) return Response.json(url.endsWith('page=1') ? Array.from({length:100},(_,i)=>release(`marmotkit-v1.0.0-nightly.${i}`)) : [release('v1.0.0')])
      return Response.json([release('v1.0.0')])
    }
    if (url.includes('/awesome-marmot/') && url.endsWith('README.md')) return new Response('## Marmot v2 · recently updated\n### Apps\n- [App](https://example.com/app) · **v2, active** · An app.\n### SDKs and libraries\n- [SDK](https://example.com/sdk) · **v2, active** · A library.')
    if (url.endsWith('CHANGELOG.md')) return new Response('## Unreleased\n\n- Coming soon.\n\n## 1.0.0\n\nReleased changes.\n\n## 0.9.0\n\nChangelog only.')
    if (url.endsWith('1.0.0.md')) return fail ? new Response('rate limited',{status:403}) : new Response(`# MDK 1.0.0\n\n${note}`)
    if (failGuide && url.endsWith('API-REFERENCE.md')) return new Response('unavailable', {status:503})
    if (url.startsWith('https://raw.githubusercontent.com/')) return new Response('# Guide\n\n## Setup\n\nUse matching releases.')
    throw new Error(`Unexpected fetch: ${url}`)
  }
  try {
    assert.equal((await syncGithubContent({output,fetchImpl})).changed,true)
    const first = await readFile(output,'utf8')
    const catalogPath = join(directory, 'catalog.json')
    const releasesPath = join(directory, 'releases.json')
    const firstCatalog = await readFile(catalogPath, 'utf8')
    const firstReleases = await readFile(releasesPath, 'utf8')
    assert.deepEqual(JSON.parse(firstCatalog).catalog, JSON.parse(first).catalog)
    assert.equal('updates' in JSON.parse(firstCatalog), false)
    assert.deepEqual(JSON.parse(firstReleases), { updates: JSON.parse(first).updates })
    assert.ok(calls.some(url=>url.includes('/mdk/releases?per_page=100&page=2')))
    assert.equal(JSON.parse(first).updates.filter(item=>item.project==='MDK').length,1)
    assert.equal(JSON.parse(first).updates.length,2)
    assert.ok(JSON.parse(first).updates.every(item => item.status === 'Released' && item.publishedAt && item.releaseUrl))
    assert.equal((await syncGithubContent({output,fetchImpl})).changed,false)
    assert.equal(await readFile(output,'utf8'),first)
    // A missing deployment cache artifact must be restored even if upstream
    // content is unchanged, without inventing a new content sync timestamp.
    await rm(catalogPath)
    assert.equal((await syncGithubContent({output,fetchImpl})).changed, true)
    assert.equal(await readFile(catalogPath, 'utf8'), firstCatalog)
    assert.equal(await readFile(output, 'utf8'), first)
    fail=true
    await assert.rejects(syncGithubContent({output,fetchImpl}),/403/)
    assert.equal(await readFile(output,'utf8'),first)
    assert.equal(await readFile(catalogPath, 'utf8'), firstCatalog)
    assert.equal(await readFile(releasesPath, 'utf8'), firstReleases)
    fail=false; failGuide=true
    const guideBeforeFailure = await readFile(join(directory, 'documentation/native-api.json'), 'utf8')
    await assert.rejects(syncGithubContent({output,fetchImpl}), /503/)
    assert.equal(await readFile(output,'utf8'), first)
    assert.equal(await readFile(join(directory, 'documentation/native-api.json'), 'utf8'), guideBeforeFailure)
    failGuide=false; note='Corrected compatibility note.'
    assert.equal((await syncGithubContent({output,fetchImpl})).changed,true)
    assert.match(await readFile(output,'utf8'),/Corrected compatibility note/)
    assert.match(await readFile(releasesPath, 'utf8'), /Corrected compatibility note/)
  } finally { await rm(directory,{recursive:true,force:true}) }
})
