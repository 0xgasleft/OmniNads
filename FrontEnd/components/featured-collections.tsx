"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel"
import { Button } from "./ui/button";
import AVALANCHE from "../public/assets/icons/avalanche.webp";
import BASE from "../public/assets/icons/base.png"
import SONEIUM from "../public/assets/icons/soneium.png"
import { ChevronRight } from "lucide-react";
import collectionConfig from "@/config/collectionConfig";

interface Collection {
  id: string
  link: string
  name: string
  category: string
  description: string
  itemCount: number
  logo: string
  images: string[]
  gradient: string
  borderColor: string
  ctaText: string
}

interface FeaturedCollectionsProps {
  title?: string;
  className?: string;
  grids?: string;
  collections?: Collection[]
}

const defaultCollections: Collection[] = [
  {
    id: "2",
    link: "omninads",
    name: "Omni Nads",
    category: "LAUNCHPAD",
    description: "Omni Nads is a cross-chain NFT project designed to break boundaries.",
    itemCount: 1111,
    logo: "/assets/nads/omni-nads-1.png",
    images: [
      "/assets/nads/omni-nads-1.png",
      "/assets/nads/omni-nads-2.png",
      "/assets/nads/omni-nads-3.png",
      "/assets/nads/omni-nads-4.png"
    ],
    gradient: "from-indigo-500 via-purple500 to-pink500",
    borderColor: "border-none",
    ctaText: "Go To Launchpad"
  },
]

const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({
  title,
  className,
  grids,
  collections = defaultCollections
}) => {

  const router = useRouter();

  return (
    <div className="w-full px-10 lg:px-[100px] 3xl:px-[160px] pb-6 -mt-4">
    <div className="flex justify-between items-center mb-6">
      <h2 className={`${className} text-2xl font-bold text-white`}>
        {title}
      </h2>

    </div>

    <Carousel className="relative">
      <CarouselContent>
        {collections.map((collection) => {
          // Use collection.link to lookup the corresponding config.
          const config = collectionConfig[collection.link.toLowerCase()];
          return (
            <CarouselItem
              key={collection.id}
              className="md:basis-1/2 xl:basis-1/3 2xl:basis-1/4"
            >
              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-900 to-gray-800">
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${collection.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                />
                {/* Image Grid */}
                <div className="grid grid-cols-2 gap-2 p-3">
                  {collection.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square overflow-hidden rounded-lg"
                    >
                      <Image
                        src={image}
                        alt={`${collection.name} preview ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
                {/* Collection Logo */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10">
                  <div className="p-1 rounded-full bg-[#222222] shadow-xl group-hover:hidden transition-transform duration-300">
                    <Image
                      src={collection.logo}
                      alt={`${collection.name} logo`}
                      width={56}
                      height={56}
                      className="rounded-full"
                    />
                  </div>
                </div>
                {/* Collection Info */}
                <div
                  className={`relative mt-6 md:mt-4 px-4 py-6 pt-[50px] md:pt-10 3xl:pt-10 bg-[#1A1A1A] border-b-4 ${collection.borderColor} rounded-b-xl`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="md:text-lg font-semibold text-white group-hover:text-gray-300 transition-colors">
                      {collection.name}
                    </h3>
                    <span className="px-3 py-1 text-sm text-gray-300 bg-black border-[1px] rounded border-slate-300">
                      {collection.itemCount.toLocaleString()} items
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple500 to-pink500"></div>
                </div>
                {/* Hover View */}
                <div
                  className={`absolute inset-0 p-6 flex flex-col justify-between bg-[#2a2a47] opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                >
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-400">
                      {collection.category}
                    </p>
                    <h3 className="text-2xl font-bold text-white">
                      {collection.name}
                    </h3>
                    <p className="text-gray-300 mt-4">
                      {collection.description}
                    </p>
                    <h3 className="text-2xl font-bold text-white pt-5">
                      {collection.category === "LAUNCHPAD"
                        ? "Mint on"
                        : "Trade on"}
                    </h3>
                    <div className="flex justify-center gap-3 pt-2">
                      {config?.networks.map((net, idx) => (
                        <Image
                          key={idx}
                          src={net.icon}
                          alt={net.name}
                          className="rounded-full"
                          width={56}
                          height={56}
                        />
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push(`/launchpad/${collection.link}`)}
                    className="w-full bg-gradient-to-r from-indigo-500 via-purple500 to-pink500 text-white"
                  >
                    {collection.ctaText}
                  </Button>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex size-6 md:size-8" />
      <CarouselNext className="hidden md:flex md:size-8 size-6" />
    </Carousel>
  </div>
);
};

export default FeaturedCollections;
