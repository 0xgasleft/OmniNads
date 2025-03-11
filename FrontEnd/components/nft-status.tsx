"use client";

import { RootState } from "@/app/store";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { PawPrint } from "lucide-react";
import { useRouter } from "next/navigation";
import collectionConfig from "@/config/collectionConfig";

interface NftStatusProps {
  collectionName: string 
}

export function NFTStatus({ collectionName }: NftStatusProps) {
  const { items: nfts, loading } = useSelector((state: RootState) => state.nft);
  const router = useRouter();

  const colName = Array.isArray(collectionName)
  ? collectionName[0]
  : collectionName;

const config = collectionConfig[colName.toLowerCase()];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.h1
        className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text bg-gradient-to-r from-purple400 via-pink500 to-purple600 text-purple"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          delay: 0.2,
        }}
      >
        {nfts.length !== 0 
        ? config.bridgeTitle1 
        : config.bridgeTitle2}
      </motion.h1>

      <motion.p
        className="text-gray-200 mb-8 max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {nfts.length !== 0
          ? config.bridgeSlogan1
          : config.bridgeSlogan2}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {!loading && nfts.length === 0 && (
          <Button
            onClick={() => router.push("/launchpad/cultbears")}
            size="lg"
            className="bg-gradient-to-r from-purple500 to-pink500 hover:from-purple600 hover:to-pink600 text-white font-semibold px-8 py-6 rounded-full transform transition-transform hover:scale-105"
          >
            {config.bridgeCTA}
            <PawPrint className="ml-2 h-5 w-5" />
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}