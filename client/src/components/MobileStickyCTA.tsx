import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const footerThreshold = documentHeight - windowHeight - 400;

      if (scrollY > 500 && scrollY < footerThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
                <a href="#wizard" data-testid="link-sticky-cta-primary" aria-label="Demander mon site">
                  Demander mon site <ArrowRight className="ml-1.5 w-4 h-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-4 text-sm font-medium rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                asChild
              >
                <a href="#packs" data-testid="link-sticky-cta-packs" aria-label="Voir les packs">Packs</a>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
