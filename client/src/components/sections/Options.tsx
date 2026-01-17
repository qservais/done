import { Section } from "@/components/ui/section";

const options = [
  { label: "Formulaire multi-étapes", price: "149€" },
  { label: "Page supplémentaire", price: "99€" },
  { label: "Langue supplémentaire (>2)", price: "99€" },
  { label: "SEO avancé", price: "249€" },
  { label: "Tracking / Datalayer", price: "199€" },
  { label: "Newsletter setup", price: "149€" },
  { label: "E-commerce Shopify", price: "749€" },
];

export function Options() {
  return (
    <Section className="border-t border-border">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-serif font-bold mb-8 text-center">Options à la carte</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          {options.map((opt, index) => (
            <div key={index} className="flex justify-between items-center py-3 border-b border-border/50">
              <span className="text-foreground">{opt.label}</span>
              <span className="font-bold text-muted-foreground text-sm">à partir de {opt.price}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-muted-foreground mt-8 text-sm italic">
          “Si c’est clair et simple, on fixe un prix. Si c’est du sur-mesure, on chiffre.”
        </p>
      </div>
    </Section>
  );
}
