"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import collectionConfig from "@/config/collectionConfig";
import { getContractAddressesString } from "@/utils/chainHelpers";
import { useWalletClient } from "wagmi";

interface NFTMintPopupProps {
  isOpen: boolean;
  onClose: () => void;
  collectionKey: keyof typeof collectionConfig;
  nftData?: {
    name?: string;
    image?: string;
  };
}

export default function NFTMintPopup({
  isOpen = true,
  onClose = () => {},
  collectionKey,
  nftData = {},
}: NFTMintPopupProps) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const walletClient = useWalletClient()
  const chainName = walletClient?.data?.chain?.name

  const collection = collectionConfig[collectionKey];

  {/* Can be used to have mulitple fallback images if needed */} 

  let defaultImage: string | undefined
  switch (chainName) {
    case "Monad Testnet":
      defaultImage = collection.images[0]?.src
      break
    case "Arbitrum Sepolia":
      defaultImage = collection.images[1]?.src
      break
    case "OP Sepolia":
      defaultImage = collection.images[2]?.src
      break
    default:
      defaultImage = collection.images[0]?.src
  }

  const defaultNFTData = {
    name: collection.title,
    image: collection.images[0]?.src
  };
  
  const mergedNFTData = { ...defaultNFTData, ...nftData };  

  const contractAddressesString = getContractAddressesString(collectionKey, collection);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative mx-4 max-w-4xl overflow-hidden rounded-xl bg-[#1a1a24] text-white shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex flex-col md:flex-row">
              {/* Left Column – Mint Confirmation */}
              <div className="flex flex-col p-6 md:max-w-md">
                <h2 className="text-2xl font-bold mb-4">Your mint is complete!</h2>
                <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg">
                  <div className="group relative h-full w-full">
                    <Image
                      src={mergedNFTData.image || "/placeholder.svg"}
                      alt={mergedNFTData.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute right-2 top-2 rounded-full bg-black/40 p-1.5 opacity-70 transition-opacity group-hover:opacity-100">
                      <Expand className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div className="mb-6 space-y-1">
                  <p className="text-gray-400">You have collected</p>
                  <p className="font-medium">{mergedNFTData.name}</p>
                  <p className="text-gray-400">and it's now in your Monad wallet.</p>
                </div>

                {/* To be added */}
                <Button className="w-full bg-[#2a2a38] hover:bg-[#3a3a48] text-white hidden">
                  View Item
                </Button>
              </div>

              {/* Right Column – Collection Details */}
              <div className="bg-[#1a1a24] p-6 md:max-w-md">
               
                <div className="mb-4">
                <div className="flex justify-between">
                <h3 className="mb-2 text-xl font-bold">Collection Details</h3>
                <button onClick={handleClose} className="rounded-full p-1 -mt-5">
                    <X className="h-5 w-5 mt-1" />
                  </button>
                </div>
                  <p className="text-sm text-gray-400">{collection.about}</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-lg font-semibold">Contract Address</h4>
                  <p className="text-sm break-all">{contractAddressesString}</p>
                </div>
                {collection.networks && (
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold">Networks</h4>
                    <div className="flex gap-2">
                      {collection.networks.map((network) => (
                        <div key={network.id} className="flex items-center gap-2">
                          <Image
                            src={network.icon}
                            alt={network.name}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                          <span className="text-sm">{network.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {collection.mintStages && (
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold">Mint Stages</h4>
                    <ul className="text-sm">
                      {collection.mintStages.map((stage) => (
                        <li key={stage.name} className="mb-1">
                          <strong>{stage.name}:</strong> {stage.status}
                          {stage.limit && <> - {stage.limit}</>}
                          {stage.details && <> - {stage.details}</>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button className="w-full bg-purple hover:bg-purple700 text-white">
                  View Collection
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}