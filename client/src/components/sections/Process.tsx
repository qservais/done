import { Section } from "@/components/ui/section";
import { FadeIn, StaggerChildren } from "@/components/ui/fade-in";

const steps = [
  {
    number: "01",
    title: "Qualification",
    description: "Formulaire simple, on vérifie que c'est faisable."
  },
  {
    number: "02",
    title: "Contenu",
    description: "Vous n'avez rien ? Pas de souci. On cadre l'essentiel ensemble."
  },
  {
    number: "03",
    title: "V1 en 72h",
    description: "On construit le site mobile-first. Rapide et sérieux."
  },
  {
    number: "04",
    title: "Mise en ligne",
    description: "Un round de corrections, et c'est live."
  }
];

export function Process() {
  return (
    <Section id="process" className="bg-background">
      <FadeIn className="mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Comment ça marche ?</h2>
        <p className="text-muted-foreground text-lg">Rapide, oui. Bâclé, jamais.</p>
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <FadeIn key={index} className="relative p-6 border-l border-border hover:border-accent transition-colors pl-8">
            <span className="text-6xl font-serif font-bold text-muted/20 absolute -top-4 left-4 -z-10 select-none">
              {step.number}
            </span>
            <h3 className="text-xl font-bold mb-2 pt-2">{step.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
          </FadeIn>
        ))}
      </StaggerChildren>
    </Section>
  );
}
