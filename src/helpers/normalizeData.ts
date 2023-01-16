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

export interface NormalizedData {
  colHeader: string[]
  users: User[]
}

interface User {
  batplnr?: string
  namn?: string
  efternamn?: string
  email?: string
  mobil?: string
  hyra?: number
}

export function normalizeData(data: GoogleSheet): NormalizedData {
  let colHeader: string[] = []
  const rootUsers = {
    colHeader,
    users: data.table.rows.map((row) => {
      let user: User = {}
      data.table.cols.forEach((header, i) => {
        const safeHeader = makeSafe(header.label)
        if (!colHeader.includes(safeHeader)) colHeader.push(safeHeader)
        const newColData = {
          [safeHeader]: treatData(row.c && row.c[i]),
        }
        user = { ...user, ...newColData }
      })
      return user
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

const toCurrency = <T extends unknown>(
  n: T,
  curr: string,
  LanguageFormat = undefined
): T | string => {
  if (typeof n === 'number' && isFinite(n)) {
    return Intl.NumberFormat(LanguageFormat, {
      style: 'currency',
      currency: curr,
    }).format(n)
  }
  return n
}
