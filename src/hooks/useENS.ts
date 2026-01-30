import { useEffect, useState } from 'react'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

// Create a mainnet client for ENS lookups
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://eth-mainnet.g.alchemy.com/v2/demo')
})

/**
 * Hook to resolve ENS names from Ethereum addresses
 * @param address - Ethereum address to resolve
 * @returns ENS name if found, null otherwise
 */
export function useENS(address: string | undefined) {
  const [ensName, setEnsName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!address) {
      setEnsName(null)
      return
    }

    // Don't lookup if address is invalid
    if (!address.startsWith('0x') || address.length !== 42) {
      setEnsName(null)
      return
    }

    setIsLoading(true)

    // Lookup ENS name for address
    publicClient
      .getEnsName({
        address: address as `0x${string}`
      })
      .then((name) => {
        setEnsName(name)
        setIsLoading(false)
      })
      .catch((error) => {
        console.warn('ENS lookup failed:', error)
        setEnsName(null)
        setIsLoading(false)
      })
  }, [address])

  return { ensName, isLoading }
}

/**
 * Hook to resolve Ethereum address from ENS name
 * @param ensName - ENS name to resolve
 * @returns Ethereum address if found, null otherwise
 */
export function useENSAddress(ensName: string | undefined) {
  const [address, setAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!ensName || !ensName.includes('.')) {
      setAddress(null)
      return
    }

    setIsLoading(true)

    // Lookup address for ENS name
    publicClient
      .getEnsAddress({
        name: ensName
      })
      .then((addr) => {
        setAddress(addr)
        setIsLoading(false)
      })
      .catch((error) => {
        console.warn('ENS address lookup failed:', error)
        setAddress(null)
        setIsLoading(false)
      })
  }, [ensName])

  return { address, isLoading }
}

/**
 * Utility function to format address with ENS name
 * @param address - Ethereum address
 * @param ensName - ENS name (optional)
 * @returns Formatted string
 */
export function formatAddressWithENS(
  address: string | undefined,
  ensName: string | null
): string {
  if (!address) return ''
  
  if (ensName) {
    return ensName
  }
  
  // Fallback to shortened address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
