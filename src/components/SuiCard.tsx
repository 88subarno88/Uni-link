import { useCurrentAccount, useDisconnectWallet, useConnectWallet, useWallets } from '@mysten/dapp-kit'
import { useSuiBalance } from '../hooks/useSuiBalance'

export default function SuiCard() {
  const account = useCurrentAccount()
  const { mutate: disconnect } = useDisconnectWallet()
  const { mutate: connect } = useConnectWallet()
  const { balance, isLoading, refetch } = useSuiBalance()
  const wallets = useWallets()

  console.log('SuiCard Debug:', {
    hasAccount: !!account,
    accountAddress: account?.address,
    availableWallets: wallets.map(w => w.name),
    walletsCount: wallets.length
  })

  const handleConnect = () => {
    console.log('Connect button clicked!')
    console.log('Available wallets:', wallets.map(w => w.name))
    
    if (wallets.length === 0) {
      console.error('No Sui wallets detected!')
      alert('No Sui wallet detected. Please install Sui Wallet extension first.')
      return
    }

    connect(
      { wallet: wallets[0] },
      {
        onSuccess: () => {
          console.log('Wallet connected successfully!')
        },
        onError: (error) => {
          console.error('Connection error:', error)
          alert(`Connection failed: ${error.message}`)
        }
      }
    )
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '24px', color: '#333' }}>💧 Sui Network</h3>
        {account ? (
          <button
            onClick={() => {
              console.log('Disconnect clicked')
              disconnect()
            }}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Disconnect Sui
          </button>
        ) : (
          <button
            onClick={handleConnect}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Connect Sui Wallet
          </button>
        )}
      </div>

      <div style={{
        background: '#f0f0f0',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        marginBottom: '15px',
        fontFamily: 'monospace'
      }}>
        <div><strong>Debug:</strong></div>
        <div>Wallets found: {wallets.length}</div>
        <div>Wallets: {wallets.map(w => w.name).join(', ') || 'None'}</div>
        <div>Connected: {account ? 'Yes' : 'No'}</div>
      </div>

      {account ? (
        <>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#666', fontSize: '14px', margin: '0 0 5px 0' }}>Sui Address:</p>
            <p style={{ 
              fontFamily: 'monospace', 
              fontSize: '12px', 
              background: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '8px',
              margin: 0,
              wordBreak: 'break-all'
            }}>
              {account.address.slice(0, 20)}...{account.address.slice(-20)}
            </p>
          </div>

          <div>
            <p style={{ color: '#666', fontSize: '14px', margin: '0 0 5px 0' }}>Balance:</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#333' }}>
                {isLoading ? '...' : balance}
              </span>
              <span style={{ fontSize: '20px', color: '#666' }}>SUI</span>
              <button
                onClick={() => refetch()}
                style={{
                  background: '#f0f0f0',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  marginLeft: 'auto'
                }}
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          <p>Connect your Sui Wallet to see balance</p>
          {wallets.length === 0 && (
            <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '10px' }}>
              ⚠️ No Sui wallet detected. Install Sui Wallet extension.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
