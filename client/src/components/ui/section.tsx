import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  containerClassName?: string;
}

export function Section({ id, className, children, containerClassName }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-24 px-4 w-full", className)}>
      <div className={cn("max-w-6xl mx-auto", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
