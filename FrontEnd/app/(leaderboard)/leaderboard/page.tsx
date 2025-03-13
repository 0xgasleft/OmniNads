"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchAllTokenStates } from "@/app/features/nft/fetchAllTokenStates";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Crown, Sparkles, Map } from "lucide-react";
import { useWalletClient } from "wagmi";
import {
  ARBITRUM_SEPOLIA_ID,
  MONAD_TESTNET_ID,
  OPTIMISM_SEPOLIA_ID,
} from "@/utils/chainHelpers";

export function LeaderboardTable() {
  const dispatch = useAppDispatch();
  const { tokenStates, loading, error } = useAppSelector((state) => state.nft);
  const walletClient = useWalletClient();
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    const chainIdFromWallet = walletClient?.data?.chain?.id;
    if (chainIdFromWallet) {
      if (
        chainIdFromWallet === MONAD_TESTNET_ID ||
        chainIdFromWallet === OPTIMISM_SEPOLIA_ID ||
        chainIdFromWallet === ARBITRUM_SEPOLIA_ID
      ) {
        setChainId(chainIdFromWallet);
      } else {
        setChainId(MONAD_TESTNET_ID);
      }
    }
  }, [walletClient?.data?.chain?.id]);

  useEffect(() => {
    if (chainId !== null) {
      const collectionName = "omninads";
      dispatch(
        fetchAllTokenStates({
          chainId,
          collectionName,
        })
      );
    }
  }, [dispatch, chainId]);

  const tableData = tokenStates.map((t) => {
    let evolutionProgress = 0;
    if (t.tokenState === 1) evolutionProgress = 33;
    if (t.tokenState === 2) evolutionProgress = 67;
    if (t.tokenState === 3) evolutionProgress = 100;

    let travelCount = 0;
    if (t.tokenState === 1) travelCount = 1;
    if (t.tokenState === 2) travelCount = 2;
    if (t.tokenState === 3) travelCount = 3;

    const rareTraits: string[] = [];

    return {
      tokenId: t.tokenId,
      name: t.name,
      image: t.image,
      travelCount,
      rareTraits,
      evolutionProgress,
    };
  });

  tableData.sort((a, b) => Number(a.tokenId) - Number(b.tokenId));
  const tableRows = tableData.map((nft, idx) => ({
    rank: idx + 1,
    ...nft,
  }));

  return (
    <div>
      {chainId === null ? (
        <div>Loading leaderboard...</div>
      ) : loading ? (
        <div>Loading leaderboard...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <Card className="overflow-hidden bg-black/50 backdrop-blur p-4 overflow-y-auto max-h-[400px] rounded-xl border-purple">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="w-16 text-slate-400">Rank</TableHead>
                <TableHead className="text-slate-400">NFT</TableHead>
                <TableHead className="text-slate-400">Travel Count</TableHead>
                <TableHead className="hidden text-slate-400 md:table-cell">
                  Rare Traits
                </TableHead>
                <TableHead className="text-slate-400">
                  Evolution Progress
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableRows.map((nft) => (
                <TableRow
                  key={nft.tokenId}
                  className="border-slate-700 transition-colors hover:bg-slate-900/50"
                >
                  <TableCell className="font-medium">
                    {nft.rank === 1 ? (
                      <Crown className="h-6 w-6 text-yellow-500" />
                    ) : (
                      nft.rank
                    )}
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
                      <Map className="h-4 w-4 text-blue-500" />
                      {nft.travelCount}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex gap-2">
                      {nft.rareTraits.map((trait) => (
                        <Badge
                          key={trait}
                          variant="outline"
                          className="border-purple-500/50 text-purple-400"
                        >
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
                        <span className="text-sm text-slate-400">
                          {nft.evolutionProgress}%
                        </span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}