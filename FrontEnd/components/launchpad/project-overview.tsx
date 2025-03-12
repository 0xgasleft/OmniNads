"use client";

import { ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useWalletClient } from "wagmi";
import { explorers, getExplorerUrl } from "@/utils/chainHelpers";
import collectionConfig from "@/config/collectionConfig";

interface ProjectOverviewProps {
  collectionName?: string;
}

export default function ProjectOverview({ collectionName }: ProjectOverviewProps) {
  const walletClient = useWalletClient();
  const chainIdFromWallet = walletClient?.data?.chain?.id;
  const chainId = chainIdFromWallet ?? 84532;

  const EXPLORER_URL = chainIdFromWallet
    ? getExplorerUrl(chainIdFromWallet)
    : explorers.BASE_SEPOLIA;

  const config = collectionName
    ? collectionConfig[collectionName.toLowerCase()]
    : undefined;

  if (!config) {
    return (
      <div className="text-center text-red-400 my-4">
        Collection not found or not configured.
      </div>
    );
  }

  const {
    title,
    contractAddresses,
    milestones,
    teamMembers,
    socials,
    about,
    utility
  } = config;

  const currentContractObj = contractAddresses?.[chainId];
  const currentContractAddress = currentContractObj?.minter || currentContractObj?.consumer || currentContractObj?.cultbears;

  const safeTeamMembers = teamMembers ?? []; 

  return (
    <div className="min-h-screen bg-[#1a1b1f] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex justify-start border-b border-gray-700/70 w-full mb-8">
            <TabsTrigger
              value="overview"
              className="relative px-4 py-3 text-sm data-[state=active]:text-white text-gray-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-purple after:transition-transform after:scale-x-0 data-[state=active]:after:scale-x-100"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="relative px-4 py-3 text-sm data-[state=active]:text-white text-gray-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-purple after:transition-transform after:scale-x-0 data-[state=active]:after:scale-x-100"
            >
              Team
            </TabsTrigger>
          </TabsList>

          {/* --------------------- OVERVIEW TAB --------------------- */}
          <TabsContent value="overview" className="grid md:grid-cols-2 gap-12 pb-8 md:pb-0">
            {/* Left Column - Project Info */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold mb-4">{title}</h1>
                <div className="flex gap-4">
                  {/* Contract Button */}
                  <Button
                    variant="outline"
                    className="text-xs bg-[#2a2b30]/80 border-none hover:bg-[#2a2b30] flex items-center"
                    asChild
                    disabled={!currentContractAddress} 
                    aria-label="Open Contract in new tab"
                  >
                    <a
                      href={
                        currentContractAddress
                          ? `${EXPLORER_URL}token/${currentContractAddress}`
                          : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      {currentContractAddress
                        ? `Contract ${currentContractAddress.slice(0, 5)}...${currentContractAddress.slice(-4)}`
                        : "Contract Unavailable"}
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  </Button>

                  {/* Discord Button (optional) */}
                  {socials?.discord && (
                    <Button
                      variant="outline"
                      className="px-3 bg-[#2a2b30]/80 border-none hover:bg-[#2a2b30]"
                      asChild
                    >
                      <a
                        href={socials.discord}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                      </a>
                    </Button>
                  )}

                  {/* Twitter Button (optional) */}
                  {socials?.twitter && (
                    <Button
                      variant="outline"
                      className="px-3 bg-[#2a2b30]/80 border-none hover:bg-[#2a2b30]"
                      asChild
                    >
                      <a
                        href={socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3">About Us</h2>
                  <p className="text-gray-400 leading-relaxed">
                    {about || "No information yet."}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">Utility</h2>
                  <p className="text-gray-400 leading-relaxed">
                    {utility || "No utility info yet."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Vision / Milestones */}
            <div>
              <h2 className="text-2xl font-bold mb-8">Vision</h2>
              <div className="relative">
                <div className="absolute left-3 top-2 bottom-2 w-px bg-purple/80 z-0" />
                <div className="space-y-8">
                  {/* Render milestones if any */}
                  {(milestones ?? []).map((milestone, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="rounded-full bg-purple p-1 z-10">
                        <Check className="w-4 h-4 z-10" />
                      </div>
                      <div>
                        <div className="font-semibold">{milestone.percentage}</div>
                        <div className="text-gray-400">{milestone.title}</div>
                      </div>
                    </div>
                  ))}

                  {/* If no milestones at all */}
                  {!milestones && (
                    <p className="text-gray-400">No milestones specified yet.</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* --------------------- TEAM TAB --------------------- */}
          <TabsContent value="team">
            <div className="relative">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Meet the Team</h2>
                <Button variant="secondary" className="bg-[#2a2b30]/80 hover:bg-[#2a2b30]">
                  {safeTeamMembers[0]?.name || "Team"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {safeTeamMembers.map((member, index) => (
                  <div key={index} className="bg-[#1e1f24] rounded-lg overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-semibold mb-1">{member.name}</h3>
                      <p className="text-pink-500 text-sm mb-3">{member.role}</p>
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* If no team members at all */}
              {!safeTeamMembers.length && (
                <p className="mt-4 text-gray-400">No team members listed.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}