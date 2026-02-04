import { ReactNode, lazy, Suspense, useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Lazy load Framer Motion uniquement sur desktop
const MotionDiv = lazy(() => 
  import('framer-motion').then(mod => ({ 
    default: mod.motion.div 
  }))
);

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  className = "",
  direction = "up" 
}: FadeInProps) {
  const isMobile = useIsMobile();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  // Sur mobile ou reduced motion : rendu direct SANS Framer Motion
  if (isMobile || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const y = direction === "up" ? 20 : direction === "down" ? -20 : 0;
  const x = direction === "left" ? 20 : direction === "right" ? -20 : 0;

  // Sur desktop : Framer Motion avec lazy loading
  return (
    <Suspense fallback={<div className={className}>{children}</div>}>
      <MotionDiv
        initial={{ opacity: 0, y, x }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, margin: "0px" }}
        transition={{ duration, delay, ease: "easeOut" }}
        className={className}
      >
        {children}
      </MotionDiv>
    </Suspense>
  );
}

export function StaggerChildren({ 
  children, 
  staggerDelay = 0.1,
  className = "" 
}: { 
  children: ReactNode; 
  staggerDelay?: number;
  className?: string;
}) {
  const isMobile = useIsMobile();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  // Sur mobile ou reduced motion : rendu direct SANS Framer Motion
  if (isMobile || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Suspense fallback={<div className={className}>{children}</div>}>
      <MotionDiv
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px" }}
        variants={{
          visible: {
            transition: {
              staggerChildren: staggerDelay
            }
          }
        }}
        className={className}
      >
        {children}
      </MotionDiv>
    </Suspense>
  );
}
