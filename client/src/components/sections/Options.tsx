import { Section } from "@/components/ui/section";
import { options } from "@/data/options";

export function Options() {
  return (
    <Section className="border-t border-border bg-secondary/10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">Options à la carte</h3>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Ajoutez des fonctionnalités selon vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {options.map((opt, index) => {
            const Icon = opt.icon;
            return (
              <div key={index}>
                <div className="bg-background border border-border rounded-xl p-5 md:p-6 h-full hover:border-accent/30 hover:shadow-sm transition-all" data-testid={`card-option-${index}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground text-sm md:text-base leading-tight">
                          {opt.label}
                        </h4>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full whitespace-nowrap">
                          à partir de {opt.price}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center text-muted-foreground mt-8 md:mt-10 text-sm">
          <p className="bg-background border border-border rounded-full px-5 py-2.5 inline-block">
            Si c'est clair et simple, on fixe un prix. Si c'est du sur-mesure, on chiffre.
          </p>
        </div>
      </div>
    </Section>
  );
}
