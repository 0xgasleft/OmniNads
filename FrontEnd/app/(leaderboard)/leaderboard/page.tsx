"use client";

import { LeaderboardTable } from "@/components/leaderboard-table"
import { RewardTiers } from "@/components/reward-tiers"
import { useSpring, animated } from '@react-spring/web'

export default function LeaderboardPage() {

  const gradientProps = useSpring({
    from: { backgroundPosition: '0% 50%' },
    to: { backgroundPosition: '100% 50%' },
    config: { duration: 5000 },
    loop: true,
  })

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-blue/80  to-black/70 text-white">
      <animated.div
        style={{
        position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(45deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
          backgroundSize: '200% 200%',
          opacity: 0.7,
          ...gradientProps,
        }}
        className="z-0" 
      />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight mt-8">NFT Travel Leaderboard</h1>
          <p className="text-lg text-slate-400">Track the most adventurous NFTs and their evolving traits</p>
        </div>
        <div className="mb-8">
          <RewardTiers />
        </div>
        <LeaderboardTable />
      </div>
    </div>
  )
}