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

export default function TransactionStatus(props: TransactionStatusProps) {
  const { hash, status, fromChain, toChain, amount, explorerUrl, onClose } = props
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
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
          {status === 'pending' && (
            <div style={{
              width: '80px',
              height: '80px',
              border: '8px solid #f3f4f6',
              borderTop: '8px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
          )}
          {status === 'success' && (
            <div style={{fontSize: '80px'}}>✅</div>
          )}
          {status === 'failed' && (
            <div style={{fontSize: '80px'}}>❌</div>
          )}
        </div>

        <h2 style={{
          fontSize: '1.8em',
          textAlign: 'center',
          marginBottom: '20px',
          color: '#333'
        }}>
          {status === 'pending' && `Bridging${dots}`}
          {status === 'success' && 'Bridge Successful!'}
          {status === 'failed' && 'Bridge Failed'}
        </h2>

        <div style={{
          background: '#f9fafb',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{marginBottom: '15px'}}>
            <div style={{fontSize: '12px', color: '#666', marginBottom: '5px'}}>From</div>
            <div style={{fontSize: '16px', fontWeight: 'bold', color: '#333'}}>{fromChain}</div>
          </div>
          <div style={{textAlign: 'center', margin: '10px 0', fontSize: '24px'}}>↓</div>
          <div style={{marginBottom: '15px'}}>
            <div style={{fontSize: '12px', color: '#666', marginBottom: '5px'}}>To</div>
            <div style={{fontSize: '16px', fontWeight: 'bold', color: '#333'}}>{toChain}</div>
          </div>
          <div style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '15px',
            marginTop: '15px'
          }}>
            <div style={{fontSize: '12px', color: '#666', marginBottom: '5px'}}>Amount</div>
            <div style={{fontSize: '20px', fontWeight: 'bold', color: '#667eea'}}>{amount} ETH</div>
          </div>
        </div>

        {hash && (
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            wordBreak: 'break-all'
          }}>
            <div style={{fontSize: '12px', color: '#1e40af', marginBottom: '5px'}}>Transaction Hash</div>
            <div style={{fontSize: '12px', fontFamily: 'monospace', color: '#1e3a8a'}}>
              {hash.slice(0, 10)}...{hash.slice(-8)}
            </div>
          </div>
        )}

        {status === 'pending' && (
          <div style={{
            background: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p style={{fontSize: '14px', color: '#92400e', margin: 0}}>
              ⚡ Transaction is being processed. This usually takes about 30 seconds.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p style={{fontSize: '14px', color: '#15803d', margin: 0}}>
              🎉 Your funds will arrive on {toChain} shortly!
            </p>
          </div>
        )}

        <div style={{display: 'flex', gap: '10px'}}>
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
                background: status === 'success' ? '#10b981' : '#ef4444',
                color: 'white',
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

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}
