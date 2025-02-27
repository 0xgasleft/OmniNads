


import CultBears31 from "@/public/assets/bears/cult-bear-31.png";
import CultBears9 from "@/public/assets/bears/cult-bear-9.png";
import CultBears28 from "@/public/assets/bears/cult-bear-28.png";
import CultBears57 from "@/public/assets/bears/cult-bear-57.png";
import OmniNads1 from "@/public/assets/nads/omni-nads-1.png";
import OmniNads2 from "@/public/assets/nads/omni-nads-2.png";
import OmniNads3 from "@/public/assets/nads/omni-nads-3.png";
import OmniNads4 from "@/public/assets/nads/omni-nads-4.png";
import OP from "../public/assets/icons/op.svg"
import ETH from "../public/assets/icons/eth.png"
import AVAX from "../public/assets/icons/avalanche.webp"
import MONAD from "../public/assets/icons/monad.png"
import MONAD1 from "../public/assets/icons/monad.jpeg"
import MONAD2 from "../public/assets/icons/monad2.svg"
import MONAD3 from "../public/assets/icons/monad3.png"
import ARB from "../public/assets/icons/arb.webp"
import BASE from "../public/assets/icons/base.png"
import { StaticImageData } from "next/image";

export interface Rarity {
  name: string;
  color: string;
  supply: number;
  minted: number;
}

export interface Network {
    id: number;
    name: string;
    icon: string;
}

export interface Prices {
    monad?: Record<string, { crypto: string; fiat: string }>;
    base?: Record<string, { crypto: string; fiat: string }>;
    avalanche?: Record<string, { crypto: string; fiat: string }>;
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
  discord?: string;
  twitter?: string;
  website?: string;
  telegram?: string;
}

export interface CollectionConfig {
    title: string;
    images: StaticImageData[];
    bridgeImage?: StaticImageData;
    rarities?: Rarity[];
    contractAddress: string;
    networks: Network[];
    prices?: Prices;
    totalSupply: number;
    mintStages: MintStage[];
    milestones: Milestone[];
    teamMembers: TeamMember[];
    socials: Socials;
    about: string;
    utility: string;
}

export interface MintStage {
  name: string;
  status: "ENDED" | "LIVE" | "UPCOMING";
  price?: number;
  limit?: string;
  details?: string;
}

const collectionConfig: Record<string, CollectionConfig> = {
  omninads: {
    title: "Omni Nads",
    images: [OmniNads1, OmniNads2, OmniNads3, OmniNads4],
    bridgeImage: OmniNads2,
    contractAddress: "0xb1a40746dc35d00ECE291895716D7f20Cb747f14",
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
         id: 421614,
         name: "Arbitrum Testnet",
         icon: ARB.src,
        },
      ], 
      mintStages: [
        { name: "Early Access", status: "ENDED", limit: "1 PER WALLET", details: "Free Mint" },
        { name: "Public", status: "LIVE", limit: "Unlimited", details: "Mint Price: 0.05 ETH" },
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
    socials: {
      discord: "https://discord.com/invite/HjGGfMR7Ux",
      twitter: "",
      website: "",
    },
    about:
    "Omni Nads is a cross-chain NFT project designed to break boundaries and expand the NFT ecosystem across multiple testnets.",
    utility:
    "Owning an Omni Nads NFT unlocks access to exclusive events, airdrops, and future utilities on mainnet, ensuring a unique holder experience.",
  }
};

export default collectionConfig;

