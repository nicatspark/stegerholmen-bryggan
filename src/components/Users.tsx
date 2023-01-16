import { useEffect, useState } from 'react'
import {
  useQuery,
  // useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {
  normalizeData,
  GoogleSheet,
  NormalizedData,
} from '../helpers/normalizeData'

// https://docs.google.com/spreadsheets/d/16yvhnB75FaIQeGL6Su2317ub2EbF-XondlGCzqTg06I/edit?usp=sharing
const fetchSheetUrl =
  'https://docs.google.com/spreadsheets/d/16yvhnB75FaIQeGL6Su2317ub2EbF-XondlGCzqTg06I/gviz/tq?'
const query = encodeURIComponent('Select A,B,C,D,E,H limit 17')

const regex = /[^\{]+(.+)[^\{]+/

const getUsers = (): Promise<void | GoogleSheet> =>
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
  const [users, setUsers] = useState<NormalizedData | undefined>()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['Users'],
    queryFn: getUsers,
  })

  useEffect(() => {
    if (!data) return
    const normalizedData = normalizeData(data)
    setUsers(normalizedData)
    console.log('normalized data', normalizedData)
  }, [data])

  if (isLoading) return <div>Loading spreadsheet...</div>
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th>Nr</th>
            <th>Name</th>
            <th>Tel</th>
            <th>Rent</th>
          </tr>
          {users?.users.map((user) => (
            <tr key={user.batplnr}>
              <td>{user.batplnr}</td>
              <td>
                <a href={`mailto:${user.email}`}>
                  {user.namn} {user.efternamn}
                </a>
              </td>
              <td>{user.mobil}</td>
              <td>{user.hyra}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* --------------------------------- */
