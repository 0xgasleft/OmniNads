import Footer from '@/components/footer'
import Header from '@/components/header'
import { Toaster } from '@/components/ui/toaster'
import '@/app/globals.css'

import type { Metadata } from 'next'
import { headers } from 'next/headers' 
import ContextProvider from '@/context'
import ReduxProvider from '@/components/ReduxProvider'

export const metadata: Metadata = {
    title: 'Cult Markets',
    description: '#1 Omnichain NFT Marketplace',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookies = (await headers()).get('cookies')

  return (
    <html lang="en">
    <body>
     <Header />
      <div className='pt-8 md:pt-16'>
      <ReduxProvider>
      <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </ReduxProvider>
      </div>
      <Toaster />
    </body>
  </html>
  )
}