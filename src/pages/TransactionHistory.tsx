import { useState, useEffect } from 'react'
import { BridgeService } from '../services/bridgeService'

interface Transaction {
  hash: string
  fromChain: number
  toChain: number
  amount: string
  timestamp: number
  status: string
  address: string
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all')

  useEffect(() => {
    const history = BridgeService.getHistory()
    setTransactions(history)
  }, [])

  const chainNames: { [key: number]: string } = {
    11155111: 'Sepolia',
    80002: 'Polygon Amoy',
    421614: 'Arbitrum Sepolia'
  }

  const chainEmojis: { [key: number]: string } = {
    11155111: '🔷',
    80002: '🟣',
    421614: '🔵'
  }

  const chainExplorers: { [key: number]: string } = {
    11155111: 'https://sepolia.etherscan.io',
    80002: 'https://amoy.polygonscan.com',
    421614: 'https://sepolia.arbiscan.io'
  }

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true
    return tx.status === filter
  })

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all transaction history?')) {
      BridgeService.clearHistory()
      setTransactions([])
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatAmount = (amount: string) => {
    return parseFloat(amount).toFixed(4)
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '20px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '32px', marginBottom: '10px' }}>
              📜 Transaction History
            </h1>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              {transactions.length} total transactions
            </p>
          </div>
          
          {transactions.length > 0 && (
            <button
              onClick={handleClearHistory}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              🗑️ Clear History
            </button>
          )}
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '20px 30px',
        marginBottom: '20px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '10px'
      }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            background: filter === 'all' ? '#667eea' : '#f3f4f6',
            color: filter === 'all' ? 'white' : '#666'
          }}
        >
          All ({transactions.length})
        </button>
        <button
          onClick={() => setFilter('success')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            background: filter === 'success' ? '#10b981' : '#f3f4f6',
            color: filter === 'success' ? 'white' : '#666'
          }}
        >
          Success ({transactions.filter(tx => tx.status === 'success').length})
        </button>
        <button
          onClick={() => setFilter('failed')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            background: filter === 'failed' ? '#ef4444' : '#f3f4f6',
            color: filter === 'failed' ? 'white' : '#666'
          }}
        >
          Failed ({transactions.filter(tx => tx.status === 'failed').length})
        </button>
      </div>

      {filteredTransactions.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '60px 30px',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📭</div>
          <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>No Transactions Yet</h2>
          <p style={{ margin: 0, color: '#666' }}>
            {filter === 'all' 
              ? 'Your bridge transactions will appear here'
              : `No ${filter} transactions found`
            }
          </p>
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '15px', textAlign: 'left', color: '#666', fontWeight: 'bold', fontSize: '14px' }}>Date</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#666', fontWeight: 'bold', fontSize: '14px' }}>Route</th>
                <th style={{ padding: '15px', textAlign: 'right', color: '#666', fontWeight: 'bold', fontSize: '14px' }}>Amount</th>
                <th style={{ padding: '15px', textAlign: 'center', color: '#666', fontWeight: 'bold', fontSize: '14px' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'center', color: '#666', fontWeight: 'bold', fontSize: '14px' }}>Transaction</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, index) => (
                <tr 
                  key={index}
                  style={{ 
                    borderBottom: '1px solid #f3f4f6',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '15px' }}>
                    <div style={{ fontSize: '14px', color: '#333' }}>
                      {formatDate(tx.timestamp)}
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span>{chainEmojis[tx.fromChain]} {chainNames[tx.fromChain]}</span>
                      <span style={{ color: '#667eea' }}>→</span>
                      <span>{chainEmojis[tx.toChain]} {chainNames[tx.toChain]}</span>
                    </div>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                      {formatAmount(tx.amount)} ETH
                    </div>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      background: tx.status === 'success' ? '#d1fae5' : '#fee2e2',
                      color: tx.status === 'success' ? '#059669' : '#dc2626'
                    }}>
                      {tx.status === 'success' ? '✅ Success' : '❌ Failed'}
                    </span>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <button
                      onClick={() => window.open(`${chainExplorers[tx.fromChain]}/tx/${tx.hash}`, '_blank')}
                      style={{
                        color: '#667eea',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        textDecoration: 'underline'
                      }}
                    >
                      View on Explorer →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
