import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function FadeIn({ 
  children, 
  className = "",
}: FadeInProps) {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  );
}

export function StaggerChildren({ 
  children, 
  className = "" 
}: { 
  children: ReactNode; 
  staggerDelay?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
