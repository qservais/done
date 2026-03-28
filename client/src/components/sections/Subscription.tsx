import { Section } from "@/components/ui/section";
import { Check, Zap, Shield, TrendingUp } from "lucide-react";
import { FadeIn, StaggerChildren } from "@/components/ui/fade-in";

const modules = [
  {
    id: "essentiel",
    name: "Module Essentiel",
    price: 5.90,
    description: "L'essentiel pour rester en ligne.",
    icon: Shield,
    features: [
      "Hébergement du site",
      "Sécurité & certificat SSL",
      "Sauvegardes automatiques",
      "Monitoring de disponibilité",
    ],
  },
  {
    id: "performance",
    name: "Module Performance",
    price: 19.90,
    popular: true,
    description: "Le suivi complet, mois après mois.",
    icon: Zap,
    features: [
      "Hébergement & sécurité",
      "Sauvegardes automatiques",
      "Maintenance & mises à jour",
      "Améliorations / ajustements",
      "Support sous 48h",
      "Conseils d'optimisation",
    ],
  },
  {
    id: "boost",
    name: "Module Google Boost",
    price: 49.90,
    description: "Pour dominer Google.",
    icon: TrendingUp,
    features: [
      "Tout ce qui est dans Performance",
      "Optimisation SEO continue",
      "Amélioration référencement Google",
      "Optimisation technique (vitesse)",
      "Conseils visibilité & positionnement",
    ],
  },
];

export function Subscription() {
  return (
    <Section className="bg-primary text-primary-foreground">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Votre partenaire digital, mois après mois.
          </h2>
          <p className="text-primary-foreground/70 text-sm md:text-lg max-w-xl mx-auto">
            Choisissez le module adapté à vos besoins. Engagement mensuel, sans frais cachés.
          </p>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <FadeIn
                key={mod.id}
                className={`relative rounded-2xl p-6 md:p-8 flex flex-col ${
                  mod.popular
                    ? "bg-white/10 border-2 border-white/40 shadow-xl md:scale-105 z-10"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {mod.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
                    Recommandé
                  </span>
                )}

                <div className="mb-6 pb-5 border-b border-white/10 text-center">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{mod.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-1">
                    <span className="text-3xl font-bold text-white">{mod.price.toFixed(2).replace(".", ",")}€</span>
                    <span className="text-primary-foreground/60 text-sm">/mois</span>
                  </div>
                  <p className="text-xs text-primary-foreground/50">HTVA</p>
                  <p className="text-sm text-primary-foreground/70 mt-2">{mod.description}</p>
                </div>

                <ul className="space-y-3 flex-1">
                  {mod.features.map((feature, i) => (
                    <li key={i} className="flex gap-3 text-sm text-primary-foreground/80">
                      <Check className="w-4 h-4 text-accent/80 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            );
          })}
        </StaggerChildren>

        <FadeIn delay={0.4} className="text-center mt-8 md:mt-10">
          <p className="text-xs text-primary-foreground/40">
            Tous les prix sont indiqués HTVA. Résiliation à tout moment avec 1 mois de préavis.
          </p>
        </FadeIn>
      </div>
    </Section>
  );
}
