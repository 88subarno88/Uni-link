import { useEffect, useState } from 'react'

interface TransactionStatusProps {
  hash: string
  status: 'pending' | 'success' | 'failed'
  fromChain: string
  toChain: string
  amount: string
  explorerUrl?: string
  onClose: () => void
}

export default function TransactionStatus({
  hash,
  status,
  fromChain,
  toChain,
  amount,
  explorerUrl,
  onClose
}: TransactionStatusProps) {
  const [dots, setDots] = useState('.')

  useEffect(() => {
    if (status === 'pending') {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '.' : prev + '.')
      }, 500)
      return () => clearInterval(interval)
    }
  }, [status])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center' }}>
          {status === 'pending' && (
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
          )}
          {status === 'success' && (
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
          )}
          {status === 'failed' && (
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>❌</div>
          )}

          <h2 style={{ margin: '0 0 20px 0', fontSize: '24px' }}>
            {status === 'pending' && `Bridging${dots}`}
            {status === 'success' && 'Bridge Successful!'}
            {status === 'failed' && 'Bridge Failed'}
          </h2>

          <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>From</div>
              <div style={{ fontWeight: 'bold' }}>{fromChain}</div>
            </div>
            <div style={{ fontSize: '24px', margin: '10px 0' }}>↓</div>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>To</div>
              <div style={{ fontWeight: 'bold' }}>{toChain}</div>
            </div>
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '15px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Amount</div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{amount} ETH</div>
            </div>
          </div>

          {hash && (
            <div style={{ marginBottom: '20px', fontSize: '14px' }}>
              <div style={{ color: '#6b7280', marginBottom: '5px' }}>Transaction Hash</div>
              <div style={{ fontFamily: 'monospace', background: '#f3f4f6', padding: '8px', borderRadius: '8px' }}>
                {hash.slice(0, 10)}...{hash.slice(-8)}
              </div>
            </div>
          )}

          {status === 'pending' && (
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              ⚡ Transaction is being processed. This usually takes about 30 seconds.
            </p>
          )}
          {status === 'success' && (
            <p style={{ color: '#059669', fontSize: '14px' }}>
              🎉 Your funds will arrive on {toChain} shortly!
            </p>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {explorerUrl && (
              <button
                onClick={() => window.open(explorerUrl, '_blank')}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                View on Explorer
              </button>
            )}
            {status !== 'pending' && (
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
