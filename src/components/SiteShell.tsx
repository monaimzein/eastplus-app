import Navbar from './Navbar'
import Footer from './Footer'
import SmartAssistant from './SmartAssistant'
import type { ReactNode } from 'react'

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-20 flex-1">{children}</main>
      <Footer />
      <SmartAssistant />
    </>
  )
}

