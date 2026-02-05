import { useState, useEffect } from "react";

const comparisons = [
  "moins qu'un logo.",
  "moins qu'un voyage à Paris.",
  "moins qu'un iPhone.",
  "moins qu'une PS5.",
  "moins qu'un lave-vaisselle.",
];

export function RotatingText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % comparisons.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span 
      className="transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {comparisons[currentIndex]}
    </span>
  );
}
