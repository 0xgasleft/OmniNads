import { Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function NftCard() {
  return (
    <Card className="bg-gray-900 border-none overflow-hidden rounded-xl">
      <CardContent className="p-0 relative">
        <div className="aspect-square bg-black relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-600 rounded-lg transform rotate-12 opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="black">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
                </svg>
              </div>
            </div>
          </div>
          <button className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full p-2">
            <Play className="h-4 w-4" />
          </button>
        </div>
        <div className="p-3">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium truncate">Gemesis #{Math.floor(Math.random() * 10000)}</div>
            <div className="text-xs text-gray-400">Price</div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="text-xs text-gray-400">Rank #{Math.floor(Math.random() * 10000)}</div>
            <div className="text-sm font-medium">0.045 ETH</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
