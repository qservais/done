import { Section } from "@/components/ui/section";
import { Zap, Layout, Search } from "lucide-react";
import { FadeIn, StaggerChildren } from "@/components/ui/fade-in";

const features = [
  {
    icon: Layout,
    title: "Pas de blabla",
    description: "Une structure claire, pensée pour la conversion. On va droit au but.",
  },
  {
    icon: Zap,
    title: "Rapide (72h)",
    description: "Votre V1 prête en un temps record. On ne traîne pas.",
  },
  {
    icon: Search,
    title: "Propre & SEO",
    description: "Code clean, performance maximale et bases SEO solides incluses.",
  },
];

export function Why() {
  return (
    <Section className="bg-secondary/30">
      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FadeIn
            key={index}
            className="bg-background p-8 rounded-xl border border-border/50 hover:border-accent/50 transition-colors shadow-sm"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-6 text-accent-foreground">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </FadeIn>
        ))}
      </StaggerChildren>
    </Section>
  );
}
