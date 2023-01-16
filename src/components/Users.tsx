import { useEffect, useState } from 'react'
import {
  useQuery,
  // useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

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

// https://docs.google.com/spreadsheets/d/16yvhnB75FaIQeGL6Su2317ub2EbF-XondlGCzqTg06I/edit?usp=sharing
const fetchSheetUrl =
  'https://docs.google.com/spreadsheets/d/16yvhnB75FaIQeGL6Su2317ub2EbF-XondlGCzqTg06I/gviz/tq?'
const query = encodeURIComponent('Select A,B,C,D,E,H limit 17')

const regex = /[^\{]+(.+)[^\{]+/
const getUsers = (): Promise<void | RootObject> =>
  fetch(`${fetchSheetUrl}&tq=${query}`)
    .then((res) => res.text())
    .then((res) => {
      const stripGarbage = res.match(regex)
      if (!stripGarbage)
        throw new Error('Could not convert spreadsheet to JSON')
      return JSON.parse(stripGarbage[1].slice(0, -1))
    })
const queryClient = new QueryClient()

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Users />
    </QueryClientProvider>
  )
}

export const Users = () => {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['Users'],
    queryFn: getUsers,
  })

  if (isLoading) return <div>Loading spreadsheet...</div>
  return (
    <div>
      <table>
        <tbody>
          <tr>
            {data?.table.cols.map((header, i) => (
              <th key={i}>{header.label}</th>
            ))}
          </tr>
          {data?.table.rows.map((row, y) => (
            <tr key={y}>
              {row.c?.map((rowC, g) => (
                <td key={g}>{toCurrency(rowC?.v || '', 'SEK')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* --------------------------------- */

interface RootObject {
  version: string
  reqId: string
  status: string
  sig: string
  table: Table
}

interface Table {
  cols: Col[]
  rows: Row[]
  parsedNumHeaders: number
}

interface Row {
  c?: C[]
}

interface C {
  v: (null | number | string)[]
  f?: string
}

interface Col {
  id: string
  label: string
  type: string
  pattern?: string
}
