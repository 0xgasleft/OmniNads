
import { createAsyncThunk } from "@reduxjs/toolkit"
import { request } from "graphql-request"
import GET_ALL_TOKEN_STATES from "@/queries/getAllTokenStates"
import { getSubgraphUrl } from "@/utils/chainHelpers"
import collectionConfig from "@/config/collectionConfig"

interface GetAllTokenStatesResponse {
  tokens: {
    tokenId: string
    tokenURI: string | null
    tokenState: string
  }[]
}

export interface NFTStateData {
  tokenId: string
  name: string
  description: string
  image: string
  tokenState: number
  evolutionProgress: number
}

interface FetchAllTokenStatesArgs {
  chainId: number
  collectionName: string
}

export const fetchAllTokenStates = createAsyncThunk<
  NFTStateData[],
  FetchAllTokenStatesArgs,
  { rejectValue: string }
>(
  "nft/fetchAllTokenStates",
  async ({ chainId, collectionName }, { rejectWithValue }) => {
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
        throw new Error(`No contract address for chain ${chainId} in "${collectionName}" config.`)
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
        contract: contractAddress.toLowerCase(),
      }

      const data = await request<GetAllTokenStatesResponse>(
        SUBGRAPH_URL,
        GET_ALL_TOKEN_STATES,
        variables
      )

      const nftDataArr: NFTStateData[] = []

      for (const token of data.tokens) {
        const tokenId = token.tokenId
        const tokenStateInt = parseInt(token.tokenState, 10)

        const tokenURI = token.tokenURI
          ? token.tokenURI
          : `${config.baseUri}${tokenId}.json`

        const response = await fetch(tokenURI)
        if (!response.ok) {
          throw new Error(`Failed to fetch metadata for token ${tokenId}.`)
        }
        const meta = await response.json()

        let name: string
        switch (tokenStateInt) {
          case 1:
            name = `MonTraveler #${tokenId}`
            break
          case 2:
            name = `MonVoyager #${tokenId}`
            break
          case 3:
            name = `MonNomad #${tokenId}`
            break
          default:
            name = `Unknown #${tokenId}`
        }

        let evolutionProgress = 0
        if (tokenStateInt === 1) evolutionProgress = 33
        if (tokenStateInt === 2) evolutionProgress = 67
        if (tokenStateInt === 3) evolutionProgress = 100

        nftDataArr.push({
          tokenId,
          tokenState: tokenStateInt,
          name,
          description: meta.description || "",
          image: meta.image || "/default-nft.png",
          evolutionProgress,
        })
      }

      nftDataArr.sort((a, b) => parseInt(a.tokenId) - parseInt(b.tokenId))

      return nftDataArr
    } catch (error: any) {
      console.error("Error fetching token states:", error)
      return rejectWithValue(error?.message || "Failed to fetch token states.")
    }
  }
)