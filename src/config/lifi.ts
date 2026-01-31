import { createConfig, getRoutes, executeRoute } from '@lifi/sdk'

// Create Li.Fi config
const lifiConfig = createConfig({
  integrator: 'uni-chain-hackmoney-2026',
})

// Get supported chains
export async function getSupportedChains() {
  try {
    const response = await fetch('https://li.quest/v1/chains')
    const chains = await response.json()
    console.log('✅ Li.Fi supported chains:', chains.map((c: any) => `${c.name} (${c.id})`))
    return chains
  } catch (error) {
    console.error('❌ Failed to get chains:', error)
    return []
  }
}

// Get route for bridge
export async function getBridgeRoute(
  fromChainId: number,
  toChainId: number,
  fromAddress: string,
  amount: string
) {
  try {
    console.log('🔍 Getting Li.Fi route:', {
      fromChainId,
      toChainId,
      fromAddress,
      amount
    })

    const amountWei = (parseFloat(amount) * 1e18).toString()

    const routesRequest = {
      fromChainId,
      toChainId,
      fromTokenAddress: '0x0000000000000000000000000000000000000000',
      toTokenAddress: '0x0000000000000000000000000000000000000000',
      fromAmount: amountWei,
      fromAddress,
      toAddress: fromAddress,
      options: {
        slippage: 0.03,
        order: 'RECOMMENDED'
      }
    }

    const result = await getRoutes(routesRequest)

    if (!result.routes || result.routes.length === 0) {
      throw new Error('No routes found for this chain pair')
    }

    console.log('✅ Found routes:', result.routes.length)
    return result.routes[0]
  } catch (error) {
    console.error('❌ Failed to get route:', error)
    throw error
  }
}

// Execute bridge with Li.Fi
export async function executeLiFiBridge(route: any, signer: any) {
  try {
    console.log('🚀 Executing Li.Fi bridge...')

    const execution = executeRoute(route, lifiConfig)
    
    let txHash = ''
    
    for await (const step of execution) {
      console.log('📝 Step:', step.type, step)
      
      if (step.type === 'TRANSACTION_SUBMITTED' || step.type === 'TRANSACTION_DONE') {
        if (step.txHash) {
          txHash = step.txHash
        }
      }
    }

    return { success: true, txHash }
  } catch (error) {
    console.error('❌ Bridge execution failed:', error)
    throw error
  }
}
