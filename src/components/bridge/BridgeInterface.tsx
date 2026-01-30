import { useState } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { sepolia, polygonAmoy, arbitrumSepolia } from 'wagmi/chains'
import { BridgeService } from '../../services/bridgeService'
import TransactionStatus from '../transaction/TransactionStatus'

// Warning Banner Component
function BridgeWarning() {
  return (
    <div style={{
      background: '#fef3c7',
      border: '2px solid #f59e0b',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '30px',
      maxWidth: '600px',
      margin: '0 auto 30px auto'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: '12px' 
      }}>
        <span style={{ fontSize: '28px', flexShrink: 0 }}>⚠️</span>
        <div>
          <h4 style={{ 
            margin: '0 0 10px 0', 
            color: '#92400e',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            Demo Mode - Testnet Simulation
          </h4>
          <p style={{ 
            margin: '0 0 8px 0', 
            fontSize: '14px', 
            color: '#78350f',
            lineHeight: '1.5'
          }}>
            This bridge demonstrates the user experience and transaction flow. 
            Currently, transactions are executed on the source chain only.
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: '13px', 
            color: '#78350f',
            fontStyle: 'italic',
            lineHeight: '1.4'
          }}>
            <strong>For HackMoney demo:</strong> Your Sepolia balance will decrease, 
            but assets won't appear on the destination chain. Real cross-chain 
            bridging requires deployed bridge contracts (LayerZero/Axelar) on both chains.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function BridgeInterface() {
  const { address, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  
  const [fromChain, setFromChain] = useState(sepolia.id)
  const [toChain, setToChain] = useState(polygonAmoy.id)
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [txStatus, setTxStatus] = useState<{
    hash: string
    status: 'pending' | 'success' | 'failed'
    fromChain: string
    toChain: string
    amount: string
    explorerUrl?: string
  } | null>(null)

  const chains = [
    { id: sepolia.id, name: 'Sepolia', emoji: '🔷', color: '#627EEA', explorer: 'https://sepolia.etherscan.io' },
    { id: polygonAmoy.id, name: 'Polygon Amoy', emoji: '🟣', color: '#8247E5', explorer: 'https://amoy.polygonscan.com' },
    { id: arbitrumSepolia.id, name: 'Arbitrum Sepolia', emoji: '🔵', color: '#28A0F0', explorer: 'https://sepolia.arbiscan.io' },
  ]

  const handleBridge = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (!address) {
      alert('Please connect your wallet')
      return
    }

    if (chain?.id !== fromChain) {
      try {
        await switchChain({ chainId: fromChain })
      } catch (error) {
        alert('Please switch to the source chain in your wallet')
        return
      }
    }

    setIsProcessing(true)
    const fromChainInfo = chains.find(c => c.id === fromChain)
    const toChainInfo = chains.find(c => c.id === toChain)

    try {
      setTxStatus({
        hash: '',
        status: 'pending',
        fromChain: fromChainInfo?.name || 'Unknown',
        toChain: toChainInfo?.name || 'Unknown',
        amount: amount
      })

      const tx = await BridgeService.executeBridge(
        fromChain,
        toChain,
        amount,
        address
      )

      setTxStatus({
        hash: tx.hash,
        status: tx.status,
        fromChain: fromChainInfo?.name || 'Unknown',
        toChain: toChainInfo?.name || 'Unknown',
        amount: amount,
        explorerUrl: `${fromChainInfo?.explorer}/tx/${tx.hash}`
      })

      BridgeService.saveToHistory(tx)

      if (tx.status === 'success') {
        setTimeout(() => {
          setAmount('')
        }, 2000)
      }
    } catch (error: any) {
      console.error('Bridge error:', error)
      setTxStatus({
        hash: '',
        status: 'failed',
        fromChain: fromChainInfo?.name || 'Unknown',
        toChain: toChainInfo?.name || 'Unknown',
        amount: amount
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const swapChains = () => {
    const temp = fromChain
    setFromChain(toChain)
    setToChain(temp)
  }

  const estimatedReceive = amount ? (parseFloat(amount) * 0.98).toFixed(4) : '0.0000'
  const bridgeFee = amount ? (parseFloat(amount) * 0.02).toFixed(4) : '0.0000'

  return (
    <>
      {/* Warning Banner */}
      <BridgeWarning />

      {/* Main Bridge Card */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{fontSize: '2em', marginBottom: '30px', textAlign: 'center'}}>
          🌉 Bridge Assets
        </h2>

        {/* From Chain */}
        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', marginBottom: '10px', color: '#666', fontSize: '14px', fontWeight: 'bold'}}>
            From
          </label>
          <select
            value={fromChain}
            onChange={(e) => setFromChain(Number(e.target.value))}
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '16px',
              borderRadius: '10px',
              border: '2px solid #e5e7eb',
              cursor: 'pointer',
              background: 'white'
            }}
          >
            {chains.filter(c => c.id !== toChain).map(chain => (
              <option key={chain.id} value={chain.id}>
                {chain.emoji} {chain.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', marginBottom: '10px', color: '#666', fontSize: '14px', fontWeight: 'bold'}}>
            Amount
          </label>
          <div style={{position: 'relative'}}>
            <input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '20px',
                borderRadius: '10px',
                border: '2px solid #e5e7eb',
                paddingRight: '70px'
              }}
            />
            <span style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666',
              fontWeight: 'bold'
            }}>
              ETH
            </span>
          </div>
        </div>

        {/* Swap Button */}
        <div style={{textAlign: 'center', margin: '20px 0'}}>
          <button
            onClick={swapChains}
            disabled={isProcessing}
            style={{
              background: '#f3f4f6',
              border: '2px solid #e5e7eb',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              fontSize: '24px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isProcessing) {
                e.currentTarget.style.transform = 'rotate(180deg)'
                e.currentTarget.style.background = '#e5e7eb'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg)'
              e.currentTarget.style.background = '#f3f4f6'
            }}
          >
            ↓↑
          </button>
        </div>

        {/* To Chain */}
        <div style={{marginBottom: '30px'}}>
          <label style={{display: 'block', marginBottom: '10px', color: '#666', fontSize: '14px', fontWeight: 'bold'}}>
            To
          </label>
          <select
            value={toChain}
            onChange={(e) => setToChain(Number(e.target.value))}
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '16px',
              borderRadius: '10px',
              border: '2px solid #e5e7eb',
              cursor: 'pointer',
              background: 'white'
            }}
          >
            {chains.filter(c => c.id !== fromChain).map(chain => (
              <option key={chain.id} value={chain.id}>
                {chain.emoji} {chain.name}
              </option>
            ))}
          </select>
        </div>

        {/* Estimated Receive */}
        {amount && parseFloat(amount) > 0 && (
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #bfdbfe',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
              <span style={{color: '#1e40af', fontSize: '14px'}}>You'll receive (Demo):</span>
              <span style={{color: '#1e40af', fontSize: '18px', fontWeight: 'bold'}}>
                ~{estimatedReceive} ETH
              </span>
            </div>
            <div style={{fontSize: '12px', color: '#64748b'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                <span>Bridge Fee (2%):</span>
                <span>{bridgeFee} ETH</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span>Estimated Time:</span>
                <span>~30 seconds ⚡</span>
              </div>
            </div>
          </div>
        )}

        {/* Bridge Button */}
        <button
          onClick={handleBridge}
          disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
          style={{
            width: '100%',
            padding: '18px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            background: (amount && parseFloat(amount) > 0 && !isProcessing)
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : '#d1d5db',
            border: 'none',
            borderRadius: '12px',
            cursor: (amount && parseFloat(amount) > 0 && !isProcessing) ? 'pointer' : 'not-allowed',
            boxShadow: (amount && parseFloat(amount) > 0 && !isProcessing) ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          {isProcessing ? '⏳ Processing...' : '🌉 Bridge Now (Demo)'}
        </button>

        {/* Info */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: '10px',
          fontSize: '12px',
          color: '#92400e'
        }}>
          <strong>⚡ Powered by Yellow Network</strong>
          <p style={{margin: '5px 0 0 0'}}>
            Fast state channel transfers with minimal fees. Bridge completes in ~30 seconds!
          </p>
        </div>

        {/* Technical Note */}
        <div style={{
          marginTop: '15px',
          padding: '12px',
          background: '#f3f4f6',
          borderRadius: '8px',
          fontSize: '11px',
          color: '#6b7280',
          borderLeft: '3px solid #9ca3af'
        }}>
          <strong>🔧 Technical Note:</strong> This demo executes transactions on the source chain. 
          Production implementation will integrate LayerZero OFT (Omnichain Fungible Token) 
          standard for true cross-chain asset transfer.
        </div>
      </div>

      {/* Transaction Status Modal */}
      {txStatus && (
        <TransactionStatus
          hash={txStatus.hash}
          status={txStatus.status}
          fromChain={txStatus.fromChain}
          toChain={txStatus.toChain}
          amount={txStatus.amount}
          explorerUrl={txStatus.explorerUrl}
          onClose={() => setTxStatus(null)}
        />
      )}
    </>
  )
}
