"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Sonic from "../public/assets/icons/sonic.jpg"
import OP from "../public/assets/icons/op.svg"
import BNB from "../public/assets/icons/bnb.svg"
import ETH from "../public/assets/icons/eth.png"
import SONEIUM from "../public/assets/icons/soneium.png"
import { useEffect, useState } from "react"
import { CountdownTimer } from "./countdown-timer"
import { useRouter } from "next/navigation"
import { useMounted } from "@/app/hooks/useMounted"
import collectionConfig from "@/config/collectionConfig"

interface NFTSelection {
  id: string
  name: string
  image: string
  items: string
  isOpenEdition: boolean
}

const nftSelections: NFTSelection[] = [
  {
    id: "cultbears",
    name: "Cult Bears DAO",
    image: "/assets/cb12.webp",
    items: "2K",
    isOpenEdition: false,
  },
  {
    id: "omninads",
    name: "Omni Nads",
    image: "/assets/nads/omni-nads-1.png",
    items: "1,111",
    isOpenEdition: false,
  },
]

const blockchains = [
  { id: "sonic", name: "Sonic", icon: Sonic },
  {
    id: "base",
    name: "Base",
    icon: "https://assets.coingecko.com/nft_contracts/images/2989/small_2x/base-introduced.png?1707289780",
  },
  {
    id: "avalanche",
    name: "Avalanche",
    icon: "https://assets.coingecko.com/coins/images/12559/standard/Avalanche_Circle_RedWhite_Trans.png?1696512369",
  },
  {
    id: "polygon",
    name: "Polygon",
    icon: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
  },
  { id: "optimism", name: "Optimism", icon: OP },
  {
    id: "arbitrum",
    name: "Arbitrum",
    icon: "https://assets.coingecko.com/coins/images/16547/standard/arb.jpg?1721358242",
  },
  { id: "ethereum", name: "Ethereum", icon: ETH },
  { id: "minato", name: "Soneium", icon: SONEIUM },
  { id: "bnb", name: "BNB", icon: BNB },
]

export default function NFTCollectionSelection() {
  const mounted = useMounted()
  const [currentTime, setCurrentTime] = useState(new Date())
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="p-6 px-10 lg:px-[200px] 3xl:px-[240px] relative z-10">
      <h2 className="text-3xl font-bold text-purple">Choose Collection</h2>
      <p className="mt-4">Select an ONFT collection for bridging</p>
      <div className="mt-5">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {nftSelections.map((collections) => {
              const collectionsConfig = collectionConfig[collections.id.toLowerCase()]
              return (
                <CarouselItem key={collections.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="rounded-xl overflow-hidden bg-[#1c1e21] transition-colors group cursor-pointer">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={collections.image || "/placeholder.svg"}
                        alt={collections.name}
                        width={400}
                        height={300}
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {collections.isOpenEdition && (
                        <div className="absolute top-4 left-[65px]">
                          <div className="flex items-center gap-2 bg-slate-500 backdrop-blur-sm text-white px-2 py-1 rounded-2xl text-[10px] font-normal">
                            OMNI EDITION
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                    <h3 className="flex flex-col text-lg font-semibold text-white">{collections.name}</h3>
                          <div className="flex items-center gap-1 backdrop-blur-sm text-white p-1 rounded-full text-xs font-medium my-2">
                            {collectionsConfig.networks.map((net, idx) => (
                              <Image
                                key={idx}
                                alt={net.name}
                                src={net.icon || "/placeholder.svg"}
                                className="w-6 h-6 rounded-full"
                                width={16}
                                height={16}
                              />
                            ))}
                          </div>
                    <Button
                    onClick={() => router.push(`/bridge/${collections.id}`)}
                    className="w-full rounded-[4px] bg-purple hover:bg-purple text-white group-hover:opacity-100 transition-opacity duration-300"
                    >
                    Select
                    </Button>
                    </div>
                    </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </div>
  )
}