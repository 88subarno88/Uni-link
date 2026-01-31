import { useBalance } from 'wagmi'
import { sepolia, polygonAmoy, arbitrumSepolia } from 'wagmi/chains'

export function useMultiChainBalance() {
  const ethereum = useBalance({ chainId: sepolia.id })
  const polygon = useBalance({ chainId: polygonAmoy.id })
  const arbitrum = useBalance({ chainId: arbitrumSepolia.id })

  return {
    ethereum,
    polygon,
    arbitrum
  }
}
