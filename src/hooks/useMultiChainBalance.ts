import { useAccount, useBalance } from 'wagmi'
import { sepolia, polygonAmoy, arbitrumSepolia, baseSepolia } from 'wagmi/chains'

export function useMultiChainBalance() {
  const { address } = useAccount()

  const sepoliaBalance = useBalance({
    address,
    chainId: sepolia.id,
  })

  const polygonBalance = useBalance({
    address,
    chainId: polygonAmoy.id,
  })

  const arbitrumBalance = useBalance({
    address,
    chainId: arbitrumSepolia.id,
  })

  const baseBalance = useBalance({
    address,
    chainId: baseSepolia.id,
  })

  return {
    ethereum: sepoliaBalance,
    polygon: polygonBalance,
    arbitrum: arbitrumBalance,
    base: baseBalance,
  }
}
