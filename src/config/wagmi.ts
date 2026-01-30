import { http, createConfig } from 'wagmi'
import { sepolia, polygonAmoy, arbitrumSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia, polygonAmoy, arbitrumSepolia],
  connectors: [
    injected(),
  ],
  transports: {
    // Use multiple fallback RPCs for better reliability
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
    [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology'),
    [arbitrumSepolia.id]: http('https://sepolia-rollup.arbitrum.io/rpc'),
  },
  // Enable multi-chain queries
  multiInjectedProviderDiscovery: false,
})
