import { Section } from "@/components/ui/section";
import { FadeIn, StaggerChildren } from "@/components/ui/fade-in";
import { AlertCircle } from "lucide-react";

export function Problem() {
  return (
    <Section className="py-12 md:py-16">
      <FadeIn className="max-w-3xl mx-auto bg-secondary/30 rounded-2xl p-8 md:p-12 border border-secondary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
        
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
          Pourquoi tant d’indépendants repoussent leur site ?
        </h2>

        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>
            Pas par manque d’envie.
            Mais parce qu’on leur a vendu le web comme un truc :
          </p>
          <ul className="space-y-2 list-none pl-4 md:pl-0">
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" /> Trop cher
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" /> Trop long
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" /> Trop compliqué
            </li>
          </ul>
          <p className="font-medium text-foreground">
            Le problème n’est pas votre activité. C’est la façon dont on vous vend le web.
          </p>
          
          <div className="pt-4 border-t border-border mt-6">
            <p className="text-accent font-bold text-xl">
              done, c’est l’alternative : un site premium, simple, accessible.
            </p>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
