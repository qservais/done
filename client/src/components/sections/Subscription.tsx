import { Section } from "@/components/ui/section";
import { Check, Server, LifeBuoy, AlertTriangle } from "lucide-react";
import { BRAND } from "@/config/brand";
import { FadeIn } from "@/components/ui/fade-in";

const techFeatures = [
  "Hébergement & surveillance 24/7",
  "Sauvegardes automatiques",
  "Sécurité & mises à jour",
];

const supportFeatures = [
  "2 évolutions ou ajustements/mois",
  "Réponse sous 48h",
  "Conseils & idées pour votre business",
];

export function Subscription() {
  return (
    <Section className="bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto">
        <FadeIn className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Votre partenaire digital, mois après mois.
          </h2>
          <p className="text-primary-foreground/70 text-sm md:text-lg max-w-xl mx-auto">
            On reste à vos côtés pour faire évoluer votre site au rythme de votre activité.
          </p>
        </FadeIn>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 max-w-3xl mx-auto backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-6 border-b border-white/10">
            <div className="text-center sm:text-left">
              <h3 className="text-xl md:text-2xl font-bold">Accompagnement {BRAND.STUDIO_NAME}</h3>
              <p className="text-primary-foreground/60 text-sm mt-1">Tout inclus, sans surprise</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl md:text-4xl font-bold text-white">{BRAND.SUB_PRICE}€</span>
              <span className="text-primary-foreground/60 text-sm">/mois</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <div>
              <h4 className="font-bold text-white flex items-center gap-2 mb-4">
                <Server className="w-5 h-5 text-accent" /> Technique
              </h4>
              <ul className="space-y-3">
                {techFeatures.map((feature, i) => (
                  <li key={i} className="flex gap-3 text-sm text-primary-foreground/80">
                    <Check className="w-4 h-4 text-accent/70 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white flex items-center gap-2 mb-4">
                <LifeBuoy className="w-5 h-5 text-accent" /> Accompagnement
              </h4>
              <ul className="space-y-3">
                {supportFeatures.map((feature, i) => (
                  <li key={i} className="flex gap-3 text-sm text-primary-foreground/80">
                    <Check className="w-4 h-4 text-accent/70 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-accent mb-1">Urgences prioritaires</p>
                <p className="text-xs text-primary-foreground/70">
                  Besoin urgent ? On est là. On intervient en priorité.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-primary-foreground/50">
              Chaque demande = jusqu'à 30 min + 1 aller-retour de validation.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
