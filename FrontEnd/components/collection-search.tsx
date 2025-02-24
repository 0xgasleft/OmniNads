'use client'

import { useState, useRef, useEffect } from 'react'
import { BadgeCheck, Search, Shapes } from 'lucide-react'
import Image from 'next/image'
import { Collection, SEARCH_COLLECTIONS } from '@/constants/collections'
import BASE from "../public/assets/icons/base.png"
import SONEIUM from "../public/assets/icons/soneium.png"
import AVALANCHE from "../public/assets/icons/avalanche.webp";
import OP from "../public/assets/icons/op.svg"
import ETH from "../public/assets/icons/eth.png"
import MONAD from "../public/assets/icons/monad.png"
import ARB from "../public/assets/icons/arb.webp"
import { useRouter } from 'next/navigation'

const CHAIN_FILTERS = [
    { id: "all", label: "All Chains", icon: <Shapes className="w-5 h-5 text-purple fill-purple" /> },
    { id: "avalanche", label: "Avalanche", icon: AVALANCHE.src },
    { id: "base", label: "Base", icon: BASE.src },
   // { id: "ethereum", label: "Ethereum", icon: ETH.src },
    { id: "monad", label: "Monad", icon: MONAD.src },
  //  { id: "optimism", label: "Optimism", icon: OP.src },
   // { id: "arbitrum", label: "Arbitrum", icon: ARB.src },
  ]

export function CollectionSearch() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([])
  const [selectedChain, setSelectedChain] = useState("all")
  const searchRef = useRef<HTMLDivElement>(null)
  const searchSuggestions = ['Search Collections', 'Cult Bears', 'Omni Nads']
  const searchIndex = useRef(0)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchValue("")
        document.body.classList.remove("search-active")
      }
    }

    // Handle escape key
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
        setSearchValue("")
        document.body.classList.remove("search-active")
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen])

  useEffect(() => {
    if (searchValue) {
      const filtered = SEARCH_COLLECTIONS.filter((collection) =>
        collection.name.toLowerCase().includes(searchValue.toLowerCase()),
      )
      setFilteredCollections(filtered)
      setIsOpen(true)
      document.body.classList.add("search-active")
    } else {
      setFilteredCollections([])
      setIsOpen(false)
      document.body.classList.remove("search-active")
    }
  }, [searchValue])

  const handleClose = () => {
    setIsOpen(false)
    setSearchValue("")
    document.body.classList.remove("search-active")
  }

  return (
      <div className="hidden lg:flex relative lg:-mr-10" ref={searchRef}>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={searchSuggestions[searchIndex.current]}
          onFocus={() => {
            const interval = setInterval(() => {
              searchIndex.current = (searchIndex.current + 1) % searchSuggestions.length
            }, 2000)
            return () => clearInterval(interval)
          }}
          className="text-sm placeholder:text-sm 2xl:placeholder:text-base 2xl:text-base lg:w-[180px] xl:w-[200px] 2xl:w-[350px] pl-8 pr-4 py-1 2xl:pl-10 2xl:py-2 mt-1 rounded-[4px] border border-[#857f94]/60 placeholder:text-[#857f94] hover:text-white text-white focus:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple500 bg-[#090b16] transition-all"
          />
          <Search className="absolute left-2 top-3.5 2xl:left-2.5 text-white w-4 h-4 2xl:w-5 2xl:h-5" />
    
       {/* Search Results Popup */}
       {isOpen && (
        <>
          {/* Overlay - clicking this will close the popup */}
          <div className="fixed inset-0 bg-black/60 z-40" onClick={handleClose} />

          {/* Popup Content */}
          <div className="fixed top-16 left-1/2 -translate-x-1/2 w-[800px] bg-[#1c1c22] border border-gray-700/40 rounded-[4px] shadow-xl z-50 mt-4">
            {/* Chain Filters */}
            <div className="flex items-center gap-2 p-4 border-b border-gray-700/40">
            {CHAIN_FILTERS.map((chain) => (
            <button
            key={chain.id}
            onClick={(e) => {
            e.stopPropagation();
            setSelectedChain(chain.id);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
            selectedChain === chain.id ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700/80" 
            }`}>
            {typeof chain.icon === "string" ? (
            <Image src={chain.icon} alt={chain.label} width={20} height={20} className="rounded-full" />
            ) : (
            chain.icon
            )}
            {chain.label}
            </button>
            ))}
            </div>

            {/* Collection List Header */}
            <div className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-700/40">
              <div>Collections</div>
              <div className="text-right">Chains</div>
              <div className="text-right">Floor</div>
              <div className="text-right">Total Volume</div>
            </div>

            {/* Collection List */}
            <div className="max-h-[600px] overflow-y-auto">
              {filteredCollections.map((collection) => (
                <div
                  key={collection.id}
                  className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 px-4 py-3 hover:bg-gray-700/40 cursor-pointer items-center"
                  onClick={(e) => {
                    e.stopPropagation() // Prevent click from bubbling to overlay
                    router.push(`launchpad/${collection.link}`);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <Image
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    {collection.isVerified && (
                        <BadgeCheck className='w-4 h-4 fill-purple text-white -ml-8 -mt-6 hidden'/>
                      )}
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{collection.name}</span>
                      {collection.isVerified && (
                        <BadgeCheck className='w-4 h-4  stroke-purple'/>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-1 ml-[90px]">
                    {collection.chains.map((chain, index) => (
                      <Image
                        key={index}
                        src={chain || "/placeholder.svg"}
                        alt={`Chain ${index + 1}`}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    ))}
                  </div>
                  <div className="text-right text-white">
                  {collection.floorPrice 
                      ? `${collection.floorPrice.amount} ${collection.floorPrice.currency}` 
                      : '-'}
                  </div>
                  <div className="text-right text-white">
                  {collection.volume 
                      ? `${collection.volume.amount}K ${collection.volume.currency}` 
                      : '-'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}