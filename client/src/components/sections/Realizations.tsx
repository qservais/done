import { Section } from "@/components/ui/section";
import { ExternalLink } from "lucide-react";
import { FadeIn, StaggerChildren } from "@/components/ui/fade-in";
import { projects } from "@/data/projects";
import { useRef } from "react";
import { MadeByDoneBadge, DoneStamp } from "@/components/signature";
import { trackProjectClick } from "@/lib/tracking";

export function Realizations() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <Section id="realizations" className="bg-secondary/20 overflow-hidden relative">
      <FadeIn className="mb-10 md:mb-12">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3">Nos clients</h2>
          <p className="text-muted-foreground text-sm md:text-base">Ils sont en ligne, et ils sont contents.</p>
        </div>
      </FadeIn>

      <div 
        ref={scrollRef}
        className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide"
      >
        {projects.map((project, index) => (
          <FadeIn 
            key={index}
            delay={index * 0.05}
            className="w-[85%] min-w-[280px] md:w-auto shrink-0 snap-start"
          >
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
                        <span 
                          key={i}
                          className="px-2 py-0.5 bg-secondary text-muted-foreground text-xs font-medium rounded-md"
                        >
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
        ))}
      </div>

      <FadeIn delay={0.3} className="mt-8 text-center">
        <p className="text-xs text-muted-foreground/50 italic">
          Exemple de rendus livrés par done — mobile-first.
        </p>
      </FadeIn>

      <div className="absolute bottom-8 right-8 hidden md:block">
        <DoneStamp size="md" />
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
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
