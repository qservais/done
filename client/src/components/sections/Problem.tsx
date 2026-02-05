import { Section } from "@/components/ui/section";
import { FadeIn } from "@/components/ui/fade-in";

export function Problem() {
  return (
    <Section className="py-12 md:py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <FadeIn>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wide mb-4">
              Le problème
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              Pourquoi autant d'indépendants repoussent leur site ?
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-6">
              Pas par manque d'envie. Juste parce qu'on leur a vendu le web comme un truc trop cher, trop long, trop compliqué.
            </p>
            <p className="text-foreground font-medium">
              <span className="text-accent font-bold">done</span>, c'est l'alternative : un site premium, simple, accessible.
            </p>
          </FadeIn>

          <FadeIn delay={0.15} className="relative">
            <div className="relative">
              <img 
                src="/mockups/maisonvagabonde.png" 
                alt="Exemple de site réalisé par done" 
                className="w-full h-auto rounded-2xl shadow-2xl"
                loading="lazy"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}
