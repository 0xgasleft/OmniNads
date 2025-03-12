
import { createAsyncThunk } from "@reduxjs/toolkit"
import { getPublicClient } from "@/config/getPublicClient"
import { deepSerialize } from "@/utils/helpers"
import { getCollectionContractAddress } from "@/utils/chainHelpers"

export interface whitelistMintArgs {
  collectionName: string 
  chainId: number
  walletClient: any
  account: string
  value: bigint 
}

export const whitelistMint = createAsyncThunk<
  unknown,           
  whitelistMintArgs,  
  { rejectValue: string }
>(
  "nft/whitelistMint",
  async (
    { collectionName, chainId, walletClient, value },
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

      let abi: readonly any[]
      let args: any[]

        abi = [
            {
              inputs: [],
              name: "whitelistMint",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function"
              }
        ] as const

        args = []

      const simulationResult = await publicClient.simulateContract({
        account: walletClient.data.account,
        address: contractAddress,
        abi,
        functionName: "whitelistMint",
        args,
        value,
      })

      const { request } = simulationResult
      const txHash = await walletClient.data.writeContract(request)
      if (!txHash) {
        throw new Error("Transaction failed to be sent.")
      }

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: 1,
      })

      if (receipt.status === "success") {
        return deepSerialize(receipt)
      } else {
        throw new Error("Transaction failed on-chain")
      }
    } catch (error: any) {
      console.error("Error minting multiple NFTs:", error)
      return rejectWithValue(error.message || "Failed to mint multiple NFTs.")
    }
  }
)