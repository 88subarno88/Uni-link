import SuiCard from './SuiCard'
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
  ]

  const totalValue = chains.reduce((sum, chain) => {
    if (chain.data.data) {
      const value = parseFloat(chain.data.data.formatted)
      return sum + (isNaN(value) ? 0 : value)
    }
    return sum
  }, 0)

  const handleRefresh = () => {
    balances.ethereum.refetch()
    balances.polygon.refetch()
    balances.arbitrum.refetch()
  }

  return (
    <div>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '20px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ fontSize: '40px' }}>🌉</div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>Uni-Chain</h1>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleRefresh}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔄 Refresh
          </button>
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

      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '30px',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '16px', opacity: 0.9, marginBottom: '10px' }}>Total Portfolio Value</div>
        <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '5px' }}>
          {totalValue.toFixed(4)} ETH
        </div>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>Across 3 testnets</div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {chains.map((chain) => (
          <div
            key={chain.name}
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              border: `3px solid ${chain.color}`
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>{chain.emoji}</div>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#333' }}>{chain.name}</h3>
            
            {chain.data.isLoading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                Loading...
              </div>
            ) : chain.data.isError ? (
              <div>
                <div style={{
                  padding: '15px',
                  background: '#fee2e2',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#991b1b' }}>
                    ⚠️ Error loading
                  </div>
                  <div style={{ fontSize: '12px', color: '#991b1b' }}>
                    RPC issue - Click refresh
                  </div>
                </div>
                <div style={{
                  padding: '10px',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Showing</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#374151' }}>0.0000 ETH</div>
                </div>
              </div>
            ) : chain.data.data ? (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Balance</div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: chain.color }}>
                    {parseFloat(chain.data.data.formatted || '0').toFixed(4)}
                  </div>
                  <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                    {chain.data.data.symbol}
                  </div>
                </div>
                <div style={{
                  background: '#ecfdf5',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: '#059669',
                  fontWeight: 'bold'
                }}>
                  ✅ Connected
                </div>
              </>
            ) : (
              <div style={{ padding: '15px', background: '#f3f4f6', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#6b7280' }}>0.0000 ETH</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sui Card - New Addition! */}
      <div style={{ marginTop: '20px' }}>
        <SuiCard />
      </div>
    </div>
  )
}
