import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/ui/section";
import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";
import { ExternalLink } from "lucide-react";
import { projects } from "@/data/projects";

export default function RealizationsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SEO
        title="Projets & études de cas — done"
        description="Avant/Après, choix UX, tracking, Ads. Des projets livrés vite, propres, mesurables."
        canonical="https://madebydone.be/realisations"
      />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: "Accueil", url: "https://madebydone.be" },
          { name: "Réalisations", url: "https://madebydone.be/realisations" }
        ]} 
      />
      
      <Header />
      <main className="pt-28 md:pt-32">
        <Section className="pb-20 md:pb-28">
          <div>
            <div className="max-w-3xl mb-16 md:mb-20">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Before → <span className="text-accent">Done.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Des sites vitrines, des landing pages et des projets sur-mesure.
                Chaque projet livré vite, propre, mesurable.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project, index) => (
              <div key={index}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-background border border-border rounded-2xl overflow-hidden hover:border-accent/50 transition-all hover:shadow-xl h-full"
                  data-testid={`link-project-page-${index}`}
                >
                  <div className="bg-secondary/30 rounded-t-xl overflow-hidden">
                    <div className="flex items-center gap-1.5 px-4 py-2.5 bg-secondary/50 border-b border-border/50">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                      <div className="flex-1 mx-3">
                        <div className="bg-background/80 rounded-md h-5 w-full max-w-[140px] mx-auto" />
                      </div>
                    </div>
                    
                    <div className={`aspect-[16/10] bg-gradient-to-br ${project.gradient} flex items-center justify-center relative`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-bold text-foreground/15 text-2xl md:text-3xl tracking-widest uppercase">
                          {project.name.split(' ')[0]}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                    </div>
                  </div>

                  <div className="p-5 md:p-6">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <h2 className="font-bold text-lg md:text-xl text-foreground group-hover:text-accent transition-colors">
                          {project.name}
                        </h2>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.tags.map((tag, i) => (
                            <span 
                              key={i}
                              className="px-2.5 py-1 bg-secondary text-muted-foreground text-xs font-medium rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground group-hover:bg-accent group-hover:text-white transition-all shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
