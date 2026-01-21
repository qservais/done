import { cn } from "@/lib/utils";

interface DoneStampProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "subtle";
  className?: string;
}

export function DoneStamp({ size = "md", variant = "default", className }: DoneStampProps) {
  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-3 py-1",
    lg: "text-sm px-4 py-1.5",
  };

  const variantClasses = {
    default: "bg-accent text-white",
    outline: "border-2 border-accent text-accent bg-transparent",
    subtle: "bg-accent/10 text-accent",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-bold tracking-widest uppercase rounded-full",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      DONE
    </span>
  );
}

export function DoneSignature({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs text-muted-foreground">made by</span>
      <DoneStamp size="sm" variant="subtle" />
    </div>
  );
}
