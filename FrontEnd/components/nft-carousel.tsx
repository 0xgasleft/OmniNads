"use client"

import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "@/app/store"

// Redux slices
import { clearNFTs } from "@/app/features/nft/nftSlice"
import { setSelectedTokenId } from "@/app/features/bridge/bridgeSlice"
import { fetchOwnedNFTs } from "@/app/features/nft/nftThunks"

// Wagmi
import { useWalletClient } from "wagmi"

// UI
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Loader from "./loader"

// Helpers
import { getPublicClient } from "@/config/getPublicClient"
import collectionConfig from "@/config/collectionConfig"
import { ChainNames } from "@/utils/chainUtils"

interface NftCarouselProps {
  collectionName: string 
}

export function NftCarousel({ collectionName }: NftCarouselProps) {
  const dispatch = useDispatch<AppDispatch>()
  const walletClient = useWalletClient()

  const { items: nfts, loading, error, lastRefresh } = useSelector(
    (state: RootState) => state.nft
  )
  const { selectedTokenId } = useSelector((state: RootState) => state.bridge)

  const [delayedLoading, setDelayedLoading] = useState(loading)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const chainId = walletClient?.data?.chain?.id
  const chainName = walletClient?.data?.chain?.name as ChainNames;

  const lowerName = collectionName?.toLowerCase()
  const config = collectionConfig[lowerName]
  const contractAddress =
    config?.contractAddresses && chainId
      ? config.contractAddresses[chainId]
      : undefined

  const publicClient = chainName ? getPublicClient(chainName) : null


  if (publicClient && walletClient && chainId) {
    console.log(
      "NftCarousel dynamic info =>",
      "ChainName:",
      chainName,
      "| ChainId:",
      chainId,
      "| contractAddress:",
      contractAddress,
      "| wallet:",
      walletClient.data?.account?.address
    )
  }

  useEffect(() => {
    if (loading) {
      setDelayedLoading(true)
    } else {
      const timer = setTimeout(() => {
        setDelayedLoading(false)
      }, 1500) 
      return () => clearTimeout(timer)
    }
  }, [loading])

  useEffect(() => {
    const ownerAddress = walletClient?.data?.account?.address
    if (!chainId || !ownerAddress || !contractAddress) {
      return 
    }

    dispatch(clearNFTs())

    dispatch(
      fetchOwnedNFTs({
        ownerAddress,
        contractAddress,
        chainId,
      })
    )
  }, [dispatch, chainId, walletClient?.data?.account?.address, contractAddress, lastRefresh])

  const handleRetry = () => {
    const ownerAddress = walletClient?.data?.account?.address
    if (!chainId || !ownerAddress || !contractAddress) return
    dispatch(fetchOwnedNFTs({ ownerAddress, contractAddress, chainId }))
  }

  if (delayedLoading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={handleRetry}
          disabled={loading}
          className={`mt-2 px-4 py-2 rounded ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-red-500 text-white"
          }`}
        >
          {loading ? "Retrying..." : "Retry"}
        </button>
      </div>
    )
  }

  return (
    <section className="h-1/2 py-4">
      <div className="h-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto max-h-[400px] pb-4 scrollbar-thin scrollbar-thumb-purple600 scrollbar-track-transparent">
          {nfts.map((nft) => {
            const parsedTokenId = parseInt(nft.tokenId, 10)
            return (
              <Card
                key={nft.tokenId}
                onMouseEnter={() => setHoveredId(nft.tokenId)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => dispatch(setSelectedTokenId(parsedTokenId))}
                className={`w-40 h-48 bg-white/10 backdrop-blur-lg border-none text-white transition-shadow duration-300
                  ${
                    hoveredId === nft.tokenId
                      ? "shadow-lg shadow-purple500/50"
                      : ""
                  }
                  ${
                    selectedTokenId === parsedTokenId
                      ? "bg-purple600"
                      : "bg-white/10"
                  }
                `}
              >
                <CardContent className="p-2.5">
                  <Image
                    src={nft.image || "/default-nft.png"}
                    alt={`Token ID: ${nft.tokenId}`}
                    width={300}
                    height={300}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-sm font-semibold text-center truncate">
                    {nft.name ?? "NFT"} #{nft.tokenId}
                  </h3>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}