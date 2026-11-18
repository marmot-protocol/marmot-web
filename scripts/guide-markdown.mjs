import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'
import { normalizeDocumentHeadings } from '../docs/.vuepress/utils/document-headings.mjs'

export function guideMarkdown(document, title, canonical, siteBase) {
  const converter = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })
  converter.use(gfm)

  // The importer escapes untrusted HTML. Keep it escaped when emitting Markdown.
  const escape = converter.escape.bind(converter)
  converter.escape = text => escape(text).replaceAll('<', '&lt;')
  converter.addRule('sourceTitle', {
    filter: node => node.nodeName === 'DIV' && node.classList.contains('mm-source-title'),
    replacement: content => `\n\n## ${content}\n\n`,
  })

  // Links in plain Markdown point to HTML where the original heading IDs exist.
  const html = normalizeDocumentHeadings(document.html)
    .replaceAll('href="__MARMOT_BASE__', `href="${siteBase.href}`)
    .replaceAll('href="#', `href="${canonical.href}#`)
  const project = document.repo === 'mdk' ? 'MDK' : 'Marmot TypeScript'
  return [
    `# ${title}`,
    `> ${project} ${document.version} · [Read on Marmot](${canonical.href}) · [Version-pinned source](${document.sourceUrl})`,
    converter.turndown(html),
  ].join('\n\n') + '\n'
}
