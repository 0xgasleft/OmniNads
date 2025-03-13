
import { createAsyncThunk } from "@reduxjs/toolkit"
import { request } from "graphql-request"
import GET_OWNED_TOKEN_IDS from "@/queries/getOwnedTokenIds"
import { getSubgraphUrl } from "@/utils/chainHelpers"
import collectionConfig from "@/config/collectionConfig"

interface GetOwnedTokenIdsResponse {
  tokens: {
    tokenId: string
    tokenURI: string | null
  }[]
}

export interface NFTMetadata {
  collectionName: string
  tokenId: string
  name: string
  description: string
  image: string
}

export const fetchOwnedNFTs = createAsyncThunk<
  NFTMetadata[],
  {
    ownerAddress: string
    chainId: number
    collectionName: string
  },
  { rejectValue: string }
>(
  "nft/fetchOwnedNFTs",
  async (
    { ownerAddress, chainId, collectionName },
    { rejectWithValue }
  ) => {
    try {

      const SUBGRAPH_URL = getSubgraphUrl(chainId)
      if (!SUBGRAPH_URL) {
        throw new Error("Subgraph URL is not defined for this chainId.")
      }

      const config = collectionConfig[collectionName.toLowerCase()]
      if (!config) {
        throw new Error(`Collection "${collectionName}" not found in collectionConfig.`)
      }

      const finalContractAddress = config.contractAddresses?.[chainId]

      if (!finalContractAddress) {
        throw new Error(
          `No contract address for chain ${chainId} in "${collectionName}" config.`
        )
      }

      const contractAddress =
      finalContractAddress.cultbears ||
      finalContractAddress.minter ||
      finalContractAddress.consumer

    if (!contractAddress) {
      throw new Error(
        `No valid contract address found for chain ${chainId} in "${collectionName}" config.`
      )
    }

    const variables = {
      owner: ownerAddress.toLowerCase(),
      contract: contractAddress.toLowerCase(),
    }

      const data = await request<GetOwnedTokenIdsResponse>(
        SUBGRAPH_URL,
        GET_OWNED_TOKEN_IDS,
        variables
      )

      const nftMetadataArr: NFTMetadata[] = []
      const baseUri = config.baseUri

      for (const token of data.tokens) {
        const tokenId = token.tokenId
        const tokenURI = token.tokenURI
        ? token.tokenURI
        : `${baseUri}${tokenId}.json`

        console.log("Graph token object:", token);

        console.log("token URI:", tokenURI);
        console.log("tokenId", tokenId)


        const response = await fetch(tokenURI)
        if (!response.ok) {
          throw new Error(`Failed to fetch metadata for token ${tokenId}.`)
        }

        const meta = await response.json()

        nftMetadataArr.push({
          collectionName,
          tokenId,
          name: `${config.title} #${tokenId}` || `NFT #${tokenId}`,
          description: meta.description || "",
          image: meta.image || "/default-nft.png",
        })
      }
      return nftMetadataArr
    } catch (error: any) {
      console.error("Error fetching owned tokenIds:", error)
      return rejectWithValue(
        error?.message || "Failed to fetch owned tokenIds."
      )
    }
  }
)