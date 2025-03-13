import { createAsyncThunk } from "@reduxjs/toolkit"
import { getPublicClient } from "@/config/getPublicClient"
import { getCollectionContractAddress } from "@/utils/chainHelpers"

export interface DirectNFTMetadata {
  tokenId: number
  name: string
  description: string
  image: string
}

interface FetchMintedNFTArgs {
  collectionName: string 
  chainId: number
  walletClient: any
  tokenId: number
}

export const fetchMintedNFT = createAsyncThunk<
  DirectNFTMetadata,
  FetchMintedNFTArgs,
  { rejectValue: string }
>("nft/fetchMintedNFT", async (args, { rejectWithValue }) => {
  try {
    const { collectionName, chainId, walletClient, tokenId } = args
    const chainName = walletClient?.data?.chain?.name
    const publicClient = getPublicClient(chainName)

    const contractAddress = getCollectionContractAddress(collectionName, chainId)
    if (!contractAddress) {
      throw new Error(`No contract address found for ${collectionName} on chain ${chainId}`)
    }
    if (!publicClient) throw new Error("Public client not available")

    const tokenURI = await publicClient.readContract({
      address: contractAddress,
      abi: [
        {
          name: "tokenURI",
          inputs: [{ name: "tokenId", type: "uint256" }],
          outputs: [{ name: "", type: "string" }],
          stateMutability: "view",
          type: "function",
        },
      ] as const,
      functionName: "tokenURI",
      args: [BigInt(tokenId)], 
    })

    if (typeof tokenURI !== "string") {
      throw new Error(`Invalid response for tokenURI: ${tokenURI}`)
    }
    console.log(`[fetchMintedNFT] tokenURI(${tokenId}) => `, tokenURI)

    const resp = await fetch(tokenURI)
    if (!resp.ok) {
      throw new Error(`[fetchMintedNFT] Failed to fetch ${tokenURI}, status=${resp.status}`)
    }
    const meta = await resp.json()
    console.log("[fetchMintedNFT] Fetched metadata:", meta)

    return {
      tokenId,
      name: meta.name || `NFT #${tokenId}`,
      description: meta.description || "",
      image: meta.image || "/default-nft.png",
    }
  } catch (error: any) {
    console.error("[fetchMintedNFT] Error:", error)
    return rejectWithValue(error.message || "Failed to fetch minted NFT.")
  }
})
