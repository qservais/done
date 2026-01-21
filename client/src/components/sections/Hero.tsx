import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { BRAND } from "@/config/brand";
import { ArrowRight, Star, Clock, Smartphone, CreditCard } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export function Hero() {
  return (
    <Section className="min-h-[90vh] flex flex-col justify-center pt-28 md:pt-32 pb-12 md:pb-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] md:w-[500px] h-[400px] md:h-[500px] bg-secondary/30 blur-[120px] rounded-full -z-10 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[250px] md:w-[300px] h-[250px] md:h-[300px] bg-accent/5 blur-[80px] rounded-full -z-10" />

      <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-10 px-1">
        <FadeIn>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-3 mb-6 md:mb-8">
            <span className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
              <Star className="w-3.5 h-3.5" /> Rendu premium
            </span>
            <span className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-secondary text-foreground/80 text-xs font-medium">
              <Smartphone className="w-3.5 h-3.5" /> Mobile-first
            </span>
            <span className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-secondary text-foreground/80 text-xs font-medium">
              <Clock className="w-3.5 h-3.5" /> V1 en 72h
            </span>
            <span className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-secondary text-foreground/80 text-xs font-medium">
              <CreditCard className="w-3.5 h-3.5" /> {BRAND.SUB_PRICE}€/mois
            </span>
          </div>

          <h1 className="text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] mb-5 md:mb-6 text-foreground">
            Un site premium qui coûte{" "}
            <span className="text-accent relative whitespace-nowrap">
              moins qu'un logo.
              <svg 
                className="absolute w-full h-2 md:h-3 -bottom-0.5 md:-bottom-1 left-0 text-accent/30" 
                viewBox="0 0 100 10" 
                preserveAspectRatio="none"
              >
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl md:max-w-2xl mx-auto leading-relaxed">
            Des sites au rendu haut de gamme, livrés vite, pensés mobile-first — à un prix accessible.
          </p>
        </FadeIn>

        <FadeIn delay={0.15} className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center items-center pt-2 md:pt-4">
          <Button 
            size="lg" 
            className="text-base font-semibold px-8 h-14 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg shadow-primary/20" 
            asChild
          >
            <a href="#wizard" data-testid="link-hero-cta-primary">
              Demander mon site <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-base font-medium px-8 h-14 w-full sm:w-auto rounded-full bg-background hover:bg-secondary/50 border-border" 
            asChild
          >
            <a href="#packs" data-testid="link-hero-cta-secondary">Voir les packs</a>
          </Button>
        </FadeIn>

        <FadeIn delay={0.25} className="pt-4 md:pt-6">
          <p className="text-sm text-muted-foreground/70">
            À partir de {BRAND.PRICING.PACK_LANDING}€ + abonnement mensuel
          </p>
        </FadeIn>
      </div>
    </Section>
  );
}
