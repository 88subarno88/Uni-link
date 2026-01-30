import { useENS } from '../hooks/useENS'

interface ENSNameProps {
  address: string | undefined
  showFull?: boolean
  style?: React.CSSProperties
}

export default function ENSName({ address, showFull = false, style }: ENSNameProps) {
  const { ensName, isLoading } = useENS(address)

  if (!address) return null

  // Demo mode: Show what ENS would look like
  const isDemoAddress = address.toLowerCase() === '0x80c6f0d107695d3e9010133ecdad420ff0c78529'
  const demoName = isDemoAddress ? 'demo.eth' : null

  if (isLoading) {
    return (
      <span style={{ opacity: 0.6, ...style }}>
        Loading...
      </span>
    )
  }

  // Show ENS name if found (or demo name)
  const displayName = ensName || demoName
  
  if (displayName) {
    return (
      <span style={{ ...style }} title={address}>
        🏷️ {displayName}
      </span>
    )
  }

  // Fallback to shortened address
  const displayAddress = showFull 
    ? address 
    : `${address.slice(0, 6)}...${address.slice(-4)}`

  return (
    <span style={{ fontFamily: 'monospace', ...style }} title={address}>
      {displayAddress}
    </span>
  )
}
