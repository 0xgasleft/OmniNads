"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useWalletClient } from "wagmi"
import { toast } from '../ui/use-toast'

interface Network {
  id: number
  name: string
  icon: string
  isActive?: boolean
}

interface NetworkSelectorProps {
  networks: Network[]
  onSelect?: (network: Network) => void
  className?: string
}

export function NetworkSelector({ networks, onSelect, className }: NetworkSelectorProps) {
 const [selectedNetwork, setSelectedNetwork] = React.useState<number>(84532)
 const walletClient = useWalletClient();

 const handleNetworkSelect = async (network: Network) => {
    if (!walletClient?.data?.switchChain) {
      toast({ description: "Switch network is not supported by your wallet." })
      return
    }

    try {
      await walletClient.data.switchChain({ id: network.id })
      setSelectedNetwork(network.id)
      onSelect?.(network)
      toast({ description: "Switched network successfully!" })
    } catch (error: any) {
      console.error("Network switch failed:", error)
      toast({
        description: `Network switch failed: ${error.message || error}`,
      })
    }
  }

  return (
    <div className={cn("flex items-center gap-0.5 sm:gap-1 rounded-full bg-white/20 px-1 sm:px-2 py-0.5 sm:py-1", className)}>
      {networks.map((network) => (
        <Button
          key={network.id}
          size="network"
          variant="ghost"
          className={cn(
            "rounded-full p-0 hover:bg-white/80",
            selectedNetwork === network.id && "ring-2 ring-purple ring-offset-2",
          )}
          onClick={() => handleNetworkSelect(network)}
        >
          <Image
            src={network.icon || "/placeholder.svg"}
            alt={`${network.name} network`}
            className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-contain"
            width={40}
            height={40}
          />
          <span className="sr-only">Select {network.name} network</span>
        </Button>
      ))}
    </div>
  )
}

