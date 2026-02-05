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
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const currentPhrase = comparisons[currentIndex];

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isTyping) {
      if (displayedText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
        }, 60);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
        }, 40);
      } else {
        setCurrentIndex((prev) => (prev + 1) % comparisons.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, currentPhrase]);

  return (
    <>
      {displayedText}
      <span className="inline-block w-[2px] h-[0.85em] bg-accent ml-0.5 align-baseline animate-blink" />
    </>
  );
}
