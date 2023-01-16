import { useEffect, useState } from 'react'
import {
  useQuery,
  // useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// https://docs.google.com/spreadsheets/d/16yvhnB75FaIQeGL6Su2317ub2EbF-XondlGCzqTg06I/edit?usp=sharing
const fetchSheetUrl =
  'https://docs.google.com/spreadsheets/d/16yvhnB75FaIQeGL6Su2317ub2EbF-XondlGCzqTg06I/gviz/tq?'

const regex = /[^\{]+(.+)[^\{]+/
const getUsers = (): Promise<void | RootObject> =>
  fetch(fetchSheetUrl)
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
  const [spots, setSpots] = useState<Row[]>([])

  const { data, isLoading } = useQuery({
    queryKey: ['Users'],
    queryFn: getUsers,
  })

  useEffect(() => {
    if (!data) return
    // console.log('data', data)
    setSpots(data.table.rows.slice(0, 17))
  }, [data])

  if (isLoading || spots.length === 0) return <div>Loading spreadsheet...</div>
  return (
    <div>
      <table>
        <tbody>
          <tr>
            {data?.table.cols.map((header, i) => (
              <th key={i}>{header.label}</th>
            ))}
          </tr>
          {spots.map((row, y) => (
            <tr key={y}>
              {row.c?.map((rowC, g) => (
                <td key={g}>{rowC?.v || ''}</td>
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
