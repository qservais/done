import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { BRAND } from "@/config/brand";

const packs = [
  {
    name: "Landing Express",
    price: BRAND.PRICING.PACK_EXPRESS,
    description: "L'essentiel pour exister en ligne.",
    features: [
      "1 page (jusqu'à 6 sections)",
      "Design premium mobile-first",
      "CTA (tel/mail/itinéraire)",
      "1 langue (FR)",
      "1 round de corrections",
    ],
  },
  {
    name: "Vitrine Contact",
    price: BRAND.PRICING.PACK_CONTACT,
    popular: true,
    description: "Pour capter des leads efficacement.",
    features: [
      "1 page (jusqu'à 8 sections)",
      "Formulaire simple + anti-spam",
      "Email de confirmation",
      "1 langue (FR)",
      "1 round de corrections",
    ],
  },
  {
    name: "Multi-page Premium",
    price: BRAND.PRICING.PACK_PREMIUM,
    description: "Pour présenter votre activité en détail.",
    features: [
      "Jusqu'à 5 pages",
      "Formulaire de contact",
      "Animations légères",
      "SEO de base (structure)",
      "1 round de corrections",
    ],
  },
];

export function Packs() {
  return (
    <Section id="packs">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Nos Packs</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Clairs, nets et précis. Tout le monde déteste les devis compliqués.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packs.map((pack, index) => (
          <div
            key={index}
            className={`relative p-8 rounded-2xl border ${
              pack.popular
                ? "border-accent bg-accent/5 shadow-lg scale-105 z-10"
                : "border-border bg-background"
            } flex flex-col`}
          >
            {pack.popular && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Populaire
              </span>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">{pack.name}</h3>
              <p className="text-muted-foreground text-sm min-h-[40px]">
                {pack.description}
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-muted-foreground">À partir de</span>
                <span className="text-4xl font-bold">{pack.price}€</span>
              </div>
              <span className="text-xs text-muted-foreground block mt-2">
                + abonnement (voir plus bas)
              </span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {pack.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <Check className="w-5 h-5 text-accent shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full rounded-full ${pack.popular ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}`}
              variant={pack.popular ? "default" : "outline"}
              asChild
            >
              <a href="#contact">Choisir ce pack</a>
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>Multilingue inclus : max 2 langues. • Au-delà / fonctionnalités avancées : sur devis.</p>
      </div>
    </Section>
  );
}
