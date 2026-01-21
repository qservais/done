import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { BRAND } from "@/config/brand";
import { FadeIn, StaggerChildren } from "@/components/ui/fade-in";

const packs = [
  {
    name: "Landing Express",
    price: BRAND.PRICING.PACK_LANDING,
    description: "Pour démarrer proprement.",
    includesTitle: "INCLUS :",
    features: [
      "1 page claire et premium",
      "Sections essentielles",
      "Design mobile-first",
      "1 langue (FR)",
      "1 aller-retour inclus",
    ],
    extras: []
  },
  {
    name: "Vitrine Contact",
    price: BRAND.PRICING.PACK_VITRINE,
    popular: true,
    description: "Pour capter des clients.",
    includesTitle: "TOUT CE QU'IL Y A DANS LANDING EXPRESS",
    features: [],
    extras: [
      "Formulaire de contact efficace",
      "Réception directe par email",
      "Protection anti-spam"
    ]
  },
  {
    name: "Multi-page Premium",
    price: BRAND.PRICING.PACK_MULTIPAGE,
    description: "Pour tout expliquer.",
    includesTitle: "TOUT CE QU'IL Y A DANS VITRINE CONTACT",
    features: [],
    extras: [
      "Jusqu'à 5 pages complètes",
      "Animations légères premium",
      "SEO de base (structure clean)"
    ]
  },
];

export function Packs() {
  return (
    <Section id="packs" className="bg-background">
      <FadeIn className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Nos Packs</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Des offres cumulatives. Plus vous montez, plus vous avez de valeur.
        </p>
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {packs.map((pack, index) => (
          <FadeIn
            key={index}
            className={`relative p-6 md:p-8 rounded-2xl flex flex-col ${
              pack.popular
                ? "border-2 border-accent bg-background shadow-xl scale-100 md:scale-105 z-10"
                : "border border-border bg-secondary/10"
            }`}
          >
            {pack.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
                Recommandé
              </span>
            )}

            <div className="mb-6 text-center border-b border-border pb-6">
              <h3 className="text-xl font-bold mb-2 text-foreground">{pack.name}</h3>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-4xl font-bold text-foreground">{pack.price}€</span>
              </div>
              <p className="text-muted-foreground text-sm">
                 {pack.description}
              </p>
            </div>

            <div className="flex-1 space-y-6 mb-8">
              {/* Main includes */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {pack.includesTitle}
                </p>
                
                {pack.features.length > 0 && (
                   <ul className="space-y-2">
                     {pack.features.map((feature, i) => (
                       <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
                         <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                         <span>{feature}</span>
                       </li>
                     ))}
                   </ul>
                )}
                
                {/* Extras for cumulative packs */}
                {pack.extras.length > 0 && (
                  <>
                     <div className="flex items-center gap-2 my-2">
                        <span className="h-px bg-border flex-1"></span>
                        <span className="text-xs font-bold text-accent uppercase">+ EN PLUS</span>
                        <span className="h-px bg-border flex-1"></span>
                     </div>
                     <ul className="space-y-2">
                       {pack.extras.map((extra, i) => (
                         <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-foreground">
                           <Plus className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                           <span>{extra}</span>
                         </li>
                       ))}
                     </ul>
                  </>
                )}
              </div>
            </div>

            <Button
              className={`w-full rounded-full py-6 font-semibold ${
                pack.popular 
                  ? "bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20" 
                  : "bg-white text-foreground border-2 border-border hover:border-foreground/20 hover:bg-secondary/20"
              }`}
              variant={pack.popular ? "default" : "outline"}
              asChild
            >
              <a href="#wizard">Choisir ce pack</a>
            </Button>
          </FadeIn>
        ))}
      </StaggerChildren>
    </Section>
  );
}
