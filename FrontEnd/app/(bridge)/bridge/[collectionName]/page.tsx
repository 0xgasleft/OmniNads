"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { BackgroundDecoration } from "@/components/background-decoration";
import { BlockchainSelection } from "@/components/blockchain-selection";
import { NftCarousel } from "@/components/nft-carousel";
import { NFTStatus } from "@/components/nft-status";
import { ParticleBackground } from "@/components/particle-background";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { quoteSend } from "@/app/features/nft/quoteSendThunk";
import { useWalletClient } from "wagmi";
import { send } from "@/app/features/nft/sendThunk";
import { addressToBytes32 } from "@/utils/helpers";
import { explorers, getExplorerUrl, LZ_EXPLORER_URL } from "@/utils/chainHelpers";
import { refreshNFTs } from "@/app/features/nft/nftSlice";
import collectionConfig from "@/config/collectionConfig";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";

const DST_EID_MAP: { [chainName: string]: number } = {
  "Sonic Blaze Testnet": 40349,
  "Base Sepolia": 40245,
  "Avalanche Fuji": 40106,
  "Polygon Amoy": 40267,
  "OP Sepolia": 40232,
  "Arbitrum Sepolia": 40231,
  "Sepolia": 40161,
  "Soneium Minato": 40334,
  "Binance Smart Chain Testnet": 40102,
  "Monad Testnet": 10143,
  "Flow EVM Testnet": 40351,
};

interface SendReceipt {
  transactionHash: string;
}

export default function BridgePage() {
  const { collectionName } = useParams();
  const { selectedTokenId, selectedChain } = useSelector((state: RootState) => state.bridge);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const walletClient = useWalletClient();

  const colName = Array.isArray(collectionName)
    ? collectionName[0]
    : collectionName;

  if (!colName || typeof colName !== "string") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        No valid collection name provided in the URL.
      </div>
    );
  }

  const config = collectionConfig[colName.toLowerCase()];
  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Collection not found.
      </div>
    );
  }

  const bridgingImage = config.bridgeImage || config.images[0];

  const chainIdFromWallet = walletClient?.data?.chain?.id || 84532;
  const EXPLORER_URL = chainIdFromWallet
    ? getExplorerUrl(chainIdFromWallet)
    : explorers.BASE_SEPOLIA;

  const handleBridge = async () => {
    if (!walletClient?.data) {
      toast({
        title: "Error",
        description: "Wallet is not connected!",
      });
      return;
    }

    const { chain, account } = walletClient.data;
    if (!chain || !account) {
      toast({
        title: "Error",
        description: "Invalid wallet connection!",
      });
      return;
    }

    const chainId = chain.id;
    const accountAddress = account.address;

    if (selectedTokenId === null || !selectedChain) {
      toast({
        title: "Error",
        description: (
          <pre className="w-[420px] rounded-md flex gap-3">
            <AlertCircle className="text-green w-5 h-5" />
            <p className="text-xs mt-1">
              Select an NFT and a destination blockchain!
            </p>
          </pre>
        ),
      });
      return;
    }

    const dstEid = DST_EID_MAP[selectedChain];
    if (!dstEid) {
      toast({
        title: "Error",
        description: "Invalid destination chain selected.",
      });
      return;
    }

    const sendParam = {
      dstEid,
      to: addressToBytes32(accountAddress),
      tokenId: BigInt(selectedTokenId),
      extraOptions: "0x",
      composeMsg: "0x",
      onftCmd: "0x",
    };

    try {
      const quoteResult = await dispatch(
        quoteSend({
          collectionName: colName,
          sendParam,
          payInLzToken: false,
          chainId,
          walletClient,
        })
      ).unwrap();

      if (quoteResult?.msgFee) {
        const { nativeFee, lzTokenFee } = quoteResult.msgFee;

        const sendResult = await dispatch(
          send({
            collectionName: colName,
            sendParam,
            fee: {
              nativeFee,
              lzTokenFee,
            },
            refundAddress: accountAddress,
            value: BigInt(nativeFee),
            walletClient,
            gas: 1000000n,
          })
        ).unwrap();

        const receipt = sendResult as SendReceipt;
        const txUrl = `${LZ_EXPLORER_URL}tx/${receipt.transactionHash}`;

        toast({
          description: (
            <div>
              Success!{" "}
              <a
                href={txUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-purple-300"
              >
                View Transaction
              </a>
            </div>
          ),
        });

        setTimeout(() => {
          dispatch(refreshNFTs());
        }, 3000);
      }
    } catch (error: any) {
      console.error("Error during bridging:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to bridge NFT.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple900 via-800 relative overflow-hidden">
      <ParticleBackground />
      <main className="relative z-10 container mx-auto px-4 pb-20 min-h-screen flex items-center justify-center">
        <div className="flex flex-col justify-center items-center md:mt-20 mt-[120px]">
          <Image
            src={
              typeof bridgingImage === "string"
                ? bridgingImage
                : bridgingImage.src
            }
            alt={config.title}
            width={200}
            height={200}
            className="w-[200px] h-[200px] mt-10"
          />
          <div className="backdrop-blur-lg bg-black/70 p-8 rounded-2xl border border-white/30 shadow-2xl">
            <NFTStatus collectionName={colName} />
            <NftCarousel collectionName={colName} />
            <BlockchainSelection onBridgeNow={handleBridge} />
          </div>
        </div>
      </main>
      <BackgroundDecoration />
    </div>
  );
}