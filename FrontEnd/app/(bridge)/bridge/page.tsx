"use client";

import NFTCollectionSelection from "@/components/nft-collection-seclection";
import { useSpring, animated } from '@react-spring/web'

export default function LeaderboardPage() {

  const gradientProps = useSpring({
    from: { backgroundPosition: '0% 50%' },
    to: { backgroundPosition: '100% 50%' },
    config: { duration: 5000 },
    loop: true,
  })

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-blue/80  to-black/70 text-white flex justify-center items-center">
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
      <NFTCollectionSelection />
    </div>
  )
}