import { useAccount, useConnect, useDisconnect } from 'wagmi'
import Dashboard from './components/Dashboard'

export default function App() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  const handleConnect = () => {
    connect({ connector: connectors[0] })
  }

  // Show Dashboard if connected
  if (isConnected) {
    return <Dashboard />
  }

  // Show Connect Screen if not connected
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
