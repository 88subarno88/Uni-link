import { http, createConfig } from 'wagmi'
import { sepolia, polygonAmoy, arbitrumSepolia } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo'

export const config = createConfig({
  chains: [sepolia, polygonAmoy, arbitrumSepolia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Uni-Chain' }),
    walletConnect({ projectId }),
  ],
  transports: {
    [sepolia.id]: http(),
    [polygonAmoy.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
})
