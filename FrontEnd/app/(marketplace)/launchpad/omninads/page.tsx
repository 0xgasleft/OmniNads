import NFTLaunchpad from '@/components/launchpad/nft-launchpad'
import ProjectOverview from '@/components/launchpad/project-overview'

export default function Home() {
  return (
    <main>
      <section id="mint">
        <NFTLaunchpad collectionName='omninads'/>
      </section>
      <section id="overview">
        <ProjectOverview collectionName='omninads'/>
      </section>
    </main>
  )
}

