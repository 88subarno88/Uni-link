import { useState } from 'react'
import { useAccount, useConnect } from 'wagmi'
import Dashboard from './components/Dashboard'
import BridgeInterface from './components/bridge/BridgeInterface'
import TransactionHistory from './pages/TransactionHistory'

export default function App() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bridge' | 'history'>('dashboard')

  const handleConnect = () => {
    const metamaskConnector = connectors.find(c => c.name === 'MetaMask') || connectors[0]
    connect({ connector: metamaskConnector })
  }

  if (!isConnected) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white',
          maxWidth: '600px',
          padding: '40px'
        }}>
          <h1 style={{ fontSize: '60px', margin: '0 0 20px 0' }}>🌉 Uni-Chain</h1>
          <h2 style={{ fontSize: '32px', margin: '0 0 40px 0', fontWeight: 'normal' }}>
            Universal Cross-Chain DeFi Hub
          </h2>
          <p style={{ fontSize: '18px', marginBottom: '40px', opacity: 0.9 }}>
            🎯 HackMoney 2026<br/>
            Bridge assets across EVM chains and Sui seamlessly
          </p>
          <button
            onClick={handleConnect}
            style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              padding: '20px 40px',
              borderRadius: '15px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
          >
            🔗 Connect Wallet
          </button>
          <p style={{ fontSize: '14px', marginTop: '20px', opacity: 0.7 }}>
            Supported: MetaMask, Coinbase Wallet, WalletConnect
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      padding: '20px' 
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto 20px auto', 
        display: 'flex', 
        gap: '10px', 
        background: 'rgba(255,255,255,0.1)', 
        borderRadius: '15px', 
        padding: '5px' 
      }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{
            flex: 1,
            padding: '15px',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            background: activeTab === 'dashboard' ? 'white' : 'transparent',
            color: activeTab === 'dashboard' ? '#667eea' : 'white',
            transition: 'all 0.2s'
          }}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveTab('bridge')}
          style={{
            flex: 1,
            padding: '15px',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            background: activeTab === 'bridge' ? 'white' : 'transparent',
            color: activeTab === 'bridge' ? '#667eea' : 'white',
            transition: 'all 0.2s'
          }}
        >
          🌉 Bridge
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            flex: 1,
            padding: '15px',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            background: activeTab === 'history' ? 'white' : 'transparent',
            color: activeTab === 'history' ? '#667eea' : 'white',
            transition: 'all 0.2s'
          }}
        >
          📜 History
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'bridge' && <BridgeInterface />}
        {activeTab === 'history' && <TransactionHistory />}
      </div>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '40px auto 0 auto', 
        textAlign: 'center', 
        color: 'white', 
        opacity: 0.9 
      }}>
        <p style={{ fontSize: '14px' }}>HackMoney 2026 • Days 1-7 Complete! 🎉</p>
        <p style={{ fontSize: '12px', marginTop: '10px' }}>
          Sui • ENS • Multi-Chain Bridge • Transaction History
        </p>
      </div>
    </div>
  )
}
