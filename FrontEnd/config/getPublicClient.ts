import { ChainNames } from "@/utils/chainUtils";
import { createPublicClient, defineChain, http } from "viem";
import { 
  avalancheFuji, 
  baseSepolia, 
  soneiumMinato, 
  seiTestnet, 
  sepolia, 
  arbitrumSepolia, 
  optimismSepolia, 
  polygonAmoy, 
  bscTestnet,
  monadTestnet,
  flowTestnet
} from "viem/chains";

// @ts-ignore
export const sonicTestnet = defineChain({
  id: 57054,
  name: 'Sonic Testnet',
  network: 'fantom-sonic-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Sonic',
    symbol: 'S',
  },
  rpcUrls: {
    default: { http: ['https://rpc.blaze.soniclabs.com'] },
  },
  blockExplorers: {
    default: {
      name: 'Sonic Testnet Explorer',
      url: 'https://blaze.soniclabs.com',
    },
  },
  testnet: true,
})

 const avalancheFujiClient = createPublicClient({
    chain: avalancheFuji,
    transport: http(
      "https://avalanche-fuji.infura.io/v3/67364b5ce8b7483eaff610fe051d6b7b"
    ),
  });

  const baseSepoliaClient = createPublicClient({
    chain: baseSepolia,
    transport: http(
      "https://base-sepolia.g.alchemy.com/v2/RE3z6CzeXNZk0Y-V3YjF3hrgvUNWqfZy"
    ),
  });

  const soneiumMinatoClient = createPublicClient({
    chain: soneiumMinato,
    transport: http(
      "https://soneium-minato.g.alchemy.com/v2/RE3z6CzeXNZk0Y-V3YjF3hrgvUNWqfZy"
    ),
  });

  const seiTestnetClient = createPublicClient({
    chain: seiTestnet,
    transport: http(
        "https://rpc.ankr.com/sei/5894f4c6c74883f53075cc050d4d88aab8a8b3f7df7102d04c35033fafa99224"
    ),
  });

  const sonicTestnetClient = createPublicClient({
    chain: sonicTestnet,
    transport: http(
        "https://rpc.blaze.soniclabs.com"
    ),
  });

  const sepoliaTestnetClient = createPublicClient({
    chain: sepolia,
    transport: http(
        "https://eth-sepolia.g.alchemy.com/v2/RE3z6CzeXNZk0Y-V3YjF3hrgvUNWqfZy"
    ),
  });

  const arbitrumTestnetClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(
        "https://arb-sepolia.g.alchemy.com/v2/RE3z6CzeXNZk0Y-V3YjF3hrgvUNWqfZy"
    ),
  });

  const optimismTestnetClient = createPublicClient({
    chain: optimismSepolia,
    transport: http(
        "https://opt-sepolia.g.alchemy.com/v2/RE3z6CzeXNZk0Y-V3YjF3hrgvUNWqfZy"
    ),
  });

  const polygonTestnetClient = createPublicClient({
    chain: polygonAmoy,
    transport: http(
        "https://polygon-amoy.g.alchemy.com/v2/RE3z6CzeXNZk0Y-V3YjF3hrgvUNWqfZy"
    ),
  });

  const bscTestnetClient = createPublicClient({
    chain: bscTestnet,
    transport: http(
        "https://rpc.ankr.com/bsc_testnet_chapel/5894f4c6c74883f53075cc050d4d88aab8a8b3f7df7102d04c35033fafa99224"
    ),
  });

  const monadTestnetClient = createPublicClient({
    chain: monadTestnet,
    transport: http(
        "https://smart-magical-sanctuary.monad-testnet.quiknode.pro/1874760689d37a786b25fa10e3902471876f1d9e"
    ),
  });

  const flowTestnetClient = createPublicClient({
    chain: flowTestnet,
    transport: http(
        "https://flow-testnet.g.alchemy.com/v2/RE3z6CzeXNZk0Y-V3YjF3hrgvUNWqfZy"
    ),
  });

  const publicClients: Record<ChainNames, any> = {
    "Avalanche Fuji": avalancheFujiClient,
    "Base Sepolia": baseSepoliaClient,
    "Soneium Minato": soneiumMinatoClient,
    "Sei Testnet": seiTestnetClient,
    "Sonic Testnet": sonicTestnetClient,
    "Sepolia": sepoliaTestnetClient,
    "Arbitrum Sepolia": arbitrumTestnetClient,
    "OP Sepolia": optimismTestnetClient,
    "Polygon Amoy": polygonTestnetClient,
    "Binance Smart Chain Testnet": bscTestnetClient,
    "Monad Testnet": monadTestnetClient,
    "Flow EVM Testnet": flowTestnetClient,
  };

  export const getPublicClient = (chainName: ChainNames) => {
    const client = publicClients[chainName];
    if (!client) {
      throw new Error(`Unknown chain name: ${chainName}`);
    }
    return client;
  };