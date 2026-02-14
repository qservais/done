import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Sparkles } from "lucide-react";
import { BRAND } from "@/config/brand";
import { FadeIn, StaggerChildren } from "@/components/ui/fade-in";
import { trackPackSelect } from "@/lib/tracking";

const packs = [
  {
    id: "landing",
    name: "Landing Express",
    price: BRAND.PRICING.PACK_LANDING,
    description: "Pour démarrer proprement.",
    features: [
      "1 page claire et premium",
      "Sections essentielles",
      "Design mobile-first",
      "1 langue (FR)",
      "1 aller-retour inclus",
    ],
  },
  {
    id: "vitrine",
    name: "Vitrine Contact",
    price: BRAND.PRICING.PACK_VITRINE,
    popular: true,
    description: "Pour capter des clients.",
    includesPrevious: "Landing Express",
    features: [
      "Formulaire de contact efficace",
      "Réception directe par email",
      "Protection anti-spam",
    ],
  },
  {
    id: "multipage",
    name: "Multi-page Premium",
    price: BRAND.PRICING.PACK_MULTIPAGE,
    description: "Pour tout expliquer.",
    includesPrevious: "Vitrine Contact",
    features: [
      "Jusqu'à 5 pages complètes",
      "Animations légères premium",
      "SEO de base (structure clean)",
    ],
  },
];

const surMesureFeatures = [
  "E-commerce / Webshop",
  "Connexion CRM & outils métier",
  "Réservation en ligne",
  "Espace client / membres",
  "Multi-langue avancé",
  "Fonctionnalités sur mesure",
];

export function Packs() {
  return (
    <Section id="packs" className="bg-background">
      <FadeIn className="text-center mb-12 md:mb-16">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Nos Packs</h2>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
          Des offres cumulatives. Plus vous montez, plus vous avez de valeur.
        </p>
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
        {packs.map((pack, index) => (
          <FadeIn
            key={pack.id}
            className={`relative p-5 md:p-6 lg:p-8 rounded-2xl flex flex-col ${
              pack.popular
                ? "border-2 border-accent bg-background shadow-xl md:scale-105 z-10"
                : "border border-border bg-secondary/5"
            }`}
          >
            {pack.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
                Recommandé
              </span>
            )}

            <div className="mb-5 md:mb-6 text-center border-b border-border pb-5 md:pb-6">
              <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">{pack.name}</h3>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-3xl md:text-4xl font-bold text-foreground">{pack.price}€</span>
              </div>
              <p className="text-muted-foreground text-sm">{pack.description}</p>
            </div>

            <div className="flex-1 space-y-4 mb-6 md:mb-8">
              {pack.includesPrevious && (
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-accent flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    Tout ce qu'il y a dans {pack.includesPrevious}
                  </p>
                </div>
              )}

              <ul className="space-y-2.5">
                {pack.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${pack.includesPrevious ? 'text-accent' : 'text-primary'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              className={`w-full rounded-full py-5 md:py-6 font-semibold text-sm md:text-base ${
                pack.popular
                  ? "bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20"
                  : "bg-white text-foreground border-2 border-border hover:border-foreground/20 hover:bg-secondary/20"
              }`}
              variant={pack.popular ? "default" : "outline"}
              asChild
            >
              <a href="#wizard" className="flex items-center justify-center gap-1.5" data-testid={`link-pack-${pack.id}`} onClick={() => trackPackSelect(pack.name, pack.price)}>
                Choisir ce pack <ChevronRight className="w-4 h-4" />
              </a>
            </Button>
          </FadeIn>
        ))}
      </StaggerChildren>

      <FadeIn delay={0.3} className="max-w-5xl mx-auto mt-6 md:mt-8">
        <div className="relative p-5 md:p-8 rounded-2xl border border-border bg-gradient-to-br from-foreground/[0.02] to-accent/[0.04] overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <h3 className="text-lg md:text-xl font-bold">Sur mesure</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Votre projet va plus loin qu'un site vitrine ? On construit la solution ensemble, étape par étape.
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {surMesureFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-3 md:min-w-[180px]">
              <div className="text-center md:text-right">
                <span className="text-2xl md:text-3xl font-bold text-foreground">Sur devis</span>
                <p className="text-xs text-muted-foreground mt-1">Tarif adapté à vos besoins</p>
              </div>
              <Button
                className="w-full md:w-auto rounded-full px-8 py-5 font-semibold text-sm bg-foreground text-background hover:bg-foreground/90"
                asChild
              >
                <a href="#wizard" className="flex items-center justify-center gap-1.5" data-testid="link-pack-surmesure" onClick={() => trackPackSelect('Sur mesure', 0)}>
                  Discutons-en <ChevronRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.4} className="text-center mt-8 md:mt-10 space-y-2">
        <p className="text-sm text-muted-foreground">
          + Abonnement {BRAND.SUB_PRICE}€/mois (hébergement, maintenance, ajustements)
        </p>
        <p className="text-xs text-muted-foreground/50 italic">
          Pas de blabla. Du concret.
        </p>
      </FadeIn>
    </Section>
  );
}
