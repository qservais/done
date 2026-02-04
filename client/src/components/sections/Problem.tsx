import { Section } from "@/components/ui/section";
import { Check } from "lucide-react";
import { problem } from "@/data/copy";

export function Problem() {
  return (
    <Section className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-32">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wide mb-4">
              {problem.label}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {problem.title}
            </h2>
          </div>

          <div>
            <div className="bg-background border border-border/60 rounded-3xl p-6 md:p-8 shadow-sm">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                {problem.intro}
              </p>

              <ul className="space-y-3 mb-8">
                {problem.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-center gap-3 text-foreground">
                    <span className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-accent" />
                    </span>
                    <span className="text-base md:text-lg font-medium">{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-border/60 pt-6 space-y-4">
                <p className="text-base md:text-lg font-semibold text-foreground leading-relaxed">
                  {problem.punchline}
                </p>
                <p className="text-base md:text-lg">
                  <span className="text-accent font-bold">done</span>
                  <span className="text-muted-foreground">{problem.solution.replace("done", "")}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
