import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { FadeIn, StaggerChildren } from "@/components/ui/fade-in";

// Data placeholders for thumbnails - using gradient divs as requested placeholder if no images
const projects = [
  { name: "Maison Vagabonde", url: "https://maisonvagabonde.be/", type: "Vitrine", color: "from-amber-200 to-yellow-400" },
  { name: "Aste Esthétique", url: "https://aste-esthetique.be/", type: "Beauté", color: "from-pink-200 to-rose-400" },
  { name: "Dissocle", url: "https://dissocle.space/", type: "Architecture", color: "from-slate-200 to-slate-400" },
  { name: "Mouv'Up", url: "http://mouvup.be/", type: "Sport", color: "from-blue-200 to-cyan-400" },
  { name: "Examtir", url: "https://examtir.be/", type: "Formation", color: "from-emerald-200 to-green-400" },
  { name: "Valoriser Mon Entreprise", url: "https://valorisermonentreprise.be/", type: "Corporate", color: "from-indigo-200 to-purple-400" },
];

export function Realizations() {
  return (
    <Section id="realizations" className="bg-secondary/20">
      <FadeIn className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Nos clients</h2>
          <p className="text-muted-foreground">Ils sont en ligne, et ils sont contents.</p>
        </div>
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <FadeIn key={index}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-background border border-border rounded-2xl overflow-hidden hover:border-accent transition-all hover:shadow-lg"
            >
              {/* Thumbnail Placeholder */}
              <div className={`aspect-[4/3] bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                <span className="font-bold text-white text-lg opacity-50 mix-blend-overlay uppercase tracking-widest">{project.name}</span>
                
                {/* Simulated browser UI */}
                <div className="absolute top-4 left-4 flex gap-1.5 opacity-60">
                   <div className="w-2 h-2 rounded-full bg-black/30" />
                   <div className="w-2 h-2 rounded-full bg-black/30" />
                   <div className="w-2 h-2 rounded-full bg-black/30" />
                </div>
              </div>

              <div className="p-5 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-base group-hover:text-accent transition-colors">{project.name}</h3>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{project.type}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground group-hover:bg-accent group-hover:text-white transition-all">
                   <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </a>
          </FadeIn>
        ))}
      </StaggerChildren>
    </Section>
  );
}
