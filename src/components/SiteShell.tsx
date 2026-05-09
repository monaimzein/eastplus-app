import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import type { ReactNode } from 'react'

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-20 flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
