import {
  UrgencyBanner,
  LandingNav,
  LandingHero,
  TrustStats,
  ProblemSolution,
  FeatureCards,
  ModuleGrid,
  Testimonials,
  FinalCTA,
  LandingFooter,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--landing-cream)] text-[110%] overflow-x-hidden">
      <UrgencyBanner />
      <LandingNav />
      <LandingHero />
      <TrustStats />
      <ProblemSolution />
      <FeatureCards />
      <div id="modules">
        <ModuleGrid />
      </div>
      <Testimonials />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}
