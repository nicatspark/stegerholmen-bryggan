import { toCurrency } from './toCurrency'

export interface GoogleSheet {
  version: string
  reqId: string
  status: string
  sig: string
  table: Table
}

export interface Table {
  cols: Col[]
  rows: Row[]
  parsedNumHeaders: number
}

export interface Row {
  c?: C[]
}

export interface C {
  v: (null | number | string)[]
  f?: string
}

export interface Col {
  id: string
  label: string
  type: string
  pattern?: string
}

/* -------------------------- */

export interface NormalizedData {
  colHeader: string[]
  rows: unknown[]
}

/* -------------------------- */

export function normalizeData(data: GoogleSheet): NormalizedData {
  let colHeader: string[] = []
  const rootUsers = {
    colHeader,
    rows: data.table.rows.map((row) => {
      let rows: Record<string, unknown> = {}
      data.table.cols.forEach((header, i) => {
        const safeHeader = makeSafe(header.label)
        if (!colHeader.includes(safeHeader)) colHeader.push(safeHeader)
        const newColData = {
          [safeHeader]: treatData(row.c && row.c[i]),
        }
        rows = { ...rows, ...newColData }
      })
      return rows
    }),
  }
  rootUsers.colHeader = colHeader
  return rootUsers

  function makeSafe(str: string) {
    return str
      .split('')
      .map((letter: string) => changeLetter(letter))
      .join('')

    function changeLetter(letter: string) {
      switch (letter.replace(/[^(\d\wÅÄÖåäö)]/g, '')) {
        case 'ä':
        case 'å':
          return 'a'
        case 'ö':
          return 'o'
        case 'Ä':
        case 'Å':
          return 'A'
        case 'Ö':
          return 'O'
        case ' ':
          return '_'
        default:
          return letter
      }
    }
  }

  function treatData(d?: C) {
    if (!d) return null
    const data = d.f?.includes('kr') ? toCurrency(d.v, 'SEK') : d.v
    return data
  }
}
