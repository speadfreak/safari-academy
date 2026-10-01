'use client'

import { useStore } from '@/lib/store'
import { HomeHero } from './hero'
import {
  WelcomeSection, WhyChooseSection, MarqueeStrip, LearningPathSection,
  CampusesSection, AdmissionsCTASection, NewsPreviewSection, EventsPreviewSection,
  TestimonialsSection, AchievementsSection, AlumniSpotlightSection,
  VirtualTourTeaserSection, FinalCTASection,
} from './sections'

export function HomePage() {
  const { data } = useStore()
  const visibility = (key: string) => {
    const sec = data?.homeSections.find((s) => s.key === key)
    return sec?.visible ?? true
  }

  return (
    <div>
      {visibility('hero') && <HomeHero />}
      {visibility('welcome') && <WelcomeSection />}
      <MarqueeStrip />
      {visibility('whyChoose') && <WhyChooseSection />}
      {visibility('journey') && <LearningPathSection />}
      {visibility('campuses') && <CampusesSection />}
      {visibility('admissions') && <AdmissionsCTASection />}
      {visibility('news') && <NewsPreviewSection />}
      {visibility('events') && <EventsPreviewSection />}
      {visibility('testimonials') && <TestimonialsSection />}
      {visibility('achievements') && <AchievementsSection />}
      {visibility('alumni') && <AlumniSpotlightSection />}
      {visibility('virtualTour') && <VirtualTourTeaserSection />}
      {visibility('finalCta') && <FinalCTASection />}
    </div>
  )
}
