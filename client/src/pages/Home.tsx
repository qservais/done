import { useEffect, lazy, Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";
import { Hero } from "@/components/sections/Hero";
import { Why } from "@/components/sections/Why";
import { Problem } from "@/components/sections/Problem";
import { Packs } from "@/components/sections/Packs";
import { Subscription } from "@/components/sections/Subscription";
import { Realizations } from "@/components/sections/Realizations";
import { Options } from "@/components/sections/Options";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { Reviews } from "@/components/sections/Trustpilot";
import { Section } from "@/components/ui/section";
import { FadeIn } from "@/components/ui/fade-in";
import { SkeletonSection } from "@/components/ui/skeleton-section";

const LeadWizard = lazy(() => import("@/components/LeadWizard").then(m => ({ default: m.LeadWizard })));

export default function Home() {
  useEffect(() => {
    // Disable browser scroll restoration and force top
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    // Also try with a small delay for stubborn browsers
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SEO
        title="Sites web premium à prix accessible — done"
        description="Sites web & landing pages au rendu haut de gamme, pensés mobile-first, livrés en 72h. Simple, beau, efficace — madebydone.be"
        canonical="https://madebydone.be/"
      />
      <StructuredData type="organization" />
      <StructuredData type="website" />
      
      <Header />
      
      <main>
        <Hero />
        <Problem />
        <Realizations />
        <Why />
        <Reviews />
        
        <Section id="wizard" className="bg-accent/5 border-y border-accent/20 py-16 md:py-20">
          <FadeIn className="text-center mb-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wide mb-4">
              Gratuit & sans engagement
            </span>
            <h2 className="text-2xl md:text-4xl font-bold mb-3">Recevez votre proposition</h2>
            <p className="text-muted-foreground max-w-md mx-auto">3 questions rapides et on vous envoie une proposition V1 sous 24h.</p>
          </FadeIn>
          <Suspense fallback={<SkeletonSection type="wizard" />}>
            <LeadWizard />
          </Suspense>
        </Section>

        <Packs />
        <Subscription />
        <Options />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
