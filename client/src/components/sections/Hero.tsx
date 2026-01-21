import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { motion } from "framer-motion";
import { BRAND } from "@/config/brand";
import { ArrowRight, Star, Clock, ShieldCheck, Smartphone } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export function Hero() {
  return (
    <Section className="min-h-[85vh] flex flex-col justify-center pt-32 pb-16 relative overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/30 blur-[120px] rounded-full -z-10 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 blur-[80px] rounded-full -z-10" />

      <div className="max-w-4xl mx-auto text-center space-y-10">
        <FadeIn>
          {/* Quick Proof Chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold tracking-wide">
                <Star className="w-3 h-3" /> Rendu premium
             </span>
             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background border border-border text-muted-foreground text-xs font-medium">
                <Smartphone className="w-3 h-3" /> Mobile-first
             </span>
             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background border border-border text-muted-foreground text-xs font-medium">
                <Clock className="w-3 h-3" /> V1 en 72h
             </span>
          </div>

          {/* New H1 Options - Option A selected as primary per brief instruction */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-foreground">
            Un site premium qui coûte <br className="hidden md:block" />
            <span className="text-accent relative inline-block">
              moins qu’un logo.
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
             Des sites au rendu haut de gamme, livrés vite, pensés mobile-first — à un prix accessible.
          </p>
        </FadeIn>

        <FadeIn delay={0.2} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button size="lg" className="text-base font-semibold px-8 h-12 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg shadow-primary/20" asChild>
            <a href="#wizard">Demander mon site <ArrowRight className="ml-2 w-4 h-4" /></a>
          </Button>
          <Button variant="outline" size="lg" className="text-base font-medium px-8 h-12 w-full sm:w-auto rounded-full bg-background hover:bg-secondary/50 border-border" asChild>
            <a href="#packs">Voir les packs</a>
          </Button>
        </FadeIn>

        <FadeIn delay={0.4} className="pt-6">
           <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
             <ShieldCheck className="w-4 h-4 text-accent" />
             <span className="opacity-80">Suivi & maintenance inclus</span>
           </p>
        </FadeIn>
      </div>
    </Section>
  );
}
