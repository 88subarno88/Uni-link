import { useSuiClientQuery } from '@mysten/dapp-kit'
import { useCurrentAccount } from '@mysten/dapp-kit'

export function useSuiBalance() {
  const account = useCurrentAccount()
  
  const { data, isLoading, error, refetch } = useSuiClientQuery(
    'getBalance',
    {
      owner: account?.address || '',
    },
    {
      enabled: !!account?.address,
      refetchInterval: 10000,
    }
  )

  const balance = data ? (Number(data.totalBalance) / 1_000_000_000).toFixed(4) : '0.0000'

  return {
    balance,
    isLoading,
    error,
    refetch,
    address: account?.address
  }
}
