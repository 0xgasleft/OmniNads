# OmniNads Backend

This repository contains the backend code for the OmniNads project, including smart contracts, hardhat tasks & scripts for deployment and management.

## Requirements

To work with this repository, you need the following:

- **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/) -> Used v18.20.7
- **npm**: Node Package Manager, which comes with Node.js -> Used v10.8.2
- **Hardhat**: A development environment for EVM -> Used v2.22.18
- **Hardhat Toolbox**: A set of libs for Hardhat -> Used v2.0.2
- **Solc**: The Solidity compiler is included with Hardhat -> Used 0.8.28
- **Other Dependencies**: Install the required dependencies listed in `package.json`:
  ```bash
  npm install
  ```

### Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```
MONAD_TESTNET_RPC="https://testnet-rpc.monad.xyz"
ARBITRUM_SEPOLIA_RPC=<Your Arbitrum Sepolia RPC URL>
OPTIMISM_SEPOLIA_RPC=<Your Optimism Sepolia RPC URL>
ARB_SEPOLIA_API_KEY=<Your arbiscan API Key>
OP_SEPOLIA_API_KEY=<Your optimism etherscan API Key>
SOURCE_PK=<YOUR PRIVATE KEY>
```

## Contracts

### OmniNadsMinter.sol

The `OmniNadsMinter` contract is an ONFT721 (Omnichain Non-Fungible Token) implementation that allows minting and managing NFTs across multiple chains. It includes the following features:

- **Mint Phases**: The contract supports different mint phases (DISABLED, WHITELIST, PUBLIC) to control the minting process.
- **Whitelist**: Addresses can be whitelisted to allow minting during the whitelist phase.
- **Smart Contract Allowance**: Specific smart contracts can be allowed to interact with the minting functions.
- **Cross-Chain Minting**: The contract supports minting NFTs across different chains using LayerZero technology.
- **Token Evolution**: Tokens can evolve through different states based on cross-chain interactions.

#### Key Functions

- `totalSupply()`: Returns the total supply of minted tokens.
- `nextPhase()`: Advances the mint phase to the next stage.
- `emergencyDisableMint()`: Disables minting in case of an emergency.
- `addToWhitelist(address)`: Adds an address to the whitelist.
- `removeFromWhitelist(address)`: Removes an address from the whitelist.
- `addToAllowedSmartContracts(address)`: Allows a smart contract to interact with the minting functions.
- `removeFromAllowedSmartContracts(address)`: Disallows a smart contract from interacting with the minting functions.
- `tokenURI(uint256)`: Returns the URI for a given token ID.
- `crossChainMint(address)`: Mints a token for a remote minter across chains.
- `publicMint()`: Allows public minting of tokens.
- `whitelistMint()`: Allows whitelisted addresses to mint tokens.

### OmniNadsConsumer.sol

The `OmniNadsConsumer` contract is an ONFT721 (Omnichain Non-Fungible Token) implementation that allows receiving and managing NFTs across multiple chains. It includes the following features:

- **Token URI**: Returns the URI for a given token ID.
- **Cross-Chain Sending**: Supports sending NFTs to other chains using LayerZero technology.
- **Token Evolution**: Tokens can evolve through different states based on cross-chain interactions.

#### Key Functions

- `tokenURI(uint256)`: Returns the URI for a given token ID.
- `send(SendParam, MessagingFee, address)`: Sends a token to another chain.
- `_credit(address, uint256, uint32)`: Credits a token to an address on the destination chain.

### OmniNadsMessager.sol

The `OmniNadsMessager` contract facilitates cross-chain minting requests for the OmniNads project. It interacts with the `OmniNadsMinter` contract to mint tokens on the destination chain.

#### Key Functions

- `setOmniNadsMinter(address)`: Sets the address of the `OmniNadsMinter` contract.
- `quoteRequest(bytes)`: Returns the fee required for a cross-chain mint request.
- `getChainId()`: Returns the chain ID of the current chain.
- `requestCrossChainMint(bytes)`: Sends a cross-chain mint request.
- `_lzReceive(Origin, bytes32, bytes, address, bytes)`: Handles the receipt of cross-chain messages.
- `withdrawNative(address)`: Withdraws the native currency from the contract.


## Folders

### merged

Merged folder contains the same contracts as in "../" but with full libs and external dependencies embedded into one file. Merged versions are used for deployment & contract verification (with sourcify & etherscan) on explorers.

### lz

The `lz` folder contains the LayerZero protocol-related contracts and libraries. These contracts facilitate cross-chain communication and interactions. Key components include:

- **oapp**: Contains the core OApp (Omnichain Application) contracts and libraries.
- **onft**: Contains the ONFT (Omnichain Non-Fungible Token) contracts and related libraries.
- **precrime**: Contains contracts and interfaces for pre-crime simulations and validations.
- **protocol**: Contains interfaces and libraries for the LayerZero protocol.
- **solidity-bytes-utils**: Contains utility libraries for handling byte arrays in Solidity.

### interfaces

The `interfaces` folder contains interface definitions for various contracts used in the OmniNads project. These interfaces define the functions and events that the contracts must implement, ensuring consistency and interoperability.

### DynamicONFT Library

The `DynamicONFT` library is a Solidity library designed to manage the state and minting phases of Omnichain Non-Fungible Tokens (ONFTs). It provides utility functions and data structures to handle token states, minting phases, and encoding/decoding of token information.

#### Enums

##### TokenState

Defines the possible states of a token:
- `NIL`: The token does not exist.
- `MINTED`: The token has been minted.
- `EVOLVED`: The token has evolved to a higher state.
- `ULTIMATE`: The token has reached its ultimate state.

##### MintPhase

Defines the different phases of the minting process:
- `DISABLED`: Minting is disabled.
- `WHITELIST`: Only whitelisted addresses can mint.
- `PUBLIC`: Public minting is allowed.

#### Structs

##### MintInfo

Stores information about the minting process:
- `_maxSupply`: The maximum supply of tokens.
- `_totalSupply`: The total number of tokens minted so far.
- `_phase`: The current phase of the minting process.

#### Events

- `WhitelistPhaseStarted()`: Emitted when the whitelist phase starts.
- `PublicPhaseStarted()`: Emitted when the public phase starts.
- `WhitelistUpdated(address indexed _address, bool _isWhitelisted)`: Emitted when an address is added or removed from the whitelist.
- `AllowedSmartContractUpdated(address indexed _address, bool _isAllowedSmartContract)`: Emitted when a smart contract is allowed or disallowed.
- `WhitelistMint(uint indexed tokenId, address indexed minter)`: Emitted when a token is minted during the whitelist phase.
- `PublicMint(uint indexed tokenId, address indexed minter)`: Emitted when a token is minted during the public phase.
- `CrossChainMint(uint indexed tokenId, address indexed minter)`: Emitted when a token is minted across chains.
- `TokenEvolved(uint indexed tokenId, uint8 indexed evolution)`: Emitted when a token evolves to a higher state.

#### Functions

##### decodeTokenInfo

Decodes the encoded token information into its token ID and state.

```solidity
function decodeTokenInfo(uint256 _encodedTokenInfo) pure internal returns (uint256 _tokenId, TokenState _state)
```

- `_encodedTokenInfo`: The encoded token information.
- Returns: The token ID and its state.

##### encodeTokenInfo

Encodes the token ID and state into a single value.

```solidity
function encodeTokenInfo(uint256 _tokenId, TokenState _state) pure internal returns (uint _encodedTokenInfo)
```

- `_tokenId`: The token ID.
- `_state`: The state of the token.
- Returns: The encoded token information.



## Scripts

### data.js

This file contains the necessary LayerZero elements & values used by most hardhat tasks & treatments. Besides that, it contains minting configuration elements such as max supply.

### gas_checker.js

The `gas_checker.js` script checks the gas balance of wallets across different networks configured in Hardhat.

#### Usage

1. Ensure your Hardhat configuration includes the necessary networks and accounts.
2. Run the script using Hardhat:
   ```bash
   npx hardhat run scripts/gas_checker.js
   ```

The script will output the gas balance of the configured wallets for each network, excluding the networks specified in the `IGNORABLE` array.

## Hardhat Tasks

### Deployment Tasks

#### deploy-omninad

Deploys the OmniNads contract to the specified networks.

```bash
npx hardhat deploy-omninad --mint <mint-chain> <consumer-chains...>
```

#### deploy-messager

Deploys the OmniNads Messager contract to the specified networks.

```bash
npx hardhat deploy-messager --mint <mint-chain> <consumer-chains...>
```

### Configuration Tasks

#### configure-omninad

Configures the OmniNads contract across the specified networks.

```bash
npx hardhat configure-omninad --mint <mint-chain>
```

### Minting Tasks

#### mint-omninad

Mints an OmniNad token on the specified chain.

```bash
npx hardhat mint-omninad --chain <chain-name>
```

### Sending Tasks

#### send-omninad

Sends an OmniNad token cross-chain.

```bash
npx hardhat send-omninad --source <source-chain> --destination <destination-chain> --id <token-id>
```

### Testing Tasks

#### test-crosschain-mint

Tests cross-chain minting on OmniNads.

```bash
npx hardhat test-crosschain-mint --requester <requester-chain>
```

## Hardhat Configuration

Ensure your Hardhat configuration (`hardhat.config.js`) includes the necessary networks (we used Monad Testnet, Arbitrum Sepolia & OP Sepolia) and accounts for deployment and interaction.

## License

This project is licensed under the MIT License.