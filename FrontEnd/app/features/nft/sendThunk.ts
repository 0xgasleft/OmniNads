import { getPublicClient } from "@/config/getPublicClient";
import { getCollectionContractAddress } from "@/utils/chainHelpers";
import { deepSerialize } from "@/utils/helpers";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface SendArgs {
  collectionName: string;
    sendParam: {
      dstEid: number;
      to: string;
      tokenId: bigint;
      extraOptions: string;
      composeMsg: string;
      onftCmd: string;
    };
    fee: {
      nativeFee: bigint;
      lzTokenFee: bigint;
    };
    refundAddress: string;
    walletClient: any;
    value: bigint;
    gas: bigint;
  }
  
  export const send = createAsyncThunk<
  unknown,
  SendArgs,
  { rejectValue: string }
>(
  "nft/send",
  async ({ collectionName, sendParam, fee, refundAddress, walletClient, value }, { rejectWithValue }) => {
    try {
      const chainName = walletClient?.data?.chain?.name;
      const publicClient = getPublicClient(chainName);
      if (!publicClient) {
        throw new Error("Public client not available");
      }

      const chainId = walletClient.data.chain?.id;
      const contractAddress = getCollectionContractAddress(collectionName, chainId)
      if (!contractAddress) {
        throw new Error("Contract address is not defined for this network.");
      }

      const simulationResult = await publicClient.simulateContract({
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
              {
                components: [
                  { internalType: "uint256", name: "nativeFee", type: "uint256" },
                  { internalType: "uint256", name: "lzTokenFee", type: "uint256" },
                ],
                internalType: "struct MessagingFee",
                name: "_fee",
                type: "tuple",
              },
              {
                internalType: "address",
                name: "_refundAddress",
                type: "address",
              },
            ],
            name: "send",
            outputs: [
              {
                components: [
                  { internalType: "bytes32", name: "guid", type: "bytes32" },
                  { internalType: "uint64", name: "nonce", type: "uint64" },
                  {
                    components: [
                      { internalType: "uint256", name: "nativeFee", type: "uint256" },
                      { internalType: "uint256", name: "lzTokenFee", type: "uint256" },
                    ],
                    internalType: "struct MessagingFee",
                    name: "fee",
                    type: "tuple",
                  },
                ],
                internalType: "struct MessagingReceipt",
                name: "msgReceipt",
                type: "tuple",
              },
            ],
            stateMutability: "payable",
            type: "function",
          },
        ] as const,
        functionName: "send",
        args: [sendParam, fee, refundAddress],
        value,
      });

      const { request } = simulationResult;
      if (!request) {
        throw new Error("Simulation did not return a valid request object.");
      }

      const txHash = await walletClient.data.writeContract(request);
      if (!txHash) {
        throw new Error("Transaction failed to be sent.");
      }

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: 1,
      });

      if (receipt.status === "success") {
        return deepSerialize(receipt);
      } else {
        throw new Error("Transaction failed on-chain");
      }
    } catch (error: any) {
      console.error("Error in send:", error);
      return rejectWithValue(error.message || "Failed to send transaction");
    }
  }
);