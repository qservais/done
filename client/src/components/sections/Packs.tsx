import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Sparkles } from "lucide-react";
import { FadeIn, StaggerChildren } from "@/components/ui/fade-in";
import { trackPackSelect } from "@/lib/tracking";
import { packs, MODULE_PRICES } from "@/data/pricing";

const surMesureFeatures = [
  "Connexion CRM & outils métier",
  "Espace client / membres",
  "Multi-langue avancé",
  "Automatisations & intégrations",
  "Fonctionnalités sur mesure",
  "Architecture complexe",
];

export function Packs() {
  return (
    <Section id="packs" className="bg-background">
      <FadeIn className="text-center mb-12 md:mb-16">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Nos Packs</h2>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
          Choisissez la prestation adaptée à votre projet. Tous les prix sont HTVA.
        </p>
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
        {packs.map((pack) => (
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
                Populaire
              </span>
            )}

            <div className="mb-5 md:mb-6 text-center border-b border-border pb-5 md:pb-6">
              <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">{pack.name}</h3>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-3xl md:text-4xl font-bold text-foreground">{pack.price}€</span>
                <span className="text-sm text-muted-foreground ml-1">HTVA</span>
              </div>
              <p className="text-muted-foreground text-sm">{pack.description}</p>
            </div>

            <div className="flex-1 space-y-4 mb-6 md:mb-8">
              <ul className="space-y-2.5">
                {pack.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${pack.popular ? "text-accent" : "text-primary"}`} />
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
              <a
                href="/devis"
                className="flex items-center justify-center gap-1.5"
                data-testid={`link-pack-${pack.id}`}
                onClick={() => trackPackSelect(pack.name, pack.price)}
              >
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
                <a
                  href="/devis"
                  className="flex items-center justify-center gap-1.5"
                  data-testid="link-pack-surmesure"
                  onClick={() => trackPackSelect("Sur mesure", 0)}
                >
                  Discutons-en <ChevronRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.4} className="text-center mt-8 md:mt-10 space-y-2">
        <p className="text-sm text-muted-foreground">
          + Module mensuel dès {MODULE_PRICES.essentiel.toFixed(2).replace(".", ",")}€/mois (hébergement, maintenance, ajustements)
        </p>
        <p className="text-xs text-muted-foreground/50 italic">
          Pas de blabla. Du concret.
        </p>
      </FadeIn>
    </Section>
  );
}
