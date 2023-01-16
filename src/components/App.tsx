import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Users } from './Users'

const queryClient = new QueryClient()

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Users />
    </QueryClientProvider>
  )
}
