import { readFile, writeFile } from 'node:fs/promises'
import type { PluginObject } from 'vuepress'
import { documentationSources } from './data/documentation-sources.mjs'
import { guideMarkdown } from '../../scripts/guide-markdown.mjs'

const siteOrigin = 'https://marmot.build'
const markdownPath = (route: string) => route.endsWith('/') ? `${route}index.md` : route.replace(/\.html$/, '.md')
const guidesByRoute = new Map(documentationSources.map(guide => [guide.route, guide]))

const llmsIntro = `# Marmot

> Marmot is an open protocol for decentralized, end-to-end encrypted group messaging. It uses Messaging Layer Security (MLS) for group encryption and Nostr public keys for identity. Current clients use Nostr relays for transport.

MDK is the Rust implementation and provides MarmotKit native bindings, a C interface, and the White Noise runtime. Marmot TypeScript is a separate implementation for JavaScript and TypeScript applications. White Noise is a messenger built on Marmot. The guides below follow the latest stable releases and link to their version-pinned sources.

## Protocol and ecosystem

- [Marmot protocol specification](https://github.com/marmot-protocol/marmot): Protocol and interoperability requirements.
- [White Noise](https://www.whitenoise.chat/): End-user messenger and downloads.
`

function siteUrl(route: string, base: string) {
  return new URL(route.slice(1), new URL(base, siteOrigin))
}

function escapeXml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&apos;')
}

export const discovery: PluginObject = {
  name: 'marmot-discovery',

  extendsPage(page, app) {
    const head = page.frontmatter.head ??= []
    if (page.path === '/404.html') {
      head.push(['meta', { name: 'robots', content: 'noindex' }])
      return
    }

    const { base, title, description } = app.siteData
    const canonical = siteUrl(page.path, base).href
    const pageTitle = [page.title, title].filter(Boolean).join(' | ')
    head.push(
      ['link', { rel: 'canonical', href: canonical }],
      ['link', { rel: 'describedby', href: siteUrl('/llms.txt', base).href }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:site_name', content: title }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: page.frontmatter.description ?? description }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:image', content: siteUrl('/images/share.png', base).href }],
      ['meta', { property: 'og:image:width', content: '1200' }],
      ['meta', { property: 'og:image:height', content: '630' }],
      ['meta', { property: 'og:image:alt', content: 'Marmot wordmark and illustration' }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    )

    if (guidesByRoute.has(page.path)) {
      head.push(['link', { rel: 'alternate', type: 'text/markdown', href: siteUrl(markdownPath(page.path), base).href }])
    }
  },

  async onGenerated(app) {
    const { base } = app.siteData
    const pages = app.pages.filter(page => page.path !== '/404.html')
    const urls = pages.map(page => siteUrl(page.path, base).href).sort()
    const sitemap = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls.map(url => `  <url><loc>${escapeXml(url)}</loc></url>`),
      '</urlset>',
      '',
    ].join('\n')

    const sections = new Map<string, string[]>()
    const guides = documentationSources.map(guide => {
      const page = pages.find(page => page.path === guide.route)
      if (!page) throw new Error(`Missing page for Markdown guide: ${guide.route}`)
      const route = markdownPath(guide.route)
      const entries = sections.get(guide.group) ?? []
      entries.push(`- [${page.title}](${siteUrl(route, base).href}): ${page.frontmatter.description}`)
      sections.set(guide.group, entries)
      return { guide, title: page.title, route }
    })
    const llms = [
      llmsIntro.trimEnd(),
      ...Array.from(sections, ([heading, entries]) => `## ${heading}\n\n${entries.join('\n')}`),
      '## Optional',
      [
        `- [Marmot apps](${siteUrl('/apps.html', base).href}): Apps built on the protocol.`,
        `- [Release notes](${siteUrl('/updates.html', base).href}): Published MDK and Marmot TypeScript changes.`,
      ].join('\n'),
    ].join('\n\n') + '\n'

    await Promise.all([
      ...guides.map(async ({ guide, title, route }) => {
        const snapshot = app.dir.source(`.vuepress/data/documentation/${guide.id}.json`)
        const document = JSON.parse(await readFile(snapshot, 'utf8'))
        const markdown = guideMarkdown(document, title, siteUrl(guide.route, base), siteUrl('/', base))
        await writeFile(app.dir.dest(route.slice(1)), markdown)
      }),
      writeFile(app.dir.dest('sitemap.xml'), sitemap),
      writeFile(app.dir.dest('llms.txt'), llms),
    ])
  },
}
