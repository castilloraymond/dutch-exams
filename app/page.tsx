import {
  UrgencyBanner,
  LandingNav,
  LandingHero,
  TrustStats,
  TrustedBy,
  ProblemSolution,
  FeatureCards,
  WhyUs,
  ModuleGrid,
  Testimonials,
  FAQ,
  FinalCTA,
  LandingFooter,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--landing-cream)] text-[110%] overflow-x-hidden">
      <UrgencyBanner />
      <LandingNav />
      <LandingHero />
      <TrustedBy />
      <TrustStats />
      <ProblemSolution />
      <FeatureCards />
      <WhyUs />

      <div id="modules">
        <ModuleGrid />
      </div>
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}
