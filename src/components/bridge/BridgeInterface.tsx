import { useState } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { sepolia, polygonAmoy, arbitrumSepolia, baseSepolia } from 'wagmi/chains'

export default function BridgeInterface() {
  const { address, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  
  const [fromChain, setFromChain] = useState(sepolia.id)
  const [toChain, setToChain] = useState(polygonAmoy.id)
  const [amount, setAmount] = useState('')

  const chains = [
    { id: sepolia.id, name: 'Sepolia', emoji: '🔷', color: '#627EEA' },
    { id: polygonAmoy.id, name: 'Polygon Amoy', emoji: '🟣', color: '#8247E5' },
    { id: arbitrumSepolia.id, name: 'Arbitrum Sepolia', emoji: '🔵', color: '#28A0F0' },
    { id: baseSepolia.id, name: 'Base Sepolia', emoji: '🔷', color: '#0052FF' },
  ]

  const handleBridge = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }
    
    // For now, just show a success message
    alert(`🎉 Bridging ${amount} ETH from ${chains.find(c => c.id === fromChain)?.name} to ${chains.find(c => c.id === toChain)?.name}!\n\nThis will be implemented with Yellow Network in the next step!`)
  }

  const swapChains = () => {
    const temp = fromChain
    setFromChain(toChain)
    setToChain(temp)
  }

  const estimatedReceive = amount ? (parseFloat(amount) * 0.98).toFixed(4) : '0.0000'

  return (
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
          style={{
            background: '#f3f4f6',
            border: '2px solid #e5e7eb',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '24px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(180deg)'
            e.currentTarget.style.background = '#e5e7eb'
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
      {amount && (
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bfdbfe',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{color: '#1e40af', fontSize: '14px'}}>You'll receive:</span>
            <span style={{color: '#1e40af', fontSize: '18px', fontWeight: 'bold'}}>
              ~{estimatedReceive} ETH
            </span>
          </div>
          <div style={{marginTop: '10px', fontSize: '12px', color: '#64748b'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
              <span>Bridge Fee (2%):</span>
              <span>{amount ? (parseFloat(amount) * 0.02).toFixed(4) : '0.0000'} ETH</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span>Estimated Time:</span>
              <span>~5 seconds ⚡</span>
            </div>
          </div>
        </div>
      )}

      {/* Bridge Button */}
      <button
        onClick={handleBridge}
        disabled={!amount || parseFloat(amount) <= 0}
        style={{
          width: '100%',
          padding: '18px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'white',
          background: amount && parseFloat(amount) > 0 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : '#d1d5db',
          border: 'none',
          borderRadius: '12px',
          cursor: amount && parseFloat(amount) > 0 ? 'pointer' : 'not-allowed',
          boxShadow: amount && parseFloat(amount) > 0 ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none',
          transition: 'all 0.2s'
        }}
      >
        🌉 Bridge Now
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
          Fast state channel transfers with minimal fees. Bridge completes in ~5 seconds!
        </p>
      </div>
    </div>
  )
}
