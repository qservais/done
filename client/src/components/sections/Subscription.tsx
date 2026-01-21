import { Section } from "@/components/ui/section";
import { Check, ShieldCheck, RefreshCw, Server, LifeBuoy } from "lucide-react";
import { BRAND } from "@/config/brand";
import { FadeIn, StaggerChildren } from "@/components/ui/fade-in";

export function Subscription() {
  return (
    <Section className="bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            On ne pose pas un site et on disparaît.
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Le suivi (inclus) qui vous garantit un site toujours en bonne santé.
          </p>
        </FadeIn>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto backdrop-blur-sm">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-white/10 pb-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-1">Abonnement {BRAND.STUDIO_NAME}</h3>
                <p className="text-primary-foreground/60 text-sm">Tout inclus, sans mauvaise surprise</p>
              </div>
              <div className="text-center md:text-right">
                <span className="text-4xl font-bold text-accent">{BRAND.SUB_PRICE}€</span>
                <span className="text-primary-foreground/60 text-sm">/mois</span>
              </div>
           </div>

           <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="space-y-4">
                 <h4 className="font-bold text-white flex items-center gap-2">
                   <Server className="w-5 h-5 text-accent" /> Technique
                 </h4>
                 <ul className="space-y-3 text-sm text-primary-foreground/80">
                   <li className="flex gap-3"><Check className="w-4 h-4 text-accent/70 mt-0.5" /> Hébergement & surveillance 24/7</li>
                   <li className="flex gap-3"><Check className="w-4 h-4 text-accent/70 mt-0.5" /> Sauvegardes automatiques</li>
                   <li className="flex gap-3"><Check className="w-4 h-4 text-accent/70 mt-0.5" /> Sécurité & mises à jour</li>
                 </ul>
              </div>

              <div className="space-y-4">
                 <h4 className="font-bold text-white flex items-center gap-2">
                   <LifeBuoy className="w-5 h-5 text-accent" /> Accompagnement
                 </h4>
                 <ul className="space-y-3 text-sm text-primary-foreground/80">
                   <li className="flex gap-3"><Check className="w-4 h-4 text-accent/70 mt-0.5" /> 2 demandes d’ajustements / mois</li>
                   <li className="flex gap-3"><Check className="w-4 h-4 text-accent/70 mt-0.5" /> Réponse sous {BRAND.SLA_HOURS}h</li>
                   <li className="flex gap-3"><Check className="w-4 h-4 text-accent/70 mt-0.5" /> Petits changements business</li>
                 </ul>
              </div>
           </StaggerChildren>

           <FadeIn delay={0.3} className="mt-8 pt-6 border-t border-white/5 text-xs text-primary-foreground/50 text-center">
             <p className="mb-2">* Chaque demande couvre un lot de changements raisonnables (jusqu’à 30 min) + 1 aller-retour.</p>
             <p>Si votre site explose en trafic (tant mieux), on ajuste la solution avec vous.</p>
           </FadeIn>
        </div>
      </div>
    </Section>
  );
}
