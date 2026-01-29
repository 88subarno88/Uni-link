import { sendTransaction, waitForTransactionReceipt } from 'wagmi/actions'
import { parseEther } from 'viem'
import { config } from '../config/wagmi'

export interface BridgeTransaction {
  hash: string
  status: 'pending' | 'success' | 'failed'
  fromChain: number
  toChain: number
  amount: string
  timestamp: number
}

export class BridgeService {
  // Simulate bridge by sending ETH to the same address on destination chain
  // In production, this would interact with Yellow Network or LI.FI
  static async executeBridge(
    fromChainId: number,
    toChainId: number,
    amount: string,
    toAddress: string
  ): Promise<BridgeTransaction> {
    try {
      // Step 1: Send transaction on source chain
      const hash = await sendTransaction(config, {
        to: toAddress as `0x${string}`,
        value: parseEther(amount),
        chainId: fromChainId,
      })

      // Step 2: Wait for confirmation
      const receipt = await waitForTransactionReceipt(config, {
        hash,
        chainId: fromChainId,
      })

      // Step 3: Return transaction info
      return {
        hash,
        status: receipt.status === 'success' ? 'success' : 'failed',
        fromChain: fromChainId,
        toChain: toChainId,
        amount,
        timestamp: Date.now(),
      }
    } catch (error: any) {
      console.error('Bridge error:', error)
      throw new Error(error?.message || 'Bridge transaction failed')
    }
  }

  // Get transaction history from localStorage
  static getHistory(): BridgeTransaction[] {
    const history = localStorage.getItem('bridge_history')
    return history ? JSON.parse(history) : []
  }

  // Save transaction to history
  static saveToHistory(tx: BridgeTransaction) {
    const history = this.getHistory()
    history.unshift(tx)
    // Keep only last 20 transactions
    localStorage.setItem('bridge_history', JSON.stringify(history.slice(0, 20)))
  }
}
