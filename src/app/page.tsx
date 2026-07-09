import SiteShell from '@/components/SiteShell'
import HeroSlider from '@/components/landing/HeroSlider'
import ChatTeaser from '@/components/landing/ChatTeaser'
import ServicesGrid from '@/components/landing/ServicesGrid'
import StatsSection from '@/components/landing/StatsSection'
import WhyUsSection from '@/components/landing/WhyUsSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import GalleryPreviewSection from '@/components/landing/GalleryPreviewSection'
import SuppliersMarquee from '@/components/landing/SuppliersMarquee'
import TargetClientsSection from '@/components/landing/TargetClientsSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import ProcessTimelineSection from '@/components/landing/ProcessTimelineSection'
import CertificationsSection from '@/components/landing/CertificationsSection'
import FAQSection from '@/components/landing/FAQSection'
import QuoteCalculator from '@/components/landing/QuoteCalculator'
import CTASection from '@/components/landing/CTASection'

export default function HomePage() {
  return (
    <SiteShell>
      <HeroSlider />
      <ChatTeaser />
      <ServicesGrid />
      <StatsSection />
      <WhyUsSection />
      <ProcessTimelineSection />
      <HowItWorksSection />
      <GalleryPreviewSection />
      <TestimonialsSection />
      <CertificationsSection />
      <SuppliersMarquee />
      <TargetClientsSection />
      <FAQSection />
      <QuoteCalculator />
      <CTASection />
    </SiteShell>
  )
}
