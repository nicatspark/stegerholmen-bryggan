import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { normalizeData } from '../helpers/normalizeData'
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
    const normalizedData = normalizeData(data) as NormalizedData
    setUsers(normalizedData)
    console.log('normalized data', normalizedData)
  }, [data])

  if (isLoading)
    return (
      <>
        <h2>Clients</h2>
        <div>Loading spreadsheet...</div>
      </>
    )
  return (
    <>
      <h2>Clients</h2>
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
            {users?.rows.map((user) => (
              <tr key={user.batplnr}>
                <td>{user.batplnr?.slice(1)}</td>
                <td className='ellipsis'>
                  <EmailWrap
                    fullname={`${user.namn || ''} ${user.efternamn || ''}`}
                    email={user.email}
                  />
                </td>
                <td>
                  <a href={`tel:${user.mobil}`}>{user.mobil}</a>
                </td>
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
    </>
  )
}

/* --------------------------------- */

function EmailWrap({
  fullname,
  email,
}: {
  fullname: string
  email: string | undefined | null
}) {
  if (!email || email.trim() === '') return <>{fullname}</>
  return <a href={`mailto:${email}`}>{fullname}</a>
}

interface NormalizedData {
  colHeader: string[]
  rows: Rows[]
}

interface Rows {
  batplnr?: string
  namn?: string
  efternamn?: string
  email?: string
  mobil?: string
  hyra?: string
  betalt?: string
}
