"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Crown, Sparkles, Map } from "lucide-react"
import Image from "next/image"

import OmniNads1 from "@/public/assets/nads/omni-nads-1.png";
import OmniNads2 from "@/public/assets/nads/omni-nads-2.png";
import OmniNads3 from "@/public/assets/nads/omni-nads-3.png";
import OmniNads4 from "@/public/assets/nads/omni-nads-4.png";

interface NFT {
  id: string
  rank: number
  name: string
  image: string
  travelCount: number
  rareTraits: string[]
  evolutionProgress: number
}

export function LeaderboardTable() {
  const [nfts, setNfts] = useState<NFT[]>([
    {
      id: "1",
      rank: 1,
      name: "Wanderlust #1337",
      image: OmniNads1.src,
      travelCount: 124,
      rareTraits: ["Dimensional", "Ethereal"],
      evolutionProgress: 100,
    },
    {
      id: "2",
      rank: 2,
      name: "Voyager #420",
      image: OmniNads2.src,
      travelCount: 108,
      rareTraits: ["Cosmic"],
      evolutionProgress: 100,
    },
    {
      id: "2",
      rank: 3,
      name: "Voyager #420",
      image: OmniNads2.src,
      travelCount: 8,
      rareTraits: ["Cosmic"],
      evolutionProgress: 80,
    },
    {
      id: "3",
      rank: 4,
      name: "Explorer #789",
      image: OmniNads3.src,
      travelCount: 6,
      rareTraits: ["Temporal"],
      evolutionProgress: 60,
    },
    {
      id: "3",
      rank: 5,
      name: "Explorer #789",
      image: OmniNads3.src,
      travelCount: 5,
      rareTraits: ["Temporal"],
      evolutionProgress: 50,
    },
    {
      id: "3",
      rank: 6,
      name: "Explorer #789",
      image: OmniNads3.src,
      travelCount: 4,
      rareTraits: ["Temporal"],
      evolutionProgress: 40,
    },
    {
        id: "3",
        rank: 7,
        name: "Explorer #789",
        image: OmniNads3.src,
        travelCount: 3,
        rareTraits: ["Temporal"],
        evolutionProgress: 30,
    },
    {
       id: "3",
        rank: 8,
        name: "Explorer #789",
        image: OmniNads3.src,
        travelCount: 2,
        rareTraits: ["Temporal"],
        evolutionProgress: 20,
    },
    {
        id: "3",
        rank: 9,
        name: "Explorer #789",
        image: OmniNads3.src,
        travelCount: 2,
        rareTraits: ["Temporal"],
        evolutionProgress: 20,
    },
    {
        id: "3",
        rank: 10,
        name: "Explorer #789",
        image: OmniNads3.src,
        travelCount: 2,
        rareTraits: ["Temporal"],
        evolutionProgress: 20,
    },
    {
        id: "3",
        rank: 9,
        name: "Explorer #789",
        image: OmniNads3.src,
        travelCount: 2,
        rareTraits: ["Temporal"],
        evolutionProgress: 20,
    },
    {
        id: "3",
        rank: 10,
        name: "Explorer #789",
        image: OmniNads3.src,
        travelCount: 2,
        rareTraits: ["Temporal"],
        evolutionProgress: 20,
    },
    // Add more NFTs here...
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNfts((currentNfts) => {
        const updatedNfts = [...currentNfts]
        // Randomly update travel counts
        const randomIndex = Math.floor(Math.random() * updatedNfts.length)
        updatedNfts[randomIndex] = {
          ...updatedNfts[randomIndex],
          travelCount: updatedNfts[randomIndex].travelCount + 1,
          evolutionProgress: Math.min(100, updatedNfts[randomIndex].evolutionProgress + 1),
        }
        // Sort by travel count
        return updatedNfts.sort((a, b) => b.travelCount - a.travelCount)
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="overflow-hidden bg-black/50 backdrop-blur p-4 overflow-y-auto max-h-[400px] rounded-xl border-purple">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700">
            <TableHead className="w-16 text-slate-400">Rank</TableHead>
            <TableHead className="text-slate-400">NFT</TableHead>
            <TableHead className="text-slate-400">Travel Count</TableHead>
            <TableHead className="hidden text-slate-400 md:table-cell">Rare Traits</TableHead>
            <TableHead className="text-slate-400">Evolution Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nfts.map((nft) => (
            <TableRow key={nft.id} className="border-slate-700 transition-colors hover:bg-slate-900/50">
              <TableCell className="font-medium">
                {nft.rank === 1 ? <Crown className="h-6 w-6 text-yellow500" /> : nft.rank}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={nft.image || "/placeholder.svg"}
                    alt={nft.name}
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                  <span className="font-semibold">{nft.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-blue500" />
                  {nft.travelCount}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex gap-2">
                  {nft.rareTraits.map((trait) => (
                    <Badge key={trait} variant="outline" className="border-purple500/50 text-purple-400">
                      <Sparkles className="mr-1 h-3 w-3" />
                      {trait}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="w-full max-w-[200px]">
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-slate-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        style={{ width: `${nft.evolutionProgress}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-400">{nft.evolutionProgress}%</span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}