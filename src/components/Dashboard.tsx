import { useMultiChainBalance } from '../hooks/useMultiChainBalance'
import { useAccount, useDisconnect } from 'wagmi'

export default function Dashboard() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const balances = useMultiChainBalance()

  const chains = [
    { name: 'Sepolia', emoji: '🔷', color: '#627EEA', data: balances.ethereum },
    { name: 'Polygon Amoy', emoji: '🟣', color: '#8247E5', data: balances.polygon },
    { name: 'Arbitrum Sepolia', emoji: '🔵', color: '#28A0F0', data: balances.arbitrum },
    { name: 'Base Sepolia', emoji: '🔷', color: '#0052FF', data: balances.base },
  ]

  const totalValue = chains.reduce((sum, chain) => {
    if (chain.data.data) {
      const value = parseFloat(chain.data.data.formatted)
      return sum + (isNaN(value) ? 0 : value)
    }
    return sum
  }, 0)

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        
        {/* Header */}
        <div style={{background: 'white', borderRadius: '20px', padding: '30px', marginBottom: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'}}>
            <div>
              <h1 style={{fontSize: '2.5em', marginBottom: '10px'}}>🌉 Uni-Chain</h1>
              <p style={{color: '#666', fontSize: '14px', wordBreak: 'break-all'}}>
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
            <button 
              onClick={() => disconnect()}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Disconnect
            </button>
          </div>
        </div>

        {/* Total Portfolio */}
        <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px', padding: '40px', marginBottom: '30px', color: 'white', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.2)'}}>
          <p style={{fontSize: '16px', opacity: 0.9, marginBottom: '10px'}}>Total Portfolio Value</p>
          <h2 style={{fontSize: '3.5em', fontWeight: 'bold'}}>{totalValue.toFixed(4)} ETH</h2>
          <p style={{fontSize: '14px', opacity: 0.8, marginTop: '10px'}}>Across 4 testnets</p>
        </div>

        {/* Chain Balances Grid */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px'}}>
          {chains.map((chain) => (
            <div 
              key={chain.name}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
                <div style={{fontSize: '2.5em', marginRight: '15px'}}>{chain.emoji}</div>
                <div>
                  <h3 style={{fontSize: '1.4em', margin: 0, color: chain.color}}>{chain.name}</h3>
                  <p style={{fontSize: '12px', color: '#999', margin: 0}}>Testnet</p>
                </div>
              </div>

              {chain.data.isLoading ? (
                <div style={{textAlign: 'center', padding: '20px', color: '#999'}}>
                  <p>Loading...</p>
                </div>
              ) : chain.data.data ? (
                <>
                  <div style={{marginBottom: '15px'}}>
                    <p style={{fontSize: '12px', color: '#999', marginBottom: '5px'}}>Balance</p>
                    <p style={{fontSize: '1.8em', fontWeight: 'bold', color: '#333'}}>
                      {parseFloat(chain.data.data.formatted || '0').toFixed(4)}
                    </p>
                    <p style={{fontSize: '14px', color: '#666'}}>
                      {chain.data.data.symbol}
                    </p>
                  </div>
                  
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: '8px',
                    padding: '10px',
                    textAlign: 'center'
                  }}>
                    <p style={{fontSize: '12px', color: '#15803d', margin: 0}}>
                      ✅ Connected
                    </p>
                  </div>
                </>
              ) : (
                <div style={{textAlign: 'center', padding: '20px'}}>
                  <p style={{color: '#999', fontSize: '14px'}}>0.0000 ETH</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{background: 'white', borderRadius: '20px', padding: '30px', marginTop: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)'}}>
          <h3 style={{marginBottom: '20px', fontSize: '1.5em'}}>⚡ Quick Actions</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
            <button style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              🌉 Bridge Assets
            </button>
            <button style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              border: 'none',
              padding: '20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              🔄 Swap Tokens
            </button>
            <button style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              border: 'none',
              padding: '20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              📜 History
            </button>
          </div>
        </div>

        <div style={{textAlign: 'center', marginTop: '40px', color: 'white', fontSize: '14px', opacity: 0.8}}>
          <p>HackMoney 2026 • Day 2 Complete! 🎉</p>
          <p style={{marginTop: '5px'}}>Yellow • Sui • Circle • Uniswap • LI.FI • ENS</p>
        </div>
      </div>
    </div>
  )
}
