import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { BRAND } from "@/config/brand";
import { ArrowRight, Star, Clock, Smartphone, CreditCard } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export function Hero() {
  return (
    <Section className="min-h-[90vh] flex flex-col justify-center pt-28 md:pt-32 pb-16 md:pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-secondary/20 blur-[150px] rounded-full -z-10 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-4xl mx-auto text-center space-y-10 md:space-y-12 px-1">
        <FadeIn>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2.5 sm:gap-3 mb-8 md:mb-10">
            <span className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wide">
              <Star className="w-3.5 h-3.5" /> Rendu premium
            </span>
            <span className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-secondary text-foreground/70 text-xs font-medium">
              <Smartphone className="w-3.5 h-3.5" /> Mobile-first
            </span>
            <span className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-secondary text-foreground/70 text-xs font-medium">
              <Clock className="w-3.5 h-3.5" /> V1 en 72h
            </span>
            <span className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-secondary text-foreground/70 text-xs font-medium">
              <CreditCard className="w-3.5 h-3.5" /> {BRAND.SUB_PRICE}€/mois
            </span>
          </div>

          <h1 className="text-[2.25rem] sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 md:mb-8 text-foreground">
            Web. Ads. Tracking.{" "}
            <span className="relative inline-block">
              <span className="text-accent">Done.</span>
              <svg 
                className="absolute w-full h-3 md:h-4 -bottom-1 md:-bottom-2 left-0 text-accent" 
                viewBox="0 0 100 12" 
                preserveAspectRatio="none"
              >
                <path 
                  d="M0 8 Q 25 2 50 8 T 100 8" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  fill="none" 
                  opacity="0.4"
                />
              </svg>
            </span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl md:max-w-2xl mx-auto leading-relaxed">
            Sites rapides, landing pages, Google Ads, Meta Ads et tracking GA4.
            <br className="hidden sm:block" />
            <span className="text-foreground/80 font-medium">Simple, beau, efficace.</span>
          </p>
        </FadeIn>

        <FadeIn delay={0.15} className="flex flex-col gap-3.5 sm:flex-row sm:gap-4 justify-center items-center pt-2 md:pt-4">
          <Button 
            size="lg" 
            className="text-base font-semibold px-8 h-14 w-full sm:w-auto bg-accent text-white hover:bg-accent/90 rounded-full shadow-lg shadow-accent/20" 
            asChild
          >
            <a href="#wizard" data-testid="link-hero-cta-primary">
              Démarrer mon projet <ArrowRight className="ml-2 w-4 h-4" />
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

        <FadeIn delay={0.25} className="pt-6 md:pt-8">
          <p className="text-sm text-muted-foreground/60">
            À partir de {BRAND.PRICING.PACK_LANDING}€ + abonnement mensuel
          </p>
        </FadeIn>
      </div>
    </Section>
  );
}
