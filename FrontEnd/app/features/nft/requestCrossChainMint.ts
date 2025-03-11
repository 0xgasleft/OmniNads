import { createAsyncThunk } from "@reduxjs/toolkit"
import { getPublicClient } from "@/config/getPublicClient"
import { deepSerialize } from "@/utils/helpers"
import { Options } from "@layerzerolabs/lz-v2-utilities"
import { formatEther } from "viem"
import collectionConfig from "@/config/collectionConfig"

export interface MessagingFee {
  nativeFee: bigint
  lzTokenFee: bigint
}

export interface requestCrossChainMintArg {
  collectionName: string
  chainId: number
  walletClient: any
}

export interface QuoteSendResponse {
  msgFee: MessagingFee
  txHash: string
}

export const requestCrossChainMint = createAsyncThunk<
  QuoteSendResponse,
  requestCrossChainMintArg,
  { rejectValue: string }
>(
  "nft/requestCrossChainMint",
  async ({ collectionName, chainId, walletClient }, { rejectWithValue }) => {
    try {
      const collection = collectionConfig[collectionName]
      if (!collection) throw new Error(`Collection ${collectionName} not found!`)

      const contractType = collection.contractAddresses[chainId]
      if (!contractType?.messenger) {
        throw new Error(`No messenger contract found for ${collectionName} on chain ${chainId}`)
      }

      const messengerContract = contractType.messenger
      console.log(`Using Messenger Contract: ${messengerContract}`)

      const chainName = walletClient?.data?.chain?.name
      const publicClient = getPublicClient(chainName)
      if (!publicClient) throw new Error("Public client not available")
      if (!walletClient?.data) throw new Error("Wallet client not available")

      const options = Options.newOptions()
        .addExecutorLzReceiveOption(200_000, 0)
        .toHex()

      console.log("Options:", options)

      const nativeFee: bigint = await publicClient.readContract({
        account: walletClient.data.account,
        address: messengerContract,
        abi: [
          {
            inputs: [{ internalType: "bytes", name: "_options", type: "bytes" }],
            name: "quoteRequest",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function"
          }
        ],
        functionName: "quoteRequest",
        args: [options]
      })

      console.log(
        `LayerZero Fee: ${nativeFee.toString()} wei (${formatEther(nativeFee)} ETH)`,
      )

      const { hash: txHash } = await walletClient.data.writeContract({
        address: messengerContract,
        abi: [
          {
            inputs: [{ internalType: "bytes", name: "_options", type: "bytes" }],
            name: "requestCrossChainMint",
            outputs: [],
            stateMutability: "payable",
            type: "function"
          }
        ],
        functionName: "requestCrossChainMint",
        args: [options],
        value: nativeFee
      })

      console.log("Transaction Hash:", txHash)

      return deepSerialize({
        msgFee: {
          nativeFee,
          lzTokenFee: 0n
        },
        txHash
      })
    } catch (error: any) {
      console.error("Error in requestCrossChainMint:", error)
      return rejectWithValue(error.message || "Failed to execute cross-chain mint.")
    }
  }
)