
import { createAsyncThunk } from "@reduxjs/toolkit"
import { getCollectionContractAddress } from "@/utils/chainHelpers"
import { getPublicClient } from "@/config/getPublicClient"

const MINT_INFO_ABI = [
  {
    inputs: [],
    name: "mintInfo",
    outputs: [
      { internalType: "uint16", "name": "_maxSupply", "type": "uint16" },
      { internalType: "uint16", "name": "_totalSupply", "type": "uint16" },
      {
        internalType: "enum DynamicONFT.MintPhase",
        name: "_phase",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const

export interface MintInfo {
    maxSupply: number
    totalSupply: number
    phase: number
  }  

export const getMintInfo = createAsyncThunk<
  MintInfo,
  { collectionName: string },
  { rejectValue: string }
>(
  "nft/getMintInfo",
  async ({ collectionName }, { rejectWithValue }) => {
    try {
      const publicClient = getPublicClient("Monad Testnet")
      const contractAddress = getCollectionContractAddress(collectionName, 10143)
      if (!contractAddress) {
        throw new Error(
          `No contract address found for ${collectionName} on chain Monad`
        )
      }

      const [maxSupply, totalSupply, phase] = (await publicClient.readContract({
        address: contractAddress,
        abi: MINT_INFO_ABI,
        functionName: "mintInfo",
        args: [],
      })) as [bigint, bigint, bigint]

      return {
        maxSupply: Number(maxSupply),
        totalSupply: Number(totalSupply),
        phase: Number(phase),
      }
    } catch (error: any) {
      console.error("Error fetching mintInfo:", error)
      return rejectWithValue(error.message || "Failed to fetch mintInfo.")
    }
  }
)
