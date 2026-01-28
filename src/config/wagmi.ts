import { http, createConfig } from 'wagmi'
import { sepolia, polygonAmoy, arbitrumSepolia, baseSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia, polygonAmoy, arbitrumSepolia, baseSepolia],
  connectors: [
    injected(),
  ],
  transports: {
    [sepolia.id]: http(),
    [polygonAmoy.id]: http(),
    [arbitrumSepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
})
