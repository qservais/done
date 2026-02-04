import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // Sur mobile ou reduced motion : rendu direct SANS motion.div
  if (isMobile || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Sur desktop : animations normales
  return (
    <motion.div
      initial={{ opacity: 0, y: direction === "up" ? 20 : direction === "down" ? -20 : 0, x: direction === "left" ? 20 : direction === "right" ? -20 : 0 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
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
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // Sur mobile ou reduced motion : rendu direct SANS motion.div
  if (isMobile || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
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
    </motion.div>
  );
}
