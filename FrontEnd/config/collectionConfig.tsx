import CultBears31 from "@/public/assets/bears/cult-bear-31.png"
import CultBears9 from "@/public/assets/bears/cult-bear-9.png"
import CultBears28 from "@/public/assets/bears/cult-bear-28.png"
import CultBears57 from "@/public/assets/bears/cult-bear-57.png"
import CultBears42 from "@/public/assets/bears/cult-bear-42.png"
import OmniNads1 from "@/public/assets/nads/omni-nads-1.png"
import OmniNads2 from "@/public/assets/nads/omni-nads-2.png"
import OmniNads3 from "@/public/assets/nads/omni-nads-3.png"
import OmniNads4 from "@/public/assets/nads/omni-nads-4.png"

import OP from "@/public/assets/icons/op.svg"
import ETH from "@/public/assets/icons/eth.png"
import AVAX from "@/public/assets/icons/avalanche.webp"
import MONAD1 from "@/public/assets/icons/monad.jpeg"
import ARB from "@/public/assets/icons/arb.webp"
import FLOW from "@/public/assets/icons/flow.png"
import BASE from "@/public/assets/icons/base.png"

import { StaticImageData } from "next/image"

export interface Rarity {
  name: string
  color: string
  supply: number
  minted: number
}

export interface Network {
  id: number
  name: string
  icon: string
}

export interface Prices {
  [networkKey: string]: Record<string, { crypto: string; fiat: string }>
}

export interface Milestone {
  percentage: string
  title: string
}

export interface TeamMember {
  name: string
  role: string
  image: string
  twitter: string
}

export interface Socials {
  discord?: string
  twitter?: string
  website?: string
  telegram?: string
}

export interface MintStage {
  name: string
  status: "ENDED" | "LIVE" | "UPCOMING"
  price?: number
  limit?: string
  details?: string
}

export interface ContractType {
  minter?: string
  consumer?: string
  cultbears?: string
  messenger?: string;
}

export interface CollectionConfig {
  title: string
  images: StaticImageData[]
  bridgeImage?: StaticImageData
  bridgeTitle1?: string
  bridgeSlogan1?: string
  bridgeTitle2?: string
  bridgeSlogan2?: string
  bridgeCTA?: string
  contractAddresses: Record<number, ContractType> 
  totalSupply: number
  networks: Network[]
  rarities?: Rarity[]
  prices?: Prices
  mintStages?: MintStage[]
  milestones?: Milestone[]
  teamMembers?: TeamMember[]
  socials?: Socials
  about?: string
  utility?: string
  baseUri?: string
  baseUris?: Record<number, string>
}

const collectionConfig: Record<string, CollectionConfig> = {
  cultbears: {
    title: "Cult Bears DAO",
    images: [CultBears31, CultBears9, CultBears28, CultBears57],
    bridgeImage: CultBears42,
    bridgeTitle1: "Join the Cult Bears!",
    bridgeSlogan1: "Get your own Cult Bear NFT and join our exclusive community",
    bridgeTitle2: "Ready to Bridge Your Bear?",
    bridgeSlogan2: "Bridge your Cult Bear to another network with just a few clicks",
    bridgeCTA: "Buy a Cult Bear",
    contractAddresses: {
      43113: { cultbears: "0xb1a40746dc35d00ECE291895716D7f20Cb747f14"}, // Avalanche Fuji
      84532: { cultbears: "0xb1a40746dc35d00ECE291895716D7f20Cb747f14"}, // Base Sepolia
    },
    totalSupply: 2000,
    networks: [
      {
        id: 43113,
        name: "Avalanche Fuji",
        icon: AVAX.src,
      },
      {
        id: 84532,
        name: "Base Sepolia",
        icon: BASE.src,
      },
    ],
    rarities: [
      { name: "Common", color: "text-gray-400", supply: 1820, minted: 0 },
      { name: "Rare", color: "text-blue-400", supply: 100, minted: 0 },
      { name: "Ultra Rare", color: "text-purple-300", supply: 50, minted: 0 },
      { name: "Legendary", color: "text-yellow-400", supply: 26, minted: 0 },
      { name: "Mythic", color: "text-red-400", supply: 4, minted: 4 },
    ],
    prices: {
      base: {
        Common: { crypto: "0.013", fiat: "$45" },
        Rare: { crypto: "0.026", fiat: "$90" },
        "Ultra Rare": { crypto: "0.052", fiat: "$180" },
        Legendary: { crypto: "0.104", fiat: "$360" },
        Mythic: { crypto: "0.208", fiat: "$720" },
      },
      avalanche: {
        Common: { crypto: "1", fiat: "$45" },
        Rare: { crypto: "2", fiat: "$90" },
        "Ultra Rare": { crypto: "4", fiat: "$180" },
        Legendary: { crypto: "8", fiat: "$360" },
        Mythic: { crypto: "16", fiat: "$720" },
      },
    },
    mintStages: [
      { name: "OG", status: "ENDED", limit: "1 PER WALLET", details: "FREE Mint" },
      { name: "WL", status: "ENDED", limit: "3 PER WALLET", details: "35 USD" },
      {
        name: "Public",
        status: "LIVE",
        limit: "Unlimited PER WALLET",
        details: "45 USD",
      },
    ],
    milestones: [
      { percentage: "10%", title: "Community Launch: Cult Bears DAO launched, NFT collection minted on Moonbeam and Astar EVM" },
      { percentage: "25%", title: "XHONEY OFT Launch: Native token introduced with cross-chain support on 8 chains via LayerZero" },
      { percentage: "40%", title: "ONFT Migration: Enabled seamless cross-chain NFT compatibility through LayerZero" },
      { percentage: "60%", title: "NFT Marketplace Launch: Omnichain trading platform for ONFTs, OFTs, and AI Agents" },
      { percentage: "75%", title: "Cult Verse Development: P2E NFT card game design and mechanics in progress" },
      { percentage: "90%", title: "DAO Governance & Staking: Voting system and Cult Bear staking in final stages" },
      { percentage: "100%", title: "Cult Verse Game Launch: Complete P2E game release with ongoing ecosystem updates" },
    ],
    teamMembers: [
      {
        name: "TomMarxCult",
        role: "Founder",
        image: "/assets/founder.jpg",
        twitter: "https://x.com/TomMarxCult",
      },
    ],
    about: "Cult Bears DAO is the first omnichain NFT community, enabling cross-chain exploration and continuous innovation in web3. Our community-driven governance allows members to shape the future of the project.",
    utility: "Owning a Cult Bear NFT grants you exclusive access to the DAO, airdrops, and participation in Cult Verse—the upcoming P2E NFT card game with unique in-game advantages.",
    socials: {
      discord: "https://discord.com/invite/HjGGfMR7Ux",
      twitter: "https://twitter.com/cultbearsdao",
      website: "https://cultbearsdao.com",
    },
    baseUri: "https://arweave.net/yEZJbyNFfcsw-aweLmt8q6lXTJTMgiMLg_1JVM9QpDU/"
  },
  omninads: {
    title: "Omni Nads",
    images: [OmniNads1, OmniNads2, OmniNads3],
    bridgeImage: OmniNads1,
    bridgeTitle1: "Join Omni Nads!",
    bridgeSlogan1: "Get your own Omni Nads NFT and join our exclusive community",
    bridgeTitle2: "Ready to Bridge Your Nads?",
    bridgeSlogan2: "Bridge your Omni Nads to another network with just a few clicks",
    bridgeCTA: "Buy Omni Nads",
    contractAddresses: { 
      10143: { 
        minter: "0xf5a391D2409993f0FF7EF189ceEDB36643584dA2",
        messenger: "0x576ed1e774d1321a747471C19e59da0A149b6a44" 
      }, // Monad Testnet
      421614: { 
        consumer: "0xf44d59B1Eb6852FA9Cf4a7bC9a3211BADF0B66cf",
        messenger: "0x15047e9EC5Be03247411CD323360f8b13366431b" 
      }, // Arbitrum Testnet
      11155420: { 
        consumer: "0x882Cd279A5e3A97F51B4590A408F2eEA8082aF36",
        messenger: "0xF8Aa29d8319b21D9435e278c0074159AbB8AedE7" 
      }, // OP Testnet
    },
    totalSupply: 10000,
    networks: [
      {
        id: 10143,
        name: "Monad Testnet",
        icon: MONAD1.src,
      },
      {
        id: 421614,
        name: "Arbitrum Sepolia",
        icon: ARB.src,
      },
      {
        id: 11155420,
        name: "OP Testnet",
        icon: OP.src,
      },
    ],
    mintStages: [
      { name: "Early Access", status: "ENDED", limit: "1 PER WALLET", details: "Free Mint" },
      { name: "Public Mint", status: "LIVE", limit: "1 PER WALLET", details: "Free Mint" },
    ],
    milestones: [
      { percentage: "15%", title: "Initial Launch: Omni Nads NFT FREE Mint on Monad Testnet, Arbitrum and OPtimism Sepolia" },
      { percentage: "25%", title: "Testnet Campaigns: Collaborate with 10+ Monad native partners to launch campaigns and validate dynamic NFT evolution." },
      { percentage: "45%", title: "Feature Unlocks: Activate unique NFT transformations through on-chain quests, gameplay, and partner events." },
      { percentage: "75%", title: "Infrastructure Build-out: Develop an omnichain framework supporting dynamic evolution, extended leaderboards, and detailed metrics." },
      { percentage: "100%", title: "Mainnet Release: Full feature launch with unique utilities" },
    ],
    teamMembers: [
      {
        name: "Nads Lead",
        role: "Founder",
        image: "/assets/team/team-member-1.png" ,
        twitter: "https://x.com/TomMarxCult",
      },
      {
        name: "Nads Architect",
        role: "Smart Contract Engineer",
        image: "/assets/team/team-member-2.png" ,
        twitter: "https://x.com/onlyforweb3",
      },
    ],
    about: "Omni Nads is a cross-chain NFT project designed to break boundaries and expand the NFT ecosystem across multiple testnets.",
    utility: "Owning an Omni Nads NFT unlocks access to exclusive events, airdrops, and future utilities on mainnet, ensuring a unique holder experience.",
    socials: {
      discord: "https://discord.com/invite/HjGGfMR7Ux",
      twitter: "https://twitter.com/cultbearsdao",
      website: "https://cultbearsdao.com",
    },
    baseUris: {
      10143: "https://arweave.net/KTNUM70p_uS38bAUzrwmBFiMAIrXoiBQFzIGTRfDMu4/monad/",
      421614: "https://arweave.net/KTNUM70p_uS38bAUzrwmBFiMAIrXoiBQFzIGTRfDMu4/arbitrum/",
      11155420: "https://arweave.net/KTNUM70p_uS38bAUzrwmBFiMAIrXoiBQFzIGTRfDMu4/optimism/",
    },
  },
}

export default collectionConfig