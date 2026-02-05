import { cn } from "@/lib/utils";

interface SkeletonSectionProps {
  type?: "wizard" | "cards" | "default";
  className?: string;
}

export function SkeletonSection({ type = "default", className }: SkeletonSectionProps) {
  if (type === "wizard") {
    return (
      <div className={cn("max-w-2xl mx-auto", className)}>
        <div className="bg-background border border-border rounded-2xl p-6 md:p-8 space-y-6">
          <div className="space-y-3">
            <div className="h-2 w-16 bg-secondary rounded-full animate-pulse" />
            <div className="h-6 w-3/4 bg-secondary rounded animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="h-12 w-full bg-secondary rounded-lg animate-pulse" />
            <div className="h-12 w-full bg-secondary rounded-lg animate-pulse" />
            <div className="h-12 w-full bg-secondary rounded-lg animate-pulse" />
          </div>
          <div className="h-12 w-full bg-accent/20 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-background border border-border rounded-xl p-6 space-y-4">
            <div className="w-12 h-12 bg-secondary rounded-full animate-pulse" />
            <div className="h-5 w-2/3 bg-secondary rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-secondary rounded animate-pulse" />
              <div className="h-3 w-4/5 bg-secondary rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="h-8 w-48 bg-secondary rounded animate-pulse mx-auto" />
      <div className="h-4 w-64 bg-secondary rounded animate-pulse mx-auto" />
    </div>
  );
}
