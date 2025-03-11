import { createAsyncThunk } from "@reduxjs/toolkit"
import { getPublicClient } from "@/config/getPublicClient"
import { deepSerialize } from "@/utils/helpers"
import { getCollectionContractAddress } from "@/utils/chainHelpers"

export interface MessagingFee {
  nativeFee: bigint
  lzTokenFee: bigint
}

export interface QuoteSendArgs {
  collectionName: string 
  chainId: number
  walletClient: any
  sendParam: {
    dstEid: number
    to: string
    tokenId: bigint
    extraOptions: string
    composeMsg: string
    onftCmd: string
  }
  payInLzToken: boolean
}

export interface QuoteSendResponse {
  msgFee: MessagingFee
}

export const quoteSend = createAsyncThunk<
  QuoteSendResponse,
  QuoteSendArgs,
  { rejectValue: string }
>(
  "nft/quoteSend",
  async (
    { collectionName, chainId, walletClient, sendParam, payInLzToken },
    { rejectWithValue }
  ) => {
    try {
      const chainName = walletClient?.data?.chain?.name
      const publicClient = getPublicClient(chainName)
      if (!publicClient) throw new Error("Public client not available")
      if (!walletClient?.data) throw new Error("Wallet client not available")

      const contractAddress = getCollectionContractAddress(collectionName, chainId)
      if (!contractAddress) {
        throw new Error(`No contract address found for ${collectionName} on chain ${chainId}`)
      }

      const result = await publicClient.readContract({
        account: walletClient.data.account,
        address: contractAddress,
        abi: [
          {
            inputs: [
              {
                components: [
                  { internalType: "uint32", name: "dstEid", type: "uint32" },
                  { internalType: "bytes32", name: "to", type: "bytes32" },
                  { internalType: "uint256", name: "tokenId", type: "uint256" },
                  { internalType: "bytes", name: "extraOptions", type: "bytes" },
                  { internalType: "bytes", name: "composeMsg", type: "bytes" },
                  { internalType: "bytes", name: "onftCmd", type: "bytes" },
                ],
                internalType: "struct SendParam",
                name: "_sendParam",
                type: "tuple",
              },
              { internalType: "bool", name: "_payInLzToken", type: "bool" },
            ],
            name: "quoteSend",
            outputs: [
              {
                components: [
                  { internalType: "uint256", name: "nativeFee", type: "uint256" },
                  { internalType: "uint256", name: "lzTokenFee", type: "uint256" },
                ],
                internalType: "struct MessagingFee",
                name: "msgFee",
                type: "tuple",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ] as const,
        functionName: "quoteSend",
        args: [sendParam, payInLzToken],
      })

      console.log("quoteSend Result:", result)

      return deepSerialize({
        msgFee: {
          nativeFee: result.nativeFee,
          lzTokenFee: result.lzTokenFee,
        },
      })
    } catch (error: any) {
      console.error("Error in quoteSend:", error)
      return rejectWithValue(error.message || "Failed to execute quoteSend.")
    }
  }
)