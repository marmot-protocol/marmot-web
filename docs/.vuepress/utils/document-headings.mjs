// The page supplies H1. Compress gaps in the upstream outline while preserving
// sibling/child relationships, heading text, and GitHub-compatible anchor IDs.
export function normalizeDocumentHeadings(html) {
  const parents = [{ source: 1, level: 1 }]
  return html.replace(/<h([2-6])(\b[^>]*)>([\s\S]*?)<\/h\1>/g, (_, source, attributes, content) => {
    source = Number(source)
    while (parents.at(-1).source >= source) parents.pop()
    const level = parents.at(-1).level + 1
    parents.push({ source, level })
    return `<h${level}${attributes}>${content}</h${level}>`
  })
}
