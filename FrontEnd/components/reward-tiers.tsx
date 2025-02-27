import { Card } from "@/components/ui/card"
import { Crown, Star, Zap } from "lucide-react"

export function RewardTiers() {
  const tiers = [
    {
      icon: Crown,
      name: "Legend",
      requirement: "Top 10 Travelers",
      reward: "Mythical Evolution",
      color: "text-yellow500",
    },
    {
      icon: Star,
      name: "Explorer",
      requirement: "5+ Travels",
      reward: "Rare Trait Unlock",
      color: "text-purple500",
    },
    {
      icon: Zap,
      name: "Wanderer",
      requirement: "2+ Travels",
      reward: "Basic Evolution",
      color: "text-blue500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {tiers.map((tier) => (
        <Card key={tier.name} className="border-slate-800 bg-black/50 p-6 backdrop-blur rounded-xl">
          <div className="flex flex-col items-center text-center">
            <tier.icon className={`mb-4 h-8 w-8 ${tier.color}`} />
            <h3 className="mb-2 text-xl font-bold">{tier.name}</h3>
            <p className="mb-2 text-sm text-slate-400">{tier.requirement}</p>
            <p className="text-sm font-medium text-slate-300">{tier.reward}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
