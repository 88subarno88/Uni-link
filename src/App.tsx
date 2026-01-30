import { useState } from 'react'
import { useAccount, useConnect } from 'wagmi'
import Dashboard from './components/Dashboard'
import BridgeInterface from './components/bridge/BridgeInterface'

export default function App() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bridge'>('dashboard')

  const handleConnect = () => {
    connect({ connector: connectors[0] })
  }

  if (!isConnected) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div style={{background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '500px', width: '100%'}}>
          <div style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '3em', marginBottom: '10px'}}>🌉 Uni-Chain</h1>
            <p style={{color: '#666'}}>Universal Cross-Chain DeFi Hub</p>
          </div>

          <div style={{background: 'linear-gradient(to right, #9333ea, #ec4899)', borderRadius: '15px', padding: '20px', color: 'white', marginBottom: '30px'}}>
            <h3 style={{marginBottom: '10px'}}>🎯 HackMoney 2026</h3>
            <p style={{fontSize: '14px', opacity: 0.9, margin: 0}}>
              Bridge assets across EVM chains and Sui seamlessly
            </p>
          </div>

          <button 
            onClick={handleConnect}
            style={{
              background: 'linear-gradient(to right, #9333ea, #ec4899)', 
              color: 'white', 
              border: 'none', 
              padding: '18px 30px', 
              borderRadius: '12px', 
              fontSize: '18px', 
              cursor: 'pointer', 
              width: '100%',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(147, 51, 234, 0.4)'
            }}
          >
            🔗 Connect Wallet
          </button>

          <div style={{marginTop: '30px', textAlign: 'center', fontSize: '12px', color: '#999'}}>
            <p>Supported: MetaMask, Coinbase Wallet, WalletConnect</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '10px',
          marginBottom: '30px',
          display: 'flex',
          gap: '10px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
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
              background: activeTab === 'dashboard' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : 'transparent',
              color: activeTab === 'dashboard' ? 'white' : '#666',
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
              background: activeTab === 'bridge' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : 'transparent',
              color: activeTab === 'bridge' ? 'white' : '#666',
              transition: 'all 0.2s'
            }}
          >
            🌉 Bridge
          </button>
        </div>

        {activeTab === 'dashboard' ? <Dashboard /> : <BridgeInterface />}

        <div style={{textAlign: 'center', marginTop: '40px', color: 'white', fontSize: '14px', opacity: 0.8}}>
          <p>HackMoney 2026 • Day 4 Complete! 🎉</p>
          <p style={{marginTop: '5px'}}>Yellow • Sui • Circle • Uniswap • LI.FI • ENS</p>
        </div>
      </div>
    </div>
  )
}
