'use client';

import { useParams } from 'next/navigation';
import NFTLaunchpad from '@/components/launchpad/nft-launchpad';
import ProjectOverview from '@/components/launchpad/project-overview';

export default function CollectionPage() {
    const { collectionName } = useParams();
    const normalizedCollectionName = Array.isArray(collectionName)
      ? collectionName[0]
      : collectionName;

  return (
    <main>
      <section id="mint">
        <NFTLaunchpad collectionName={normalizedCollectionName} />
      </section>
      <section id="overview">
        <ProjectOverview collectionName={normalizedCollectionName} />
      </section>
    </main>
  );
}
