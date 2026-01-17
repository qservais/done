import { Section } from "@/components/ui/section";
import { Check, X } from "lucide-react";
import { FadeIn, StaggerChildren } from "@/components/ui/fade-in";

export function Maintenance() {
  return (
    <Section className="bg-background">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <FadeIn direction="right">
            <h2 className="text-3xl font-serif font-bold mb-6">Tickets & Maintenance</h2>
            <div className="prose prose-lg text-muted-foreground">
              <p className="mb-4">
                On parle français simple. Pas de jargon technique pour noyer le poisson.
              </p>
              <ul className="space-y-2 list-none pl-0">
                <li className="flex items-center gap-2"><strong className="text-foreground">2 tickets/mois</strong> inclus</li>
                <li className="flex items-center gap-2"><strong className="text-foreground">Max 30 min</strong> par ticket</li>
                <li className="flex items-center gap-2">1 aller-retour de corrections inclus</li>
                <li className="flex items-center gap-2">Tickets cumulables sur 1 mois max</li>
              </ul>
            </div>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 gap-6">
            <FadeIn className="bg-green-500/5 border border-green-500/20 p-6 rounded-xl">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-green-700 dark:text-green-400">
                <Check className="w-5 h-5" /> Inclus
              </h3>
              <p className="text-sm text-muted-foreground">
                Textes, images, changements de couleurs simples, liens, CTA, champs de formulaire basiques, ajustements d'animations existantes.
              </p>
            </FadeIn>
            
            <FadeIn className="bg-red-500/5 border border-red-500/20 p-6 rounded-xl">
               <h3 className="font-bold mb-4 flex items-center gap-2 text-red-700 dark:text-red-400">
                <X className="w-5 h-5" /> Hors Scope (sur devis)
              </h3>
              <p className="text-sm text-muted-foreground">
                Nouvelles fonctionnalités complexes (espace membre, paiement), refonte majeure du design, rédaction d'articles, tracking avancé.
              </p>
            </FadeIn>
          </StaggerChildren>
       </div>
    </Section>
  );
}
