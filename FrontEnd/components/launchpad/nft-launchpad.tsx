'use client'

import { useEffect, useState } from 'react'
import { useMounted } from '@/app/hooks/useMounted'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Maximize2, ExternalLink, Lock, Check, X } from 'lucide-react'
import Image from "next/image"
import { useSpring, animated } from '@react-spring/web'
import CultBears31 from "../../public/assets/bears/cult-bear-31.png"
import CultBears9 from "../../public/assets/bears/cult-bear-9.png"
import CultBears28 from "../../public/assets/bears/cult-bear-28.png"
import CultBears57 from "../../public/assets/bears/cult-bear-57.png"
import Sonic from "../../public/assets/icons/sonic.jpg"
import OP from "../../public/assets/icons/op.svg"
import BNB from "../../public/assets/icons/bnb.svg"
import ETH from "../../public/assets/icons/eth.png"
import AVAX from "../../public/assets/icons/avalanche.webp"
import ARB from "../../public/assets/icons/arb.webp"
import POL from "../../public/assets/icons/pol.webp"
import BASE from "../../public/assets/icons/base.png"
import SONEIUM from "../../public/assets/icons/soneium.png"
import CustomConnectButton from '@/components/wallets/custom-connect-button';
import { useWalletClient } from 'wagmi'
import { useAppDispatch } from '@/app/hooks'
import { toast } from '../ui/use-toast'
import { mintMultiple } from '@/app/features/nft/mintMultipleThunk'
import { explorers, getExplorerUrl, getSubgraphUrl } from '@/utils/chainHelpers'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import request from 'graphql-request'
import GET_RARITY_STATS from '@/queries/getRarityStats'
import { CustomCountdownTimer } from '../countdown-timer'
import { subscribe } from "@/app/actions/subscribe"
import { NetworkSelector } from './network-selection'

interface Rarity {
  name: string
  color: string
  supply: number
  minted: number
}

const rarities: Rarity[] = [
  { name: 'Common', color: 'text-gray-400', supply: 910, minted: 0 },
  { name: 'Rare', color: 'text-blue400', supply: 50, minted: 0 },
  { name: 'Ultra Rare', color: 'text-purple300', supply: 25, minted: 0 },
  { name: 'Legendary', color: 'text-yellow400', supply: 13, minted: 0 },
  { name: 'Mythic', color: 'text-red400', supply: 2, minted: 2 },
]

interface MintReceipt {
  transactionHash: string;
}

interface RarityStatResponse {
  rarityStats: {
    rarity: number; 
    minted: number; 
  };
}

interface NFTLaunchpadProps {
  collectionName?: string; 
}


const rarityMap: Record<string, number> = {
  Common: 0,
  Rare: 1,
  "Ultra Rare": 2,
  Legendary: 3,
  Mythic: 4,
};

import collectionConfig from '../../config/collectionConfig';


export default function NFTLaunchpad({ collectionName }: NFTLaunchpadProps) {
  const config = collectionName
  ? collectionConfig[collectionName.toLowerCase()]
  : undefined;
  
  if (!config) {
    return (
      <div className="text-center text-red my-4">
        Collection not found or not configured.
      </div>
    );
  }

  const { title, images, rarities: defaultRarities, contractAddress, networks, prices: collectionPrices, totalSupply, mintStages } = config;

  const hasRarities = !!defaultRarities;

  const mounted = useMounted();
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  const handleSubscribe = async (formData: FormData) => {
    const result = await subscribe(formData);
    if ("error" in result && result.error !== undefined) {
      setSubscriptionStatus(result.error);
    } else if ("success" in result && result.success !== undefined) {
      setSubscriptionStatus(result.success);
      setEmail("");
    }
  };
  


  useEffect(() => {
    setEndTime(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)); // 30 days from now
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedRarity, setSelectedRarity] = useState('Common')
  const [dynamicRarities, setDynamicRarities] = useState(defaultRarities || []);
  const [mintCount, setMintCount] = useState(0);

  const totalMinted = hasRarities ? dynamicRarities.reduce((acc, r) => acc + r.minted, 0) : 0;
  const mintPercentage = Math.round((totalMinted / totalSupply) * 100); 

  const walletClient = useWalletClient();
  const dispatch = useAppDispatch();

  const chainIdFromWallet = walletClient?.data?.chain?.id || 84532;
  const SUBGRAPH_URL = getSubgraphUrl(chainIdFromWallet);
  const EXPLORER_URL = chainIdFromWallet
  ? getExplorerUrl(chainIdFromWallet)
  : explorers.BASE_SEPOLIA

  const currentNetwork = chainIdFromWallet === 84532 ? 'base' : chainIdFromWallet === 43113 ? 'avalanche' : 'monad';

  const isValidNetwork = networks.some((net) => net.id === chainIdFromWallet);

  const isSoldOut = () => {
    const selectedRarityData = dynamicRarities.find((rarity) => rarity.name === selectedRarity);
    return selectedRarityData ? selectedRarityData.minted >= selectedRarityData.supply : false;
  };

  const handlePriceDisplay = () => {
    if (hasRarities && collectionPrices) {
      return collectionPrices[currentNetwork]?.[selectedRarity] ?? { crypto: "0", fiat: "$0" };
    }
    return { crypto: "0", fiat: "$0" };
  };

  const toBigIntWith18Decimals = (price: string): bigint => {
    const [whole, fractional] = price.split('.');
    const wholePart = BigInt(whole || '0') * BigInt(10 ** 18);
    const fractionalPart = fractional
      ? BigInt(fractional.padEnd(18, '0').slice(0, 18))
      : BigInt(0);
    return wholePart + fractionalPart;
  };

  const gradientProps = useSpring({
    from: { backgroundPosition: '0% 50%' },
    to: { backgroundPosition: '100% 50%' },
    config: { duration: 5000 },
    loop: true,
  })

   const blockchains = [
    { id: "sonic", name: "Sonic", icon: Sonic },
    { id: "base", name: "Base", icon: "https://assets.coingecko.com/nft_contracts/images/2989/small_2x/base-introduced.png?1707289780" },
    { id: "avalanche", name: "Avalanche", icon: "https://assets.coingecko.com/coins/images/12559/standard/Avalanche_Circle_RedWhite_Trans.png?1696512369" },
  
    { id: "polygon", name: "Polygon", icon: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912" },
    { id: "optimism", name: "Optimism", icon: OP },
    { id: "arbitrum", name: "Arbitrum", icon: "https://assets.coingecko.com/coins/images/16547/standard/arb.jpg?1721358242" },
    
    { id: "ethereum", name: "Ethereum", icon: ETH },
    { id: "minato", name: "Soneium", icon: SONEIUM },
    { id: "bnb", name: "BNB", icon: BNB },
  ]

  useEffect(() => {
    async function fetchRarityStats() {
      try {
        const rarityIds = ['0', '1', '2', '3', '4']; 
        const statsPromises = rarityIds.map((id) =>
          request<RarityStatResponse>(SUBGRAPH_URL, GET_RARITY_STATS, { id })
        );
  
        const statsResponses = await Promise.all(statsPromises);
  
        const updatedRarities = rarities.map((rarity, index) => {
          const stat = statsResponses[index]?.rarityStats;
          return {
            ...rarity,
            minted: stat ? Number(stat.minted) : rarity.minted,
          };
        });
  
        setDynamicRarities(updatedRarities);
        console.log("updatedRarities:", updatedRarities)
      } catch (error) {
        console.error('Error fetching rarity stats:', error);
      }
    }
  
    fetchRarityStats();
  }, [walletClient.data?.chain, mintCount]);

  const handleSwitchNetwork = async () => {
    if (!walletClient?.data?.switchChain) {
      toast({ description: "Switch network is not supported by your wallet." });
      return;
    }
    try {
      await walletClient.data.switchChain({ id: networks[0].id });
      toast({ description: "Switched network successfully!" });
    } catch (error: any) {
      toast({
        description: `Network switch failed: ${error.message || error}`,
      });
    }
  };

  const handleMintAndSubscribe = async () => {
    if (!walletClient?.data?.account) {
      toast({
        description: "Please connect your wallet.",
      });
      return;
    }
  
    if (email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setSubscriptionStatus("Email is invalid");
        return;
      }
  
      try {
        const formData = new FormData();
        formData.append("email", email);
        const result = await subscribe(formData);
  
        if ("error" in result && result.error !== undefined) {
          setSubscriptionStatus(result.error);
          return;
        } else if ("success" in result && result.success !== undefined) {
          setSubscriptionStatus(result.success);
          setEmail("");
          console.log(email);
        }
      } catch (error) {
        console.error("Subscription failed:", error);
        setSubscriptionStatus("Subscription failed. Please try again.");
        return;
      }
    }
  
    // Proceed with minting
    const account = walletClient.data.account.address;
    const chainId = chainIdFromWallet;
    const rarityId = hasRarities ? rarityMap[selectedRarity] : 0;
    const { crypto } = hasRarities ? handlePriceDisplay() : { crypto: "0" };
    const value = hasRarities ? toBigIntWith18Decimals(crypto) : BigInt(0);
  
    try {
      const result = await dispatch(
        mintMultiple({
          mintAmount: 1,
          rarity: rarityId,
          chainId,
          account,
          walletClient,
          value,
        })
      ).unwrap();
  
      const receipt = result as MintReceipt;
      const txUrl = `${EXPLORER_URL}tx/${receipt.transactionHash}`;
  
      setTimeout(() => {
        setMintCount((prev) => prev + 1);
      }, 5000);
  
      toast({
        description: (
          <div>
            Mint successful! 🎉{" "}
            <a
              href={txUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-purple-300"
            >
              View Transaction
            </a>
          </div>
        ),
      });
    } catch (error: any) {
      console.error("Minting failed:", error);
      toast({
        description: `Minting failed: ${error.message || error}`,
      });
    }
  };

  return (
    <div className="relative bg-gradient-to-bl from-blue/80  via-black/70 to-blue/80 text-white pb-10 pt-3 md:pt-[30px] md:pb-[74px]">
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
      <div className="px-8 md:px-0 max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        {/* Left Column - NFT Preview */}
        <div className="space-y-4 mt-4 z-10">

        <div className="flex text-start justify-start items-start">
        <div className='flex gap-2'>
        <span className="text-white font-bold text-xl md:text-3xl mr-1 md:mr-2">{title}</span>
        <NetworkSelector networks={networks} className="w-auto" />
          </div>
          </div>

          <Card className="bg-[#b4b7ff] border-none relative group overflow-hidden rounded-2xl">
          {images?.[selectedImage] && (
              <Image
                src={images[selectedImage]}
                alt="NFT"
                width={600}
                height={600}
                className="w-full aspect-square object-cover"
              />
            )}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </button>
          </Card>

            {/* Thumbnail Selection */}
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-pink-600' 
                      : 'border-transparent hover:border-pink-600/50'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Cult Bear NFT ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

        </div>

        {/* Right Column - Mint Interface #18181c #1e1f24 */}
        <div className="space-y-6 z-10">
          <Card className="bg-[#18181c] border-none p-6 space-y-4 md:mt-[100px] rounded-xl">
            <h2 className="text-lg font-semibold">Mint Stages</h2>
            
            {/* Mint Stages List */}
            <div className="space-y-6">
              {mintStages.map((stage, index) => (
                <div key={index} className={`space-y-2 ${
                  stage.status === 'LIVE' ? 'p-4 border border-purple rounded-xl' : 'p-4 border border-gray-700/40  rounded-xl'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-[#33353b] rounded-full text-sm">
                        {stage.name} 
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {stage.status === 'LIVE' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-purple">ENDS IN</span>
                          {endTime && mounted? (<CustomCountdownTimer endTime={endTime} />
                          ) : (
                            <span className="bg-[#33353b] px-2 py-1 rounded text-white">
                              Loading...
                            </span>
                          )}
                        </div>
                      ) : 'ENDED'}
                    </span>
                  </div>
                  {stage.details && (
                    <div className="text-sm text-gray-400 ml-1">
                      {stage.limit} • Price {stage.details}
                    </div>
                  )}
                </div>
              ))}
            </div>

              {/* Rarity Selection */}
              
                {hasRarities && (
                  <>
                <div className="space-y-3">
                  <label className="text-sm text-gray-400">Select Rarity</label>
                  <RadioGroup
                    value={selectedRarity}
                    onValueChange={(value) => setSelectedRarity(value)}
                    className="grid grid-cols-2 gap-2"
                  >
                    {dynamicRarities.map((rarity) => (
                      <Label
                        key={rarity.name}
                        className={`flex flex-col items-center p-3 rounded-[4px] border cursor-pointer transition-all hover:bg-[#13141A] ${
                          selectedRarity === rarity.name
                            ? "border-purple bg-[#13141A]/60"
                            : "border-gray-700/40"
                        }`}
                      >
                        <RadioGroupItem value={rarity.name} className="sr-only" />
                        <span className={`font-medium ${rarity.color}`}>
                          {rarity.name}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {rarity.minted}/{rarity.supply}
                        </span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-400">Price</p>
                  <p className="text-2xl font-bold">
                    {handlePriceDisplay().crypto}{" "}
                    {currentNetwork === "base" ? "ETH" : currentNetwork === "avalanche" ? "AVAX" : "MON"}{" "}
                    <span className="text-sm text-gray-500">
                      ({handlePriceDisplay().fiat})
                    </span>
                  </p>
                </div>
                </>
           
              )}

            <div className="bg-[#26282d] p-4 rounded-xl space-y-6">
            {/* Mint Progress */}
            <div className='flex gap-5 w-full'>
             <div className="flex items-center gap-2 bg-[#303339] px-2 md:px-4 py-2 rounded-[4px]">
             <div className="w-2 h-2 bg-green rounded-full" />
              <span className='text-green'>Live</span>
              </div>
              <div className="w-full space-y-2">
          
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span>Total Minted</span>
              <span className="text-gray-400">
              {mintPercentage}% ({totalMinted}/{totalSupply})
              </span>
            </div>

          </div>
          <div className="relative w-full h-1.5 bg-[#13141A] rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-purple rounded-full transition-all duration-300" 
              style={{ width: `${mintPercentage}%` }}
            />
          </div>
         </div>
         </div>

            {/* Price Display */}
            <div>

              <p className="text-sm text-gray-400">Price</p>
              <p className="text-2xl font-bold">{handlePriceDisplay().crypto} {currentNetwork === 'base' ? 'ETH' : 'AVAX'}{' '}
              <span className="text-sm text-gray-500">({handlePriceDisplay().fiat})</span></p>
            </div>

             {/* Subscription Form */}
             <form
             onSubmit={(e) => {
             e.preventDefault();
             handleSubscribe(new FormData(e.target as HTMLFormElement));
            }}>
          <div className="space-y-2">
          <label className="text-sm text-gray-400">
            Email Address (Optional)
          </label>
          <Input
            name="email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#141517] border-gray-800"
          />
        </div>
      </form>
      {subscriptionStatus && (
        <p
        className={`flex mt-2 text-sm ${
          subscriptionStatus.includes("success")
            ? "text-green"
            : "text-red"
        }`}
        >
          {subscriptionStatus}
        </p>
      )}

            {/* Terms */}
            <p className="text-xs text-gray-500">
              By clicking "mint", you agree to the Cult Markets Terms of Service.
            </p>

            {/* Action Buttons */}
            <div className="space-y-4">
            {walletClient?.data?.account ? (
              isValidNetwork ? (
              <Button
               onClick={handleMintAndSubscribe}
               className={`w-full ${
               isSoldOut() ? "bg-gray-600 cursor-not-allowed" : "bg-purple hover:bg-purple-700"
               }`}
              disabled={isSoldOut()}
              >
             {isSoldOut() ? 'Sold Out' : 'Mint NFT'}
            </Button>
            ) : (
            <Button 
            onClick={handleSwitchNetwork} 
            className="w-full bg-purple hover:bg-purple700"
            >
           Switch Network
           </Button>
           )
          ) : (
          <CustomConnectButton />
          )}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Lock className="w-3 h-3" />
          <span>Collection is locked from trading until all items have been minted.</span>
          </div>
          </div>
          </div>
          </Card>

          {/* Explore Collection Button */}
          <div className="bg-[#18181c] p-4 rounded-xl space-y-6">
          <Button variant="outline" className="w-full bg-[#26282d] border-none hover:bg-[#2a2b30] z-10">
            Explore Collection
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          </div>
        </div>
      </div>

        {/* Image Modal */}
        {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full flex justify-center items-center">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute md:mt-10 -top-[220px] md:-top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            {images?.[selectedImage] && (
              <Image
                src={images[selectedImage]}
                alt="NFT Modal"
                width={700}
                height={700}
                className="flex justify-center items-center mt-10 md:ml-20 w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-lg object-cover"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

