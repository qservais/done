import { Section } from "@/components/ui/section";
import { Zap, Layout, Search, CheckCircle } from "lucide-react";
import { FadeIn, StaggerChildren } from "@/components/ui/fade-in";

const features = [
  {
    icon: Layout,
    title: "Pas de blabla",
    description: "Structure claire, pensée pour la conversion.",
  },
  {
    icon: Zap,
    title: "V1 en 72h",
    description: "Votre site prêt en un temps record.",
  },
  {
    icon: Search,
    title: "Propre & SEO",
    description: "Code clean, performance maximale.",
  },
  {
    icon: CheckCircle,
    title: "Tout compris",
    description: "Hébergement, maintenance, ajustements.",
  },
];

export function Why() {
  return (
    <Section className="bg-secondary/30 py-12 md:py-16">
      <FadeIn className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Comment ça marche ?</h2>
        <p className="text-muted-foreground">Rapide, oui. Bâclé, jamais.</p>
      </FadeIn>
      
      <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {features.map((feature, index) => (
          <FadeIn
            key={index}
            className="bg-background p-5 md:p-6 rounded-xl border border-border/50 hover:border-accent/50 transition-colors text-center"
          >
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mb-4 mx-auto">
              <feature.icon className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-base md:text-lg font-bold mb-1">{feature.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {feature.description}
            </p>
          </FadeIn>
        ))}
      </StaggerChildren>
    </Section>
  );
}
