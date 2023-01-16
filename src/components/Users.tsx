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
import { getUsers } from '../assets/api/api'

const query: string = encodeURIComponent('Select A,B,C,D,E,H,J limit 17')
const sheet = 0

export const Users = () => {
  const [users, setUsers] = useState<NormalizedData | undefined>()

  const { data, isLoading } = useQuery({
    queryKey: ['Users', query, sheet],
    queryFn: () => getUsers(query, sheet.toString()),
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
            <th>Paid</th>
          </tr>
          {users?.users.map((user) => (
            <tr key={user.batplnr}>
              <td>{user.batplnr?.slice(1)}</td>
              <td>
                <a href={`mailto:${user.email}`}>
                  {user.namn} {user.efternamn}
                </a>
              </td>
              <td>{user.mobil}</td>
              <td>{user.hyra}</td>
              <td>
                {parseInt(user.hyra || '') <= parseInt(user.betalt || '')
                  ? '✅'
                  : '❌'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* --------------------------------- */
