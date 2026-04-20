import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import HeroSection from '@/components/landing/HeroSection'
import ServicesSection from '@/components/landing/ServicesSection'
import WhyUsSection from '@/components/landing/WhyUsSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import TargetClientsSection from '@/components/landing/TargetClientsSection'
import CTASection from '@/components/landing/CTASection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <WhyUsSection />
        <HowItWorksSection />
        <TargetClientsSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
