export default function BridgeWarning() {
  return (
    <div style={{
      background: '#fef3c7',
      border: '2px solid #f59e0b',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '30px',
      maxWidth: '600px',
      margin: '0 auto 30px auto'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: '12px' 
      }}>
        <span style={{ fontSize: '28px', flexShrink: 0 }}>⚠️</span>
        <div>
          <h4 style={{ 
            margin: '0 0 10px 0', 
            color: '#92400e',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            Demo Mode - Testnet Simulation
          </h4>
          <p style={{ 
            margin: '0 0 8px 0', 
            fontSize: '14px', 
            color: '#78350f',
            lineHeight: '1.5'
          }}>
            This bridge demonstrates the user experience and transaction flow. 
            Currently, transactions are executed on the source chain only.
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: '13px', 
            color: '#78350f',
            fontStyle: 'italic',
            lineHeight: '1.4'
          }}>
            <strong>For HackMoney demo:</strong> Your Sepolia balance will decrease, 
            but assets won't appear on the destination chain. Real cross-chain 
            bridging requires deployed bridge contracts (LayerZero/Axelar) on both chains.
          </p>
        </div>
      </div>
    </div>
  )
}
