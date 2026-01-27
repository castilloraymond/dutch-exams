import {
  LandingNav,
  LandingHero,
  TrustStats,
  ProblemSolution,
  ModuleGrid,
  Testimonials,
  FinalCTA,
  LandingFooter,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--landing-cream)]">
      <LandingNav />
      <LandingHero />
      <TrustStats />
      <ProblemSolution />
      <div id="modules">
        <ModuleGrid />
      </div>
      <Testimonials />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}
