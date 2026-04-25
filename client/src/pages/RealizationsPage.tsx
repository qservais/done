import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/ui/section";
import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";
import { ExternalLink, Star } from "lucide-react";
import { projects } from "@/data/projects";
import { FadeIn } from "@/components/ui/fade-in";
import { MadeByDoneBadge } from "@/components/signature";
import { trackProjectClick } from "@/lib/tracking";
import { useState } from "react";

const ALL_TAGS = ["Tous", ...Array.from(new Set(projects.flatMap(p => p.tags))).sort()];

export default function RealizationsPage() {
  const [activeTag, setActiveTag] = useState("Tous");

  const filtered = activeTag === "Tous"
    ? projects
    : projects.filter(p => p.tags.includes(activeTag));

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SEO
        title="Réalisations — done. · Sites web Belgique"
        description="19+ sites livrés pour des restaurants, artisans, médecins et commerces belges. Mobile-first, rapide, premium."
        canonical="https://madebydone.be/realisations"
      />
      <StructuredData type="localBusiness" />
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
          <FadeIn>
            <div className="max-w-3xl mb-10 md:mb-14">
              <p className="text-xs tracking-widest uppercase font-medium text-muted-foreground/60 mb-4">Réalisations</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Before → <span className="text-accent">Done.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                {projects.length} projets livrés — restaurants, artisans, médecins, commerces.
                Mobile-first, propres, mesurables.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-2 mb-10 md:mb-12">
              {ALL_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    activeTag === tag
                      ? "bg-accent text-white border-accent"
                      : "bg-background text-muted-foreground border-border hover:border-accent/50 hover:text-accent"
                  }`}
                  data-testid={`filter-${tag.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filtered.map((project, index) => (
              <FadeIn key={project.name} delay={index * 0.04}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-background border border-border rounded-2xl overflow-hidden hover:border-accent/50 transition-all hover:shadow-xl hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 h-full"
                  data-testid={`link-project-page-${index}`}
                  onClick={() => trackProjectClick(project.name, project.url)}
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
                    <div className={`aspect-[16/10] bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}>
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-all duration-500 motion-reduce:group-hover:scale-100 project-preview"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-bold text-foreground/15 text-2xl md:text-3xl tracking-widest uppercase">
                            {project.name.split(' ')[0]}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                      {project.hasReview && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-accent text-[10px] font-semibold px-2 py-1 rounded-full shadow-sm">
                          <Star className="w-3 h-3 text-accent" fill="currentColor" />
                          <span>Avis 5/5</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-5 md:p-6">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <h2 className="font-bold text-base md:text-lg text-foreground group-hover:text-accent transition-colors truncate">
                          {project.name}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 mt-2.5">
                          {project.tags.map((tag, i) => (
                            <button
                              key={i}
                              onClick={e => { e.preventDefault(); setActiveTag(tag); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                              className="px-2.5 py-0.5 bg-secondary text-muted-foreground text-xs font-medium rounded-full hover:bg-accent/10 hover:text-accent transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                          <MadeByDoneBadge variant="subtle" />
                        </div>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-foreground group-hover:bg-accent group-hover:text-white transition-all shrink-0 mt-0.5">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>

          {filtered.length === 0 && (
            <FadeIn>
              <div className="text-center py-20 text-muted-foreground">
                Aucun projet dans cette catégorie pour l'instant.
              </div>
            </FadeIn>
          )}

          <FadeIn delay={0.3} className="mt-14 text-center">
            <p className="text-xs text-muted-foreground/40 italic">
              Tous les projets sont livrés par done — mobile-first, hébergés, maintenus.
            </p>
          </FadeIn>
        </Section>
      </main>
      <Footer />

      <style>{`
        .project-preview {
          filter: grayscale(100%) sepia(15%) saturate(200%) hue-rotate(180deg) brightness(0.95);
          transition: filter 0.5s ease, transform 0.3s ease;
        }
        .group:hover .project-preview {
          filter: none;
        }
      `}</style>
    </div>
  );
}
