import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trackCTAClick } from "@/lib/tracking";

const HIDDEN_SECTIONS = ["packs", "wizard", "contact"];

export function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isInHiddenSection, setIsInHiddenSection] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const checkHiddenSections = () => {
      HIDDEN_SECTIONS.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  setIsInHiddenSection(true);
                } else {
                  const anyVisible = HIDDEN_SECTIONS.some((id) => {
                    const el = document.getElementById(id);
                    if (!el) return false;
                    const rect = el.getBoundingClientRect();
                    return rect.top < window.innerHeight && rect.bottom > 0;
                  });
                  setIsInHiddenSection(anyVisible);
                }
              });
            },
            { threshold: 0.1 }
          );
          observer.observe(section);
          observers.push(observer);
        }
      });
    };

    const timer = setTimeout(checkHiddenSections, 100);

    return () => {
      clearTimeout(timer);
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const footerThreshold = documentHeight - windowHeight - 400;

      if (scrollY > 500 && scrollY < footerThreshold && !isInHiddenSection) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isInHiddenSection]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="bg-foreground/95 backdrop-blur-lg border-t border-white/10 px-4 py-3" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
            <div className="flex gap-3 max-w-lg mx-auto">
              <Button
                size="lg"
                className="flex-1 h-12 text-sm font-semibold bg-accent text-white hover:bg-accent/90 rounded-full shadow-lg shadow-accent/20"
                asChild
              >
                <a href="/devis" data-testid="link-sticky-cta-primary" aria-label="Demander mon site" onClick={() => trackCTAClick('demander_site', 'sticky_mobile')}>
                  Demander mon site <ArrowRight className="ml-1.5 w-4 h-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-4 text-sm font-medium rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                asChild
              >
                <a href="#packs" data-testid="link-sticky-cta-packs" aria-label="Voir les packs" onClick={() => trackCTAClick('voir_packs', 'sticky_mobile')}>Packs</a>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
