import MarkdownIt from 'markdown-it'
import { responsiveTables } from './table-layout.mjs'

// Only reviewed exceptions for upstream sections that mix apps and developer tools.
// New entries in those sections fail closed rather than silently going to the wrong page.
const mixedCategories = new Map([
  ...['ZapBook', 'Sovran', 'Pacto', 'Acceso Nostr', 'Paytaca', 'Nurunuru Android', 'Grocery', 'Mantra', 'Sonar', 'Moranduba', 'wn-tui', 'Flutter White Noise'].map(name => [name, 'Apps']),
  ...['CodeDeck Next', 'Pacto Bot API'].map(name => [name, 'Agents and automation']),
  ...['kiss-bdk', 'SplitNut', 'dr.marmot'].map(name => [name, 'Tools and services']),
  ...['mdk-kotlin-example', 'mdk-python-example', 'whitenoise-rs', 'mdk-kotlin', 'mdk-python', 'mdk-ruby', 'mdk-swift', 'nostr-openmls', 'mls-ts'].map(name => [name, 'SDKs and libraries']),
])
const categories = {
  'Apps': 'Apps', 'Apps and prototypes': 'Apps',
  'SDKs and libraries': 'SDKs and libraries', 'Libraries and old examples': 'SDKs and libraries',
  'Agents and automation': 'Agents and automation', 'Agents, automation, and services': 'Agents and automation',
  'Specification and services': 'Tools and services',
}

function safeUrl(value, sourceUrl) {
  const url = new URL(value, sourceUrl)
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error(`Unsupported content link: ${url.protocol}`)
  return url.href
}

export function renderNotes(text, sourceUrl, inline = false) {
  const md = new MarkdownIt({ html: false, linkify: false, typographer: false }).use(responsiveTables)
  md.core.ruler.push('source-links', state => {
    const visit = tokens => {
      for (const token of tokens) {
        if (token.type === 'link_open') token.attrSet('href', safeUrl(token.attrGet('href'), sourceUrl))
        // No remote images or raw HTML; only escaped Markdown and validated links.
        if (token.type === 'image') { token.type = 'text'; token.content = token.content || 'Image'; token.children = null }
        if (token.type === 'heading_open' || token.type === 'heading_close') token.tag = `h${Math.min(6, Number(token.tag.slice(1)) + 2)}`
        if (token.children) visit(token.children)
      }
    }
    visit(state.tokens)
  })
  return inline ? md.renderInline(text) : md.render(text)
}

export function plainText(markdown) {
  const md = new MarkdownIt({ html: false })
  return md.parseInline(markdown, {})[0].children
    .filter(token => ['text', 'code_inline', 'softbreak', 'hardbreak'].includes(token.type))
    .map(token => token.type.includes('break') ? ' ' : token.content).join('')
}

export function parseCatalog(text, sourceUrl) {
  let section = '', subsection = ''
  const entries = [], seen = new Set()
  for (const line of text.split(/\r?\n/)) {
    if (line.startsWith('## ')) { section = line.slice(3); subsection = '' }
    if (line.startsWith('### ')) subsection = line.slice(4)
    if (!line.startsWith('- [')) continue
    const match = line.match(/^- \[(.+?)\]\((https:\/\/\S+)\) [·—] \*\*([^*]+)\*\* [·—] (.+)$/)
    if (!match) throw new Error(`Unrecognised catalog entry: ${line.slice(0,120)}`)
    const [, rawName, href, labelText, description] = match
    const name = plainText(rawName), labels = labelText.split(',').map(value => value.trim())
    if (!['v1', 'v2', 'unknown', 'adjacent'].includes(labels[0]) || !['active', 'inactive', 'archived', 'unverified'].includes(labels[1])) throw new Error(`Invalid catalog labels: ${name}`)
    let category
    if (section === 'Marmot v2 · recently updated' || section === 'No recent public commits') category = categories[subsection]
    else if (section === 'Closed-source apps') category = 'Apps'
    else if (section === 'Supporting tools · recently updated') category = 'Tools and services'
    else if (['Marmot v1 · recently updated', 'Archived and superseded', 'Source unavailable at the last check'].includes(section)) category = mixedCategories.get(name)
    if (!category) throw new Error(`Classify new catalog entry "${name}" (${section} / ${subsection}) in scripts/github-content.mjs`)
    const key = href.toLowerCase().replace(/\/$/, '')
    if (seen.has(key)) throw new Error(`Duplicate catalog destination: ${href}`)
    seen.add(key)
    entries.push({ name, href: safeUrl(href, sourceUrl), category, labels, description: plainText(description), descriptionHtml: renderNotes(description, sourceUrl, true) })
  }
  if (!entries.some(item => item.category === 'Apps') || !entries.some(item => item.category === 'SDKs and libraries')) throw new Error('Catalog is empty or missing required categories')
  return entries
}

export function parseChangelog(text) {
  const entries = []
  const headings = [...text.matchAll(/^## (.+)\r?$/gm)]
  for (let i = 0; i < headings.length; i++) {
    const title = headings[i][1].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').trim()
    const version = title.match(/^(?:v)?(\d+\.\d+\.\d+(?:-[\w.-]+)?)(?:\s|$)/)?.[1]
    if (!version && title.toLowerCase() !== 'unreleased') throw new Error(`Unknown changelog heading: ${title}`)
    const body = text.slice(headings[i].index + headings[i][0].length, headings[i + 1]?.index ?? text.length).trim()
    if (body) entries.push({ version: version || 'Unreleased', body })
  }
  if (!entries.length) throw new Error('Empty changelog')
  return entries
}

export function releaseVersion(tag) {
  return tag.match(/(?:^v?|@)(\d+\.\d+\.\d+(?:-[\w.-]+)?)$/)?.[1] ?? null
}

export function selectReleases(releases, project) {
  return releases.filter(release => !release.draft && release.published_at &&
    (project === 'MDK' ? /^v\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(release.tag_name) : releaseVersion(release.tag_name)) &&
    !/nightly/i.test(release.tag_name))
}

export function makeUpdate(project, version, body, sourceUrl, release) {
  const cleanBody = body.replace(/^# [^\n]+\n+/, '')
  const summary = plainText(cleanBody.split(/\n\s*\n/).find(block => !/^(?:#|[-*]|```|\|)/.test(block)) || '')
  return {
    id: `${project.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${version.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    project, version,
    status: version === 'Unreleased' ? 'Unreleased' : release ? (release.prerelease ? 'Prerelease' : 'Released') : 'Changelog',
    publishedAt: release?.published_at ?? null,
    releaseUrl: release?.html_url ?? null,
    sourceUrl,
    summary: summary.length > 300 ? summary.slice(0, 297).trimEnd() + '…' : summary,
    notesHtml: renderNotes(cleanBody, sourceUrl),
  }
}
