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

export interface CollectionConfig {
  title: string
  images: StaticImageData[]
  bridgeImage?: StaticImageData
  bridgeTitle1?: string
  bridgeSlogan1?: string
  bridgeTitle2?: string
  bridgeSlogan2?: string
  bridgeCTA?: string
  contractAddresses: Record<number, string> 
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
      43113: "0xb1a40746dc35d00ECE291895716D7f20Cb747f14", // Avalanche Fuji
      84532: "0xb1a40746dc35d00ECE291895716D7f20Cb747f14", // Base Sepolia
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
  },
  omninads: {
    title: "Omni Nads",
    images: [OmniNads1, OmniNads2, OmniNads3, OmniNads4],
    bridgeImage: OmniNads1,
    bridgeTitle1: "Join Omni Nads!",
    bridgeSlogan1: "Get your own Omni Nads NFT and join our exclusive community",
    bridgeTitle2: "Ready to Bridge Your Nads?",
    bridgeSlogan2: "Bridge your Omni Nads to another network with just a few clicks",
    bridgeCTA: "Buy Omni Nads",
    contractAddresses: {
      11155111: "0x949B0103aD1adcdFCeDAF112302100E61feaEcE4", // Sepolia Testnet
      10143: "0xf256b31E041A31a65841d0b50aD335A0d2Cd2324", // Monad Testnet
      11155420: "0xCb271Ec51465BD28484fe1C094C48aFe882265DB", // OP Testnet
      545: "0xA8321B2CD1d393A328024faDD07a0284F47ae321", // Flow EVM Testnet Minter
    },
    totalSupply: 1111,
    networks: [
      {
        id: 11155111,
        name: "Ethereum Sepolia",
        icon: ETH.src,
      },
      {
        id: 10143,
        name: "Monad Testnet",
        icon: MONAD1.src,
      },
      {
        id: 11155420,
        name: "OP Testnet",
        icon: OP.src,
      },
      {
        id: 545,
        name: "Flow EVM Testnet",
        icon: FLOW.src,
      },
    ],
    mintStages: [
      { name: "Early Access", status: "ENDED", limit: "1 PER WALLET", details: "Free Mint" },
    ],
    milestones: [
      { percentage: "5%", title: "Initial Launch: Omni Nads NFT drop on Ethereum Sepolia" },
      { percentage: "50%", title: "Cross-Chain Expansion: Nads available on multiple testnets" },
      { percentage: "100%", title: "Mainnet Release: Full feature launch with unique utilities" },
    ],
    teamMembers: [
      {
        name: "NadsAdmin",
        role: "Project Lead",
        image: "/assets/founder.jpg",
        twitter: "https://x.com/TomMarxCult",
      },
    ],
    about: "Omni Nads is a cross-chain NFT project designed to break boundaries and expand the NFT ecosystem across multiple testnets.",
    utility: "Owning an Omni Nads NFT unlocks access to exclusive events, airdrops, and future utilities on mainnet, ensuring a unique holder experience.",
    socials: {
      discord: "https://discord.com/invite/HjGGfMR7Ux",
      twitter: "https://twitter.com/cultbearsdao",
      website: "https://cultbearsdao.com",
    },
  },
}

export default collectionConfig