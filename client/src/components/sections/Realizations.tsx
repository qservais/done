import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

// Placeholder data as requested
const projects = [
  { name: "Maison Vagabonde", url: "https://maisonvagabonde.be/", type: "Vitrine" },
  { name: "Aste Esthétique", url: "https://aste-esthetique.be/", type: "Beauté" },
  { name: "Dissocle", url: "https://dissocle.space/", type: "Architecture" },
  { name: "Mouv'Up", url: "http://mouvup.be/", type: "Sport" },
  { name: "Examtir", url: "https://examtir.be/", type: "Formation" },
  { name: "Valoriser Mon Entreprise", url: "https://valorisermonentreprise.be/", type: "Corporate" },
];

export function Realizations() {
  return (
    <Section id="realizations" className="bg-secondary/20">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Réalisations</h2>
          <p className="text-muted-foreground">Quelques projets récents.</p>
        </div>
        <Button variant="outline" asChild>
          <a href="/realisations">Voir tout</a>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <a
            key={index}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-background border border-border rounded-xl overflow-hidden hover:border-accent transition-colors"
          >
            <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-accent/5 transition-colors">
              {/* In a real app, use an image here. For now, a placeholder. */}
              <span className="font-serif italic text-lg">{project.name}</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold">{project.name}</h3>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{project.type}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}
