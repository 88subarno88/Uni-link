// Sui Bridge Configuration using Circle CCTP
// CCTP = Cross-Chain Transfer Protocol for USDC

export const SUI_BRIDGE_CONFIG = {
  // Sui Network
  sui: {
    network: 'testnet',
    rpcUrl: 'https://fullnode.testnet.sui.io',
    faucetUrl: 'https://faucet.testnet.sui.io/gas',
    // Circle USDC on Sui Testnet (placeholder - update with real address)
    usdcCoinType: '0x...::usdc::USDC',
    // Sui Bridge Module (would be deployed contract)
    bridgePackageId: '0x...',
  },

  // Ethereum Sepolia
  ethereum: {
    chainId: 11155111,
    name: 'Sepolia',
    // Circle USDC on Sepolia
    usdcAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    // Circle TokenMessenger for CCTP
    tokenMessenger: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
    // Circle MessageTransmitter
    messageTransmitter: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
  },

  // Bridge Settings
  settings: {
    minBridgeAmount: 1, // 1 USDC minimum
    maxBridgeAmount: 10000, // 10k USDC maximum
    estimatedTime: '2-5 minutes',
    fee: 0.1, // 0.1% bridge fee
  }
}

// Domain IDs for CCTP
export const CCTP_DOMAINS = {
  ethereum: 0,
  avalanche: 1,
  optimism: 2,
  arbitrum: 3,
  base: 6,
  polygon: 7,
  sui: 100 // Hypothetical - Sui would get assigned one
}
