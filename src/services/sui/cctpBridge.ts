import { parseUnits, formatUnits } from 'viem'
import { getPublicClient, getWalletClient, waitForTransactionReceipt } from '@wagmi/core'
import { config } from '../../config/wagmi'
import { SUI_BRIDGE_CONFIG } from '../../config/suiBridge'
import { USDC_ABI } from '../../config/usdcAbi'

export interface BridgeStatus {
  step: 'approving' | 'burning' | 'attestation' | 'minting' | 'complete' | 'failed'
  message: string
  txHash?: string
  progress: number
}

export class CCTPBridgeService {
  /**
   * Bridge USDC from Ethereum to Sui
   */
  async bridgeToSui(
    amount: string,
    fromAddress: string,
    toSuiAddress: string,
    onStatusUpdate: (status: BridgeStatus) => void
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      const amountInUnits = parseUnits(amount, 6) // USDC has 6 decimals

      // Step 1: Approve USDC spending
      onStatusUpdate({
        step: 'approving',
        message: 'Approving USDC...',
        progress: 20
      })

      const approvalHash = await this.approveUsdc(fromAddress, amountInUnits)
      console.log('USDC approved:', approvalHash)

      // Step 2: Burn USDC on Ethereum (via Circle CCTP)
      onStatusUpdate({
        step: 'burning',
        message: 'Burning USDC on Ethereum...',
        progress: 40
      })

      const burnTxHash = await this.burnUsdc(
        fromAddress,
        toSuiAddress,
        amountInUnits
      )
      console.log('USDC burned:', burnTxHash)

      // Step 3: Get Circle attestation
      onStatusUpdate({
        step: 'attestation',
        message: 'Getting Circle attestation...',
        progress: 60
      })

      const attestation = await this.getAttestation(burnTxHash)
      console.log('Attestation received:', attestation)

      // Step 4: Mint USDC on Sui
      onStatusUpdate({
        step: 'minting',
        message: 'Minting USDC on Sui...',
        progress: 80
      })

      // This would call Sui Move contract to mint USDC
      // For now, we'll simulate it
      await this.simulateSuiMint(attestation, toSuiAddress)

      onStatusUpdate({
        step: 'complete',
        message: 'Bridge complete!',
        progress: 100,
        txHash: burnTxHash
      })

      return { success: true, txHash: burnTxHash }

    } catch (error: any) {
      console.error('Bridge error:', error)
      onStatusUpdate({
        step: 'failed',
        message: error.message || 'Bridge failed',
        progress: 0
      })
      return { success: false, error: error.message }
    }
  }

  /**
   * Approve USDC spending
   */
  private async approveUsdc(
    fromAddress: string,
    amount: bigint
  ): Promise<string> {
    const walletClient = await getWalletClient(config, {
      chainId: SUI_BRIDGE_CONFIG.ethereum.chainId
    })

    if (!walletClient) {
      throw new Error('Wallet not connected')
    }

    const hash = await walletClient.writeContract({
      address: SUI_BRIDGE_CONFIG.ethereum.usdcAddress as `0x${string}`,
      abi: USDC_ABI,
      functionName: 'approve',
      args: [SUI_BRIDGE_CONFIG.ethereum.tokenMessenger as `0x${string}`, amount]
    })

    const publicClient = getPublicClient(config, {
      chainId: SUI_BRIDGE_CONFIG.ethereum.chainId
    })

    await publicClient!.waitForTransactionReceipt({ hash })

    return hash
  }

  /**
   * Burn USDC on Ethereum via Circle CCTP
   */
  private async burnUsdc(
    fromAddress: string,
    toSuiAddress: string,
    amount: bigint
  ): Promise<string> {
    // This is a DEMO implementation
    // In production, you'd call Circle's TokenMessenger contract
    // with depositForBurn(amount, destinationDomain, mintRecipient, burnToken)

    const walletClient = await getWalletClient(config, {
      chainId: SUI_BRIDGE_CONFIG.ethereum.chainId
    })

    if (!walletClient) {
      throw new Error('Wallet not connected')
    }

    // For demo: Just transfer USDC to a burn address
    const hash = await walletClient.writeContract({
      address: SUI_BRIDGE_CONFIG.ethereum.usdcAddress as `0x${string}`,
      abi: [{
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
      }],
      functionName: 'transfer',
      args: ['0x000000000000000000000000000000000000dEaD', amount]
    })

    const publicClient = getPublicClient(config, {
      chainId: SUI_BRIDGE_CONFIG.ethereum.chainId
    })

    await publicClient!.waitForTransactionReceipt({ hash })

    return hash
  }

  /**
   * Get Circle attestation for cross-chain message
   */
  private async getAttestation(txHash: string): Promise<string> {
    // Poll Circle's attestation API
    const maxAttempts = 30 // 60 seconds max
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        // Circle's attestation service
        const response = await fetch(
          `https://iris-api-sandbox.circle.com/v1/attestations/${txHash}`
        )
        
        if (response.ok) {
          const data = await response.json()
          if (data.status === 'complete') {
            return data.attestation
          }
        }
      } catch (error) {
        console.log(`Attestation attempt ${i + 1}/${maxAttempts}...`)
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    throw new Error('Failed to get Circle attestation')
  }

  /**
   * Simulate minting USDC on Sui (demo mode)
   */
  private async simulateSuiMint(
    attestation: string,
    toAddress: string
  ): Promise<void> {
    // In production, this would call a Sui Move contract:
    // 
    // public entry fun receive_message(
    //   message: vector<u8>,
    //   attestation: vector<u8>,
    //   ctx: &mut TxContext
    // )
    
    console.log('Simulating Sui mint for:', toAddress)
    console.log('Attestation:', attestation.slice(0, 20) + '...')
    
    // Wait 3 seconds to simulate on-chain transaction
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    console.log('✅ USDC minted on Sui (simulated)')
  }

  /**
   * Get USDC balance on Ethereum
   */
  async getEthereumUsdcBalance(address: string): Promise<string> {
    try {
      const publicClient = getPublicClient(config, {
        chainId: SUI_BRIDGE_CONFIG.ethereum.chainId
      })

      if (!publicClient) {
        return '0.00'
      }

      const balance = await publicClient.readContract({
        address: SUI_BRIDGE_CONFIG.ethereum.usdcAddress as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'balanceOf',
        args: [address as `0x${string}`]
      })

      return formatUnits(balance as bigint, 6)
    } catch (error) {
      console.error('Error fetching USDC balance:', error)
      return '0.00'
    }
  }
}

export const cctpBridge = new CCTPBridgeService()
