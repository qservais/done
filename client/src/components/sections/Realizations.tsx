import { Section } from "@/components/ui/section";
import { ExternalLink, Star, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { featuredProjects, projects } from "@/data/projects";
import { MadeByDoneBadge, DoneStamp } from "@/components/signature";
import { trackProjectClick } from "@/lib/tracking";
import { Link } from "wouter";

function ProjectCard({ project, index }: { project: typeof featuredProjects[0]; index: number }) {
  return (
    <FadeIn delay={index * 0.07}>
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block bg-background border border-border rounded-2xl overflow-hidden hover:border-accent/50 transition-all hover:shadow-lg hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 h-full"
        data-testid={`link-project-${index}`}
        aria-label={`Voir le site ${project.name}`}
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
                <span className="font-bold text-foreground/20 text-xl md:text-2xl tracking-widest uppercase">
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
        <div className="p-4 md:p-5">
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <h3 className="font-bold text-base md:text-lg text-foreground group-hover:text-accent transition-colors truncate">
                {project.name}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {project.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-secondary text-muted-foreground text-xs font-medium rounded-md">
                    {tag}
                  </span>
                ))}
                <MadeByDoneBadge variant="subtle" />
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-foreground group-hover:bg-accent group-hover:text-white transition-all shrink-0">
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </div>
      </a>
    </FadeIn>
  );
}

export function Realizations() {
  return (
    <Section id="realizations" className="bg-secondary/20 overflow-hidden relative">
      <FadeIn className="mb-10 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3">Nos clients</h2>
            <p className="text-muted-foreground text-sm md:text-base">Ils sont en ligne, et ils sont contents.</p>
          </div>
          <Link
            href="/realisations"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:opacity-75 transition-opacity shrink-0"
            data-testid="link-all-projects"
          >
            Voir tous nos projets <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {featuredProjects.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} />
        ))}
      </div>

      <FadeIn delay={0.4} className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-8">
        <p className="text-sm text-muted-foreground/60">
          +{projects.length} projets livrés — secteurs variés, Belgique & Luxembourg.
        </p>
        <Link
          href="/realisations"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border hover:border-accent hover:text-accent transition-all text-sm font-medium"
          data-testid="link-all-projects-bottom"
        >
          Toutes nos réalisations <ArrowRight className="w-4 h-4" />
        </Link>
      </FadeIn>

      <div className="absolute bottom-8 right-8 hidden md:block">
        <DoneStamp size="md" />
      </div>

      <style>{`
        .project-preview {
          filter: grayscale(100%) sepia(15%) saturate(200%) hue-rotate(180deg) brightness(0.95);
          transition: filter 0.5s ease, transform 0.3s ease;
        }
        .group:hover .project-preview {
          filter: none;
        }
      `}</style>
    </Section>
  );
}
