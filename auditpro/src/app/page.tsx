import PublicNav from '@/components/public/PublicNav'
import HeroSection from '@/components/public/HeroSection'
import ServicesSection from '@/components/public/ServicesSection'
import StatsSection from '@/components/public/StatsSection'
import TestimonialsSection from '@/components/public/TestimonialsSection'
import BlogPreview from '@/components/public/BlogPreview'
import CtaSection from '@/components/public/CtaSection'
import PublicFooter from '@/components/public/PublicFooter'
import AIChatbot from '@/components/AIChatbot'

export default function HomePage() {
  return (
    <main>
      <PublicNav />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <TestimonialsSection />
      <BlogPreview />
      <CtaSection />
      <PublicFooter />
      <AIChatbot />
    </main>
  )
}
