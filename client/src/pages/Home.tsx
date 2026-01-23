import { lazy, Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";
import { Hero } from "@/components/sections/Hero";
import { Why } from "@/components/sections/Why";
import { Problem } from "@/components/sections/Problem";
import { Packs } from "@/components/sections/Packs";
import { Section } from "@/components/ui/section";

const Subscription = lazy(() => import("@/components/sections/Subscription").then(m => ({ default: m.Subscription })));
const Process = lazy(() => import("@/components/sections/Process").then(m => ({ default: m.Process })));
const Realizations = lazy(() => import("@/components/sections/Realizations").then(m => ({ default: m.Realizations })));
const Options = lazy(() => import("@/components/sections/Options").then(m => ({ default: m.Options })));
const FAQ = lazy(() => import("@/components/sections/FAQ").then(m => ({ default: m.FAQ })));
const Contact = lazy(() => import("@/components/sections/Contact").then(m => ({ default: m.Contact })));
const LeadWizard = lazy(() => import("@/components/LeadWizard").then(m => ({ default: m.LeadWizard })));

function SectionLoader() {
  return (
    <div className="py-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  );
}

export default function Home() {
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
        
        <Suspense fallback={<SectionLoader />}>
          <Subscription />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <Process />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <Section id="wizard" className="bg-secondary/30 py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Commencer le projet</h2>
              <p className="text-muted-foreground">Répondez à quelques questions pour obtenir une estimation.</p>
            </div>
            <LeadWizard />
          </Section>
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <Realizations />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <Options />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <FAQ />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
      </main>

      <Footer />
      <MobileStickyCTA />
    </div>
  );
}
