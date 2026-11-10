import MarkdownIt from 'markdown-it'
import { responsiveTables } from './table-layout.mjs'
import { documentationSources } from '../docs/.vuepress/data/documentation-sources.mjs'

export function latestStableRelease(releases) {
  const stable = releases.filter(item => !item.draft && !item.prerelease && /^v?\d+\.\d+\.\d+$/.test(item.tag_name))
  stable.sort((a, b) => b.tag_name.replace(/^v/, '').localeCompare(a.tag_name.replace(/^v/, ''), undefined, { numeric: true }))
  if (!stable.length) throw new Error('No stable documentation release found')
  return stable[0]
}

// GitHub heading slugs, including repeated headings and code in headings.
function slug(value) {
  return value.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc}\-\s]/gu, '').replace(/ /g, '-')
}
function headingText(token) {
  return (token.children || []).map(child => child.type === 'image' ? child.content : ['text', 'code_inline'].includes(child.type) ? child.content : '').join('')
}

function prepareMarkdown(text) {
  text = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
  // VitePress callouts/code groups are presentation syntax, not content. Retain
  // their titles and bodies; never interpret raw HTML or Vue expressions.
  let fence = null
  return text.split('\n').map(line => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/)
    if (marker) {
      if (!fence) fence = marker[1]
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null
      return line
    }
    if (!fence && /^\s*:::\s*$/.test(line)) return ''
    const container = !fence && line.match(/^\s*:::\s*(code-group|tip|warning|danger|info|details)(?:\s+(.*))?$/)
    if (container) return container[1] === 'code-group' ? '' : `**${container[2] || container[1]}**\n`
    return line
  }).join('\n')
}

export function renderDocumentation(text, source, sources) {
  if (!text.trim() || !/^# /m.test(text)) throw new Error(`Missing documentation title: ${source.path}`)
  const md = new MarkdownIt({ html: false, linkify: false }).use(responsiveTables)
  const headings = [], localLinks = [], ids = new Map()
  md.core.ruler.push('documentation', state => {
    for (let i = 0; i < state.tokens.length; i++) {
      const token = state.tokens[i]
      if (token.type !== 'heading_open') continue
      const title = headingText(state.tokens[i + 1]), stem = slug(title)
      let id = stem, suffix = 0
      while (ids.has(id)) id = `${stem}-${++suffix}`
      ids.set(id, true)
      token.attrSet('id', id)
      // Keep the source H1 anchor, but the page wrapper provides the visible H1.
      if (token.tag === 'h1') {
        token.tag = 'div'; token.attrSet('class', 'mm-source-title')
        state.tokens[i + 2].tag = 'div'
      } else headings.push({ id, title, level: Number(token.tag.slice(1)) })
    }
    const visit = tokens => {
      for (const token of tokens) {
        if (token.type === 'link_open') {
          const href = token.attrGet('href')
          if (href.startsWith('#')) { localLinks.push({ route: source.route, hash: href.slice(1) }); continue }
          let url
          if (source.repo === 'marmot-ts' && href.startsWith('/') && !href.startsWith('//')) {
            url = new URL(`https://github.com/marmot-protocol/marmot-ts/blob/${source.sha}/docs${href}`)
            if (url.pathname.endsWith('/')) url.pathname += 'index.md'
            else if (!/\.[a-z]+$/i.test(url.pathname)) url.pathname += '.md'
          } else url = new URL(href, source.sourceUrl)
          if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) throw new Error(`Unsupported documentation link: ${href}`)
          const target = sources.find(item => {
            const canonical = new URL(item.sourceUrl)
            return url.origin === canonical.origin && url.pathname === canonical.pathname
          })
          if (target) {
            // The component substitutes VuePress's configured base at render time.
            token.attrSet('href', `__MARMOT_BASE__${target.route.slice(1)}${url.hash}`)
            localLinks.push({ route: target.route, hash: url.hash.slice(1) })
          } else token.attrSet('href', url.href)
        }
        if (token.type === 'image') { token.type = 'text'; token.content = token.content || 'Image'; token.children = null }
        if (token.children) visit(token.children)
      }
    }
    visit(state.tokens)
  })
  const html = md.render(prepareMarkdown(text))
  return { html, headings, anchors: [...ids.keys()], localLinks }
}

export async function collectDocumentation({ mdkReleases, tsReleases, json, raw }) {
  const versions = await Promise.all([['mdk', mdkReleases], ['marmot-ts', tsReleases]].map(async ([repo, releases]) => {
    const release = latestStableRelease(releases)
    const commit = await json(`${repo}/commits/${encodeURIComponent(release.tag_name)}`)
    if (!/^[a-f0-9]{40}$/.test(commit.sha)) throw new Error(`Invalid documentation revision: ${repo}`)
    return { repo, version: release.tag_name.replace(/^v/, ''), sha: commit.sha }
  }))
  const sources = documentationSources.map(item => {
    const version = versions.find(version => version.repo === item.repo)
    const path = item.path.replace('{version}', version.version)
    return { ...item, ...version, path, sourceUrl: `https://github.com/marmot-protocol/${item.repo}/blob/${version.sha}/${path}` }
  })
  const documents = await Promise.all(sources.map(async source => ({
    ...source, ...renderDocumentation(await raw(source.repo, source.sha, source.path), source, sources),
  })))
  // Keep links to unmirrored guides on GitHub. Validate the local route targets;
  // upstream anchor mistakes are retained as source links rather than broken local links.
  for (const doc of documents) {
    for (const link of doc.localLinks) {
      const target = documents.find(item => item.route === link.route)
      if (!target) throw new Error(`Missing documentation route: ${link.route}`)
      if (link.hash && !target.anchors.includes(decodeURIComponent(link.hash))) {
        const local = link.route === doc.route ? `#${link.hash}` : `__MARMOT_BASE__${link.route.slice(1)}#${link.hash}`
        doc.html = doc.html.replaceAll(`href="${local}"`, `href="${target.sourceUrl}#${link.hash}"`)
      }
    }
    delete doc.localLinks
  }
  return documents
}
