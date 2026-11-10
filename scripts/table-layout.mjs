// Preserve table relationships while letting narrow layouts repeat each column
// label beside its value. Labels come from the same upstream header row.
export function responsiveTables(md) {
  md.core.ruler.push('responsive-tables', state => {
    let headers = [], column = 0, inTable = false
    for (let i = 0; i < state.tokens.length; i++) {
      const token = state.tokens[i]
      if (token.type === 'table_open') {
        inTable = true
        headers = []
        token.attrJoin('class', 'mm-responsive-table')
        token.attrSet('role', 'table')
      } else if (token.type === 'table_close') inTable = false
      if (!inTable) continue
      if (token.type === 'thead_open' || token.type === 'tbody_open') token.attrSet('role', 'rowgroup')
      if (token.type === 'tr_open') { column = 0; token.attrSet('role', 'row') }
      if (token.type === 'th_open') {
        const inline = state.tokens[i + 1]
        headers.push((inline.children || []).filter(child => ['text', 'code_inline'].includes(child.type)).map(child => child.content).join(''))
        token.attrSet('scope', 'col')
        token.attrSet('role', 'columnheader')
      }
      if (token.type === 'td_open') {
        token.attrSet('data-label', headers[column++] || '')
        token.attrSet('role', 'cell')
      }
    }
  })
}
