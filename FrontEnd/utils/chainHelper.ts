import collectionConfig from "@/config/collectionConfig"


// 1. Chain ID constants
export const AVALANCHE_FUJI_ID = 43113
export const BASE_SEPOLIA_ID = 84532
export const POLYGON_AMOY_ID = 80002
export const OPTIMISM_SEPOLIA_ID = 11155420
export const ARBITRUM_SEPOLIA_ID = 421614
export const ETHEREUM_SEPOLIA_ID = 11155111
export const BINANCE_SMARTCHAIN_ID = 97
export const SONIC_TESTNET_ID = 57054
export const SONEIUM_MINATO_ID = 1946
export const MONAD_TESTNET_ID = 10143
export const FLOW_EVM_TESTNET_ID = 545

// 2. Explorers
interface ExplorersUrls {
  BASE_SEPOLIA: string
  AVALANCHE_FUJI: string
  POLYGON_AMOY: string
  OPTIMISM_SEPOLIA: string
  ARBITRUM_SEPOLIA: string
  ETHEREUM_SEPOLIA: string
  BINANCE_SMARTCHAIN: string
  SONIC_TESTNET: string
  SONEIUM_MINATO: string
  MONAD_TESTNET: string
  FLOW_EVM_TESTNET: string
}

export const explorers: ExplorersUrls = {
  BASE_SEPOLIA: "https://sepolia.basescan.org/",
  AVALANCHE_FUJI: "https://testnet.snowtrace.io/",
  POLYGON_AMOY: "https://amoy.polygonscan.com/",
  OPTIMISM_SEPOLIA: "https://sepolia-optimism.etherscan.io/",
  ARBITRUM_SEPOLIA: "https://sepolia.arbiscan.io/",
  ETHEREUM_SEPOLIA: "https://sepolia.etherscan.io/",
  BINANCE_SMARTCHAIN: "https://testnet.bscscan.com/",
  SONIC_TESTNET: "https://testnet.sonicscan.org/",
  SONEIUM_MINATO: "https://1946.testnet.routescan.io/",
  MONAD_TESTNET: "https://testnet.monadexplorer.com/",
  FLOW_EVM_TESTNET: "https://evm-testnet.flowscan.io/"
}

export const LZ_EXPLORER_URL = "https://testnet.layerzeroscan.com/"

// 3. getExplorerUrl by chainId
export function getExplorerUrl(chainId: number): string {
  if (chainId === AVALANCHE_FUJI_ID) {
    return explorers.AVALANCHE_FUJI
  } else if (chainId === BASE_SEPOLIA_ID) {
    return explorers.BASE_SEPOLIA
  } else if (chainId === POLYGON_AMOY_ID) {
    return explorers.POLYGON_AMOY
  } else if (chainId === OPTIMISM_SEPOLIA_ID) {
    return explorers.OPTIMISM_SEPOLIA
  } else if (chainId === ARBITRUM_SEPOLIA_ID) {
    return explorers.ARBITRUM_SEPOLIA
  } else if (chainId === ETHEREUM_SEPOLIA_ID) {
    return explorers.ETHEREUM_SEPOLIA
  } else if (chainId === BINANCE_SMARTCHAIN_ID) {
    return explorers.BINANCE_SMARTCHAIN
  } else if (chainId === SONIC_TESTNET_ID) {
    return explorers.SONIC_TESTNET
  } else if (chainId === SONEIUM_MINATO_ID) {
    return explorers.SONEIUM_MINATO
  } else if (chainId === MONAD_TESTNET_ID) {
    return explorers.MONAD_TESTNET
  } else if (chainId === FLOW_EVM_TESTNET_ID) {
    return explorers.FLOW_EVM_TESTNET
  }

  // fallback if none matched
  return explorers.BASE_SEPOLIA
}

// 4. getSubgraphUrl by chainId (optional fallback)
export function getSubgraphUrl(chainId: number): string {
  if (chainId === AVALANCHE_FUJI_ID) {
    return process.env.NEXT_PUBLIC_SUBGRAPH_URL_AVALANCHE_FUJI ?? ""
  } else if (chainId === BASE_SEPOLIA_ID) {
    return process.env.NEXT_PUBLIC_SUBGRAPH_URL_BASE_SEPOLIA ?? ""
  } else if (chainId === POLYGON_AMOY_ID) {
    return process.env.NEXT_PUBLIC_SUBGRAPH_URL_POLYGON_AMOY ?? ""
  } else if (chainId === OPTIMISM_SEPOLIA_ID) {
    return process.env.NEXT_PUBLIC_SUBGRAPH_URL_OPTIMISM_SEPOLIA ?? ""
  } else if (chainId === ARBITRUM_SEPOLIA_ID) {
    return process.env.NEXT_PUBLIC_SUBGRAPH_URL_ARBITRUM_SEPOLIA ?? ""
  } else if (chainId === ETHEREUM_SEPOLIA_ID) {
    return process.env.NEXT_PUBLIC_SUBGRAPH_URL_ETHEREUM_SEPOLIA ?? ""
  } else if (chainId === BINANCE_SMARTCHAIN_ID) {
    return process.env.NEXT_PUBLIC_SUBGRAPH_URL_BINANCE_SMARTCHAIN ?? ""
  } else if (chainId === SONIC_TESTNET_ID) {
    return process.env.NEXT_PUBLIC_SUBGRAPH_URL_SONIC_BLAZE ?? ""
  } else if (chainId === SONEIUM_MINATO_ID) {
    return process.env.NEXT_PUBLIC_SUBGRAPH_URL_SONEIUM_MINATO ?? ""
  }

  // fallback
  return process.env.NEXT_PUBLIC_SUBGRAPH_URL_BASE_SEPOLIA ?? ""
}

export function getCollectionContractAddress(
  collectionName: string,
  chainId: number
): string | undefined {
  // 1. Find that collection
  const key = collectionName.toLowerCase()
  const config = collectionConfig[key]
  if (!config) {
    console.warn(`Collection config not found for: ${collectionName}`)
    return undefined
  }

  // 2. Return address for given chainId
  return config.contractAddresses[chainId]
}