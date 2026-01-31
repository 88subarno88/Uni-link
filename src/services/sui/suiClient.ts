import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { SUI_BRIDGE_CONFIG } from '../../config/suiBridge'

export class SuiClientService {
  private client: SuiClient

  constructor() {
    this.client = new SuiClient({ 
      url: getFullnodeUrl('testnet') 
    })
  }

  /**
   * Get SUI balance for an address
   */
  async getSuiBalance(address: string): Promise<string> {
    try {
      const balance = await this.client.getBalance({
        owner: address,
        coinType: '0x2::sui::SUI'
      })
      
      // Convert from MIST (1 SUI = 10^9 MIST)
      return (Number(balance.totalBalance) / 1e9).toFixed(4)
    } catch (error) {
      console.error('Error fetching SUI balance:', error)
      return '0.0000'
    }
  }

  /**
   * Get USDC balance on Sui
   */
  async getUsdcBalance(address: string): Promise<string> {
    try {
      const balance = await this.client.getBalance({
        owner: address,
        coinType: SUI_BRIDGE_CONFIG.sui.usdcCoinType
      })
      
      // USDC has 6 decimals
      return (Number(balance.totalBalance) / 1e6).toFixed(2)
    } catch (error) {
      console.error('Error fetching USDC balance:', error)
      return '0.00'
    }
  }

  /**
   * Get all coins owned by address
   */
  async getAllCoins(address: string) {
    try {
      const coins = await this.client.getAllCoins({
        owner: address
      })
      return coins.data
    } catch (error) {
      console.error('Error fetching coins:', error)
      return []
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(digest: string) {
    try {
      return await this.client.getTransactionBlock({
        digest,
        options: {
          showEffects: true,
          showEvents: true,
        }
      })
    } catch (error) {
      console.error('Error fetching transaction:', error)
      return null
    }
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(digest: string, timeoutMs = 60000): Promise<boolean> {
    const startTime = Date.now()
    
    while (Date.now() - startTime < timeoutMs) {
      try {
        const tx = await this.getTransaction(digest)
        if (tx?.effects?.status?.status === 'success') {
          return true
        }
        if (tx?.effects?.status?.status === 'failure') {
          return false
        }
      } catch (error) {
        // Transaction might not exist yet, keep waiting
      }
      
      // Wait 2 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    throw new Error('Transaction confirmation timeout')
  }
}

export const suiClient = new SuiClientService()
