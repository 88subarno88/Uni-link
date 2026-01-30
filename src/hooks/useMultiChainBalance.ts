import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { sepolia, polygonAmoy, arbitrumSepolia } from 'wagmi/chains'

interface BalanceData {
  formatted: string
  symbol: string
  decimals: number
}

interface BalanceResult {
  data: BalanceData | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useMultiChainBalance() {
  const { address } = useAccount()
  
  const [ethereum, setEthereum] = useState<BalanceResult>({
    data: null,
    isLoading: true,
    error: null,
    refetch: () => {}
  })
  
  const [polygon, setPolygon] = useState<BalanceResult>({
    data: null,
    isLoading: true,
    error: null,
    refetch: () => {}
  })
  
  const [arbitrum, setArbitrum] = useState<BalanceResult>({
    data: null,
    isLoading: true,
    error: null,
    refetch: () => {}
  })

  const fetchBalance = async (rpcUrl: string, address: string, symbol: string) => {
    try {
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [address, 'latest'],
          id: 1
        })
      })
      
      const data = await response.json()
      const balanceWei = parseInt(data.result, 16)
      const balanceEth = balanceWei / 1e18
      
      return {
        formatted: balanceEth.toString(),
        symbol: symbol,
        decimals: 18
      }
    } catch (error) {
      throw new Error(`Failed to fetch ${symbol} balance`)
    }
  }

  const fetchAllBalances = async () => {
    if (!address) return

    // Fetch Sepolia
    setEthereum(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const data = await fetchBalance('https://ethereum-sepolia-rpc.publicnode.com', address, 'ETH')
      setEthereum({ data, isLoading: false, error: null, refetch: fetchAllBalances })
    } catch (error: any) {
      setEthereum({ data: null, isLoading: false, error, refetch: fetchAllBalances })
    }

    // Fetch Polygon Amoy
    setPolygon(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const data = await fetchBalance('https://rpc-amoy.polygon.technology', address, 'POL')
      setPolygon({ data, isLoading: false, error: null, refetch: fetchAllBalances })
    } catch (error: any) {
      setPolygon({ data: null, isLoading: false, error, refetch: fetchAllBalances })
    }

    // Fetch Arbitrum Sepolia
    setArbitrum(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const data = await fetchBalance('https://sepolia-rollup.arbitrum.io/rpc', address, 'ETH')
      setArbitrum({ data, isLoading: false, error: null, refetch: fetchAllBalances })
    } catch (error: any) {
      setArbitrum({ data: null, isLoading: false, error, refetch: fetchAllBalances })
    }
  }

  useEffect(() => {
    fetchAllBalances()
    
    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchAllBalances, 15000)
    return () => clearInterval(interval)
  }, [address])

  return {
    ethereum,
    polygon,
    arbitrum,
  }
}
