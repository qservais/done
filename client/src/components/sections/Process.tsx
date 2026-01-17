import { Section } from "@/components/ui/section";

const steps = [
  {
    number: "01",
    title: "Qualification",
    description: "Formulaire simple, on vérifie que c'est faisable."
  },
  {
    number: "02",
    title: "Contenu",
    description: "Vous envoyez le logo, les photos et les textes."
  },
  {
    number: "03",
    title: "V1 en 48h",
    description: "On construit le site mobile-first."
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
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Comment ça marche ?</h2>
        <p className="text-muted-foreground text-lg">On va vite, mais on va propre.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative p-6 border-l border-border hover:border-accent transition-colors pl-8">
            <span className="text-6xl font-serif font-bold text-muted/40 absolute -top-4 left-4 -z-10 select-none">
              {step.number}
            </span>
            <h3 className="text-xl font-bold mb-2 pt-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
