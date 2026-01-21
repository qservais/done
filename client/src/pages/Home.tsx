import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";
import { Hero } from "@/components/sections/Hero";
import { Why } from "@/components/sections/Why";
import { Problem } from "@/components/sections/Problem";
import { Packs } from "@/components/sections/Packs";
import { Subscription } from "@/components/sections/Subscription";
import { Process } from "@/components/sections/Process";
import { Realizations } from "@/components/sections/Realizations";
import { Options } from "@/components/sections/Options";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { LeadWizard } from "@/components/LeadWizard";
import { Section } from "@/components/ui/section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SEO
        title="Sites web premium à prix accessible | done"
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
      </main>

      <Footer />
      <MobileStickyCTA />
    </div>
  );
}
