import { Log } from "viem"

export function parseMintedTokenId(logs: Log[]): number | null {
  const ERC721_TRANSFER_TOPIC =
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

  for (const log of logs) {
    if (!log.topics || log.topics.length < 4) continue

    const topic0 = log.topics[0]
    if (!topic0 || topic0.toLowerCase() !== ERC721_TRANSFER_TOPIC) continue

    const fromTopic = log.topics[1]
    if (!fromTopic) continue

    if (!fromTopic.toLowerCase().includes("0000000000000000000000000000000000000000")) continue

    const tokenIdTopic = log.topics[3]
    if (!tokenIdTopic) continue

    return Number(BigInt(tokenIdTopic))
  }

  return null
}
