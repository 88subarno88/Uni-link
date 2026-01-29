import { http, createConfig } from 'wagmi'
import { sepolia, polygonAmoy, arbitrumSepolia, baseSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia, polygonAmoy, arbitrumSepolia, baseSepolia],
  connectors: [
    injected(),
  ],
  transports: {
    [sepolia.id]: http('https://rpc.sepolia.org'),
    [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology'),
    [arbitrumSepolia.id]: http('https://sepolia-rollup.arbitrum.io/rpc'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
})
