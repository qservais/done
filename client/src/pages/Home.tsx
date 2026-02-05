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
import { Process } from "@/components/sections/Process";
import { Section } from "@/components/ui/section";

// Lazy load below-the-fold sections for better FCP/LCP
const Realizations = lazy(() => import("@/components/sections/Realizations").then(m => ({ default: m.Realizations })));
const Options = lazy(() => import("@/components/sections/Options").then(m => ({ default: m.Options })));
const FAQ = lazy(() => import("@/components/sections/FAQ").then(m => ({ default: m.FAQ })));
const Contact = lazy(() => import("@/components/sections/Contact").then(m => ({ default: m.Contact })));
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
        <Why />
        <Packs />
        <Subscription />
        <Process />
        
        <Suspense fallback={<div className="py-24 text-center"><div className="animate-pulse h-8 w-48 bg-secondary rounded mx-auto" /></div>}>
          <Section id="wizard" className="bg-secondary/30 py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Commencer le projet</h2>
              <p className="text-muted-foreground">Répondez à quelques questions pour obtenir une estimation.</p>
            </div>
            <LeadWizard />
          </Section>

          <Realizations />
          <Options />
          <FAQ />
          <Contact />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
