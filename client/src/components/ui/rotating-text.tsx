import { useState, useEffect } from "react";

const comparisons = [
  "moins qu'un logo.",
  "moins qu'un voyage à Paris.",
  "moins qu'un iPhone.",
  "moins qu'une PS5.",
  "moins qu'un lave-vaisselle.",
  "moins qu'un loyer.",
  "moins qu'un mois de courses.",
  "moins qu'un set de pneus.",
  "moins qu'un entretien voiture.",
];

type Phase = "typing" | "pausing" | "deleting";

export function RotatingText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const currentPhrase = comparisons[currentIndex];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(currentPhrase);
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % comparisons.length);
      }, 4000);
      return () => clearInterval(interval);
    }

    let timeout: NodeJS.Timeout;

    switch (phase) {
      case "typing":
        if (displayedText.length < currentPhrase.length) {
          timeout = setTimeout(() => {
            setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
          }, 45);
        } else {
          setPhase("pausing");
        }
        break;

      case "pausing":
        timeout = setTimeout(() => {
          setPhase("deleting");
        }, 2500);
        break;

      case "deleting":
        if (displayedText.length > 0) {
          timeout = setTimeout(() => {
            setDisplayedText((prev) => prev.slice(0, -1));
          }, 25);
        } else {
          setCurrentIndex((prev) => (prev + 1) % comparisons.length);
          setPhase("typing");
        }
        break;
    }

    return () => clearTimeout(timeout);
  }, [displayedText, phase, currentPhrase, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <span className="animate-fade-in">{displayedText}</span>;
  }

  return (
    <>
      {displayedText}
      <span 
        className="inline-block w-[2px] h-[0.85em] bg-accent ml-0.5 align-baseline animate-blink"
      />
    </>
  );
}
