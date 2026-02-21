import { Section } from "@/components/ui/section";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const TRUSTPILOT_URL = "https://fr-be.trustpilot.com/review/madebydone.be";
const TRUSTPILOT_SCORE = "5.0";
const TRUSTPILOT_REVIEW_COUNT = 5;

function TrustpilotStar({ index }: { index: number }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="w-7 h-7 md:w-8 md:h-8"
      fill="none"
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.4, ease: "easeOut" }}
    >
      <rect width="24" height="24" rx="2" fill="#00b67a" />
      <path
        d="M12 4l2.35 4.76 5.25.77-3.8 3.7.9 5.23L12 15.77l-4.7 2.69.9-5.23-3.8-3.7 5.25-.77L12 4z"
        fill="white"
      />
    </motion.svg>
  );
}

function TrustpilotLogo() {
  return (
    <span className="inline-flex items-center gap-1">
      <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5" fill="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#00b67a" />
      </svg>
      <span className="font-semibold text-sm md:text-base tracking-tight">Trustpilot</span>
    </span>
  );
}

export function Trustpilot() {
  return (
    <Section className="py-10 md:py-14">
      <motion.a
        href={TRUSTPILOT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-center gap-4 md:gap-5 max-w-md mx-auto text-center"
        data-testid="link-trustpilot"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center gap-1.5 text-muted-foreground/60">
          <span className="text-xs tracking-widest uppercase font-medium">Avis vérifiés sur</span>
          <TrustpilotLogo />
        </div>

        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <TrustpilotStar key={i} index={i} />
          ))}
        </div>

        <div className="space-y-1">
          <p className="text-2xl md:text-3xl font-bold" data-testid="text-trustpilot-score">
            {TRUSTPILOT_SCORE}<span className="text-muted-foreground/50 text-lg font-normal">/5</span>
          </p>
          <p className="text-sm text-muted-foreground" data-testid="text-trustpilot-count">
            Basé sur {TRUSTPILOT_REVIEW_COUNT} avis
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-sm text-accent font-medium group-hover:underline underline-offset-2 transition-colors">
          Voir les avis <ExternalLink className="w-3.5 h-3.5" />
        </span>
      </motion.a>
    </Section>
  );
}
