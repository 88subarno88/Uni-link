import { parseEther } from 'viem'
import { getWalletClient, getPublicClient } from '@wagmi/core'
import { config } from '../config/wagmi'

// Transaction history storage
const HISTORY_KEY = 'bridge_history'

export class BridgeService {
  /**
   * Execute bridge transaction
   */
  static async executeBridge(
    fromChainId: number,
    toChainId: number,
    amount: string,
    address: string
  ) {
    try {
      console.log('🌉 Starting bridge:', {
        amount,
        from: fromChainId,
        to: toChainId,
        address
      })

      if (fromChainId === toChainId) {
        throw new Error('Source and destination chains must be different')
      }

      // Get wallet client for signing
      const walletClient = await getWalletClient(config, {
        chainId: fromChainId
      })

      if (!walletClient) {
        throw new Error('Failed to get wallet client')
      }

      // Get public client for reading blockchain data
      const publicClient = getPublicClient(config, {
        chainId: fromChainId
      })

      if (!publicClient) {
        throw new Error('Failed to get public client')
      }

      // DEMO MODE: Send small amount to burn address
      // In production, this would interact with bridge contracts
      const hash = await walletClient.sendTransaction({
        to: '0x000000000000000000000000000000000000dEaD', // Burn address
        value: parseEther(amount),
        chain: walletClient.chain
      })

      console.log('✅ Transaction sent:', hash)

      // Wait for confirmation using publicClient
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash,
        confirmations: 1
      })
      
      console.log('✅ Transaction confirmed:', receipt)

      const transaction = {
        hash,
        fromChain: fromChainId,
        toChain: toChainId,
        amount,
        timestamp: Date.now(),
        status: receipt.status === 'success' ? 'success' : 'failed',
        address
      }

      return transaction
    } catch (error: any) {
      console.error('❌ Bridge failed:', error)
      
      // Handle user rejection
      if (error.message?.includes('User rejected') || error.message?.includes('User denied')) {
        throw new Error('Transaction rejected by user')
      }
      
      throw error
    }
  }

  /**
   * Save transaction to local storage history
   */
  static saveToHistory(transaction: any) {
    try {
      const history = this.getHistory()
      history.unshift(transaction)
      
      // Keep only last 50 transactions
      const trimmed = history.slice(0, 50)
      
      localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed))
    } catch (error) {
      console.error('Failed to save to history:', error)
    }
  }

  /**
   * Get transaction history
   */
  static getHistory() {
    try {
      const stored = localStorage.getItem(HISTORY_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to get history:', error)
      return []
    }
  }

  /**
   * Clear transaction history
   */
  static clearHistory() {
    try {
      localStorage.removeItem(HISTORY_KEY)
    } catch (error) {
      console.error('Failed to clear history:', error)
    }
  }

  /**
   * Get estimated bridge time (in seconds)
   */
  static getEstimatedTime(fromChainId: number, toChainId: number): number {
    // Demo: Always return 30 seconds
    // In production, this would vary based on chains and bridge protocol
    return 30
  }

  /**
   * Get bridge fee percentage
   */
  static getBridgeFee(fromChainId: number, toChainId: number): number {
    // Demo: 2% fee
    // In production, this would vary based on liquidity and demand
    return 0.02
  }

  /**
   * Calculate estimated receive amount
   */
  static calculateReceiveAmount(amount: string, fromChainId: number, toChainId: number): string {
    try {
      const amountNum = parseFloat(amount)
      if (isNaN(amountNum) || amountNum <= 0) {
        return '0.0000'
      }

      const fee = this.getBridgeFee(fromChainId, toChainId)
      const receiveAmount = amountNum * (1 - fee)
      
      return receiveAmount.toFixed(4)
    } catch (error) {
      return '0.0000'
    }
  }
}

// Legacy export for backwards compatibility
export const executeBridge = BridgeService.executeBridge.bind(BridgeService)
