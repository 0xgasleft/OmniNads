# Omni Nads – Omnichain NFT Project

This repository contains the source code for an **Omnichain NFT** minting and bridging application built with **Next.js** and **TypeScript**. The project demonstrates how to mint NFTs on multiple blockchains, bridge them across chains using LayerZero, and manage NFT metadata, rarities, and progressive utility. It supports multiple test networks (Monad Testnet, Arbitrum Sepolia, Optimism Sepolia etc.) and includes modules for:

- **Collection configuration** (`collectionConfig.tsx`)
- **NFT Minting** (`nft-launchpad.tsx`, `nft-mint-popup.tsx`)
- **Cross-chain bridging** (`blockchain-selection.tsx`, bridging logic in `page.tsx`)
- **Leaderboards and Reward Tiers** (`leaderboard-table.tsx`, `reward-tiers.tsx`)
- **Project overview and UI** (`project-overview.tsx`, etc.)
- **Redux Slices for NFT and bridging logic** (`nftSlice.ts`, `bridgeSlice.ts`)
- **GraphQL / Subgraph queries** (`getAllTokenStates.ts`, `getOwnedTokenIds.ts`)
- **Helper utilities** (`chainHelper.ts`, `chainUtils.ts`, `parseMintedTokenId.ts`)

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

1. **Omnichain Minting**  
   - Support for multiple EVM test networks, with the ability to mint NFTs on chosen chains.
   - Built-in  mint stages, dynamic pricing, and supply tracking.

2. **NFT Bridging (LayerZero)**  
   - Ability to bridge NFTs to other supported networks using a user-friendly UI.
   - Automatic retrieval of bridging fees and transaction quotes via smart contracts.

3. **Leaderboard and Reward Tiers**  
   - Real-time updates for user-traveled NFTs (number of times they bridged, NFT evolution stage etc.).
   - Reward tiers based on bridging activity and NFT evolution state.

4. **Extentable Collection Database**  
   - All information about the smart contracts, suppported networks are stored (in `collectionConfig.tsx`).
   - Integrated social links (Discord, Twitter) and contract references for transparency.

5. **Next.js & TypeScript**  
   - Full stack React framework for building server-rendered or statically exported web apps.
   - Strong type safety using TypeScript.

6. **Redux Toolkit**  
   - State management for minting, bridging, subgraph queries, and user-interface flows.  
   - Slices like `nftSlice.ts` manage NFT data (local + subgraph queries), while bridging logic can be handled in `bridgeSlice.ts`.

---

## Prerequisites

- **Node.js** (v16 or later recommended)
- **npm** or **yarn** package manager
- **Git** (to clone the repository)
- A **wallet** (e.g., MetaMask) configured to use test networks like *Base Sepolia, Avalanche Fuji, Monad Testnet*, etc.

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/username/your-omnichain-nft-project.git
   cd your-omnichain-nft-project
   ```

2. **Install dependencies**:
   ```bash
   # Using npm
   npm install

   # Or using yarn
   yarn
   ```

3. **Configure environment** (optional):
   - Create a `.env` file (or `.env.local`) at the root of your project for storing environment-specific variables (e.g., API keys, Next.js config, LayerZero info).
   - Example:
     ```bash
     NEXT_PUBLIC_API_BASE_URL="https://api.example.com"
     NEXT_PUBLIC_ALCHEMY_KEY="..."
     ```

---

## Project Structure

Below is an overview of key directories and files, including the recently added ones:

```
.
├─ app/
│  ├─ features/
│  │  ├─ nft/
│  │  │  ├─ nftSlice.ts        # Redux slice for managing NFT states, bridging, mint info, etc.
│  │  │  ├─ getAllTokenStates.ts # Queries to fetch NFT states across chains (e.g., subgraphs)
│  │  ├─ bridge/
│  │  │  └─ bridgeSlice.ts     # Redux slice for bridging logic, bridging UI states
│  ├─ hooks/                    # Custom React hooks (e.g., useMounted)
│  ├─ store.ts                  # Central Redux store
│  ├─ (other Next.js app routes/components)
├─ components/
│  ├─ ui/                      # Reusable UI components (Button, Card, Table, etc.)
│  ├─ blockchain-selection.tsx
│  ├─ nft-launchpad.tsx
│  ├─ nft-mint-popup.tsx
│  ├─ project-overview.tsx
│  ├─ leaderboard-table.tsx
│  ├─ reward-tiers.tsx
│  └─ (other custom UI components)
├─ config/
│  └─ collectionConfig.tsx     # Key config files for each NFT collection
├─ public/
│  └─ assets/                  # NFT images, icons, etc.
├─ queries/
│  ├─ getAllTokenStates.ts        # Queries to fetch NFT states across chains (e.g., subgraphs)
│  ├─ getOwnedTokenIds.ts         # Queries to fetch NFT owned by a specific address across chains (e.g., subgraphs)
│  └─ ...
├─ utils/
│  ├─ chainHelper.ts           # Chain ID helpers, explorer URLs, bridging endpoints (LayerZero)
│  ├─ chainUtils.ts            # Additional chain-based utilities
│  └─ parseMintedTokenId.ts    # Helper to parse minted token IDs from transaction logs
├─ pages/                      # Custom Next.js pages if used
├─ README.md                   # This file!
├─ package.json
├─ tsconfig.json
├─ next.config.js
└─ ...additional config files
```

---

## Usage

### Running Locally

1. **Start the development server**:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```
2. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Minting NFTs

- Navigate to the **NFT Launchpad** route (e.g., `/launchpad`).
- Connect your wallet (MetaMask, etc.) to a supported testnet (Monad Testnet(direct mint), Arbitrum Sepolia and Optimism sepolia(requestCrossChainMint, a message isent to LayerZero and the mint gets executed on Monad Testnet)).
- Choose a available network, and take note of the appropriate mint stage (Early Access, Public).
- Click **Mint** to sign the transaction.

### Bridging NFTs

- Go to the **Bridge** page (e.g., `/bridge/[collectionName]`).
- Select your owned NFT from the displayed list.
- Choose a destination chain (e.g., Arbitrum Sepolia or Optimism Sepolia).
- Click **Bridge** and confirm the transaction.

### Leaderboard & Reward Tiers

- Visit the **Leaderboard** route or section to see NFTs ranked by travel count.
- Reward tiers are automatically updated based on bridging frequency and NFT evolution state.

---

## Configuration

- **`collectionConfig.tsx`** holds core settings for each collection (e.g., contract addresses, supply, rarities, pricing, social links).
- **`chainHelper.ts`** & **`chainUtils.ts`** manage chain IDs, explorer URLs, bridging endpoints (LayerZero), and any other chain-based utilities.
- **`parseMintedTokenId.ts`** helps parse minted token IDs from contract transaction logs (useful post-mint to display minted token info).
- **`nftSlice.ts`** in `app/features/nft/` handles NFT data fetching (including subgraph queries), local caching, bridging transaction states, and user-interface updates.
- **`bridgeSlice.ts`** in `app/features/bridge/` handles bridging logic, including user selections (which chain, which token), fee estimation, etc.

You can customize the fields (e.g., `mintStages`, `prices`, `networks`) in `collectionConfig.tsx` to align with your deployment plan and expand the Redux slices (`nftSlice.ts`, `bridgeSlice.ts`) to meet your project’s requirements.

---

## Deployment

1. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```
   or
   ```bash
   yarn build
   yarn start
   ```
2. **Vercel / Netlify**:
   - Configure your project on Vercel/Netlify.
   - Include environment variables in the hosting provider’s dashboard.
   - Deploy directly from GitHub or by uploading build artifacts.

**Note:** The frontend components serve as supplementary assets to our primary repository, *Cult Markets*. Access to the main repository is granted on an invite-only basis for judging purposes. These frontend components were specifically developed for the hackathon, adhering to the new code rules for existing projects.