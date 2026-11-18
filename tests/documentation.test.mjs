import test from 'node:test'
import assert from 'node:assert/strict'
import { latestStableRelease, renderDocumentation } from '../scripts/documentation.mjs'
import { guideMarkdown } from '../scripts/guide-markdown.mjs'
import { normalizeDocumentHeadings } from '../docs/.vuepress/utils/document-headings.mjs'

const source = { repo: 'mdk', sha: 'abc', path: 'crates/host/README.md', route: '/docs/native-apps.html', sourceUrl: 'https://github.com/marmot-protocol/mdk/blob/abc/crates/host/README.md' }
const target = { ...source, path: 'crates/host/API.md', route: '/docs/native-api.html', sourceUrl: 'https://github.com/marmot-protocol/mdk/blob/abc/crates/host/API.md' }

test('sparse upstream heading outlines retain siblings, nesting, anchors and code examples', () => {
  const html = '<h3 id="one">One</h3><h5 id="child">Child <code>API</code></h5><h3 id="two">Two</h3><h2 id="section">Section</h2><h3 id="nested">Nested</h3><pre>&lt;h5&gt;Example&lt;/h5&gt;</pre>'
  assert.equal(normalizeDocumentHeadings(html), '<h2 id="one">One</h2><h3 id="child">Child <code>API</code></h3><h2 id="two">Two</h2><h2 id="section">Section</h2><h3 id="nested">Nested</h3><pre>&lt;h5&gt;Example&lt;/h5&gt;</pre>')
  const regular = '<h2 id="section">Section</h2><h3 id="nested">Nested</h3><h2 id="next">Next</h2>'
  assert.equal(normalizeDocumentHeadings(regular), regular)
})

test('documentation follows the newest stable version, excluding artifacts, drafts and prereleases', () => {
  const releases = ['v0.9.0', 'v0.15.0', 'marmotkit-v0.16.0', 'v0.16.0-beta.1'].map(tag_name => ({ tag_name }))
  releases.push({tag_name:'v0.17.0',prerelease:true}, {tag_name:'v0.18.0',draft:true})
  assert.equal(latestStableRelease(releases).tag_name, 'v0.15.0')
  assert.throws(() => latestStableRelease([{tag_name:'v1.0.0-rc.1'}]), /No stable/)
})

test('hosted guides retain code, heading anchors and local links without executing upstream markup', () => {
  const text = '---\ntitle: Old title\n---\n\n# Host guide\n\n## Setup `Client`\n\n[API](API.md#methods) [Local](#setup-client) [Other](../../docs/other.md)\n\n## Setup `Client`\n\n<script>alert(1)</script>\n\n{{ globalThis }}\n\n![pixel](https://example.com/track)\n\n```js\nconst example = "<script>"\n```'
  const result = renderDocumentation(text, source, [source, target])
  assert.deepEqual(result.anchors, ['host-guide','setup-client','setup-client-1'])
  assert.match(result.html, /href="__MARMOT_BASE__docs\/native-api.html#methods"/)
  assert.match(result.html, /href="#setup-client"/)
  assert.match(result.html, /href="https:\/\/github.com\/marmot-protocol\/mdk\/blob\/abc\/docs\/other.md"/)
  assert.doesNotMatch(result.html, /<script|<img|Old title/)
  assert.match(result.html, /const example = &quot;&lt;script&gt;&quot;/)
  assert.match(result.html, /\{\{ globalThis \}\}/)
})

test('TypeScript website paths map to hosted guides and callout syntax preserves code examples', () => {
  const ts = { repo:'marmot-ts',sha:'abc',path:'docs/getting-started.md',route:'/docs/typescript.html',sourceUrl:'https://github.com/marmot-protocol/marmot-ts/blob/abc/docs/getting-started.md' }
  const storage = { ...ts,route:'/docs/typescript-storage.html',sourceUrl:'https://github.com/marmot-protocol/marmot-ts/blob/abc/docs/client/storage.md' }
  const result = renderDocumentation('# Start\n\n::: tip Production storage\nRead [Storage](/client/storage) and [Client](/client/).\n:::\n\n::: code-group\n```sh [npm]\nnpm install example\n::: literal example\n```\n:::', ts, [ts,storage])
  assert.match(result.html, /href="__MARMOT_BASE__docs\/typescript-storage.html"/)
  assert.match(result.html, /docs\/client\/index.md/ )
  assert.match(result.html, /<strong>Production storage<\/strong>/)
  assert.doesNotMatch(result.html, /::: code-group|::: tip/)
  assert.match(result.html, /::: literal example/)
  assert.match(result.html, /npm install example/)
})

test('table rows retain column labels for wrapping mobile layouts without changing cell content', () => {
  const result = renderDocumentation('# Guide\n\n| Use case | Recommended `API` |\n| --- | --- |\n| Runtime setup | `newWithConfiguration` |\n| Recovery | Read the guide. |', source, [source])
  assert.match(result.html, /class="mm-responsive-table" role="table"/)
  assert.match(result.html, /data-label="Use case" role="cell">Runtime setup/)
  assert.match(result.html, /data-label="Recommended API" role="cell"><code>newWithConfiguration<\/code>/)
  assert.match(result.html, /data-label="Use case" role="cell">Recovery/)
  assert.match(result.html, /scope="col" role="columnheader"/)
})

test('Markdown guide exports preserve versioned links, tables, and inert code examples', () => {
  const html = renderDocumentation([
    '# Host guide',
    '## Setup',
    '',
    '| Example | Guide |',
    '| --- | --- |',
    '| `Client` | [API](API.md#methods) |',
    '',
    '[Back to setup](#setup)',
    '',
    '<script>literal text</script>',
    '',
    '```js',
    'client.send("<event>")',
    '```',
  ].join('\n'), source, [source, target]).html
  const base = new URL('https://marmot.build/preview/')
  const markdown = guideMarkdown(
    { ...source, version: '1.2.3', html },
    'Native apps',
    new URL('docs/native-apps.html', base),
    base,
  )
  assert.match(markdown, /^# Native apps\n\n> MDK 1\.2\.3/)
  assert.match(markdown, /\[Version-pinned source\]\(https:\/\/github\.com\/marmot-protocol\/mdk\/blob\/abc\/crates\/host\/README\.md\)/)
  assert.match(markdown, /\| Example \| Guide \|\n\| --- \| --- \|\n\| `Client` \| \[API\]\(https:\/\/marmot\.build\/preview\/docs\/native-api\.html#methods\) \|/)
  assert.match(markdown, /\[Back to setup\]\(https:\/\/marmot\.build\/preview\/docs\/native-apps\.html#setup\)/)
  assert.match(markdown, /&lt;script>literal text&lt;\/script>/)
  assert.match(markdown, /```js\nclient\.send\("<event>"\)\n```/)
})
