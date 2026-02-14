import { Section } from "@/components/ui/section";
import { MessageCircle, Palette, Rocket, Handshake } from "lucide-react";
import { FadeIn, StaggerChildren } from "@/components/ui/fade-in";

const steps = [
  {
    icon: MessageCircle,
    step: "01",
    title: "On écoute",
    description: "Vous nous parlez de votre activité, de vos clients, de ce qui vous rend unique. On comprend avant de proposer.",
  },
  {
    icon: Palette,
    step: "02",
    title: "On conçoit ensemble",
    description: "Design, structure, contenu : on vous propose une V1 en 72h et on ajuste ensemble jusqu'à ce que ça soit parfait.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "On lance",
    description: "Mise en ligne, domaine, performance, mobile : tout est réglé. Vous n'avez rien à gérer.",
  },
  {
    icon: Handshake,
    step: "04",
    title: "On reste",
    description: "Ajustements, évolutions, nouvelles idées : on est là chaque mois. Votre site grandit avec votre business.",
  },
];

export function Why() {
  return (
    <Section className="bg-secondary/30 py-12 md:py-16">
      <FadeIn className="text-center mb-10">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wide mb-4">
          Notre approche
        </span>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">Un accompagnement, pas juste un site</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">On ne livre pas un site pour disparaître. On construit une solution avec vous, et on avance ensemble.</p>
      </FadeIn>
      
      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 max-w-5xl mx-auto">
        {steps.map((item, index) => (
          <FadeIn
            key={index}
            className="bg-background p-5 md:p-6 rounded-xl border border-border/50 hover:border-accent/50 transition-colors relative"
          >
            <span className="text-4xl font-bold text-accent/10 absolute top-4 right-4">{item.step}</span>
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <item.icon className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-base md:text-lg font-bold mb-2">{item.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {item.description}
            </p>
          </FadeIn>
        ))}
      </StaggerChildren>
    </Section>
  );
}
