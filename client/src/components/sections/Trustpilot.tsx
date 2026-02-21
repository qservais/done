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
    <svg viewBox="0 0 126 31" className="h-5 md:h-6" fill="currentColor">
      <path d="M33.3 11.6h-6.2l-1.9-5.9-1.9 5.9h-6.2l5 3.6-1.9 5.9 5-3.6 5-3.6-1.9-5.9zm-5.4 6l-.5-1.6-3.1 2.2 1.2-3.6-3.1-2.2h3.8l1.2-3.6.5 1.5v7.3z" />
      <path d="M48.7 10.2h-3.7V7.8h10.1v2.4h-3.7V21h-2.7V10.2zM55.3 11.8h2.3v2h.1c.1-.3.2-.6.4-.9.2-.3.4-.5.7-.7.3-.2.5-.4.8-.5.3-.1.6-.2 1-.2.3 0 .5 0 .6.1v2.4c-.1 0-.3-.1-.5-.1s-.4-.1-.6-.1c-.4 0-.8.1-1.1.3-.3.2-.6.4-.8.7-.2.3-.4.7-.5 1.1-.1.4-.2.9-.2 1.4V21h-2.5V11.8h.3zM68 21h-2.3v-1.3h-.1c-.3.5-.7.9-1.2 1.1-.5.3-1 .4-1.6.4-.9 0-1.6-.2-2.2-.5-.6-.3-1-.8-1.3-1.3-.3-.6-.5-1.2-.7-1.9-.1-.7-.2-1.5-.2-2.3s.1-1.5.2-2.2c.2-.7.4-1.3.8-1.8.3-.5.8-1 1.3-1.3.5-.3 1.2-.5 1.9-.5.3 0 .6 0 .9.1.3.1.6.2.8.3.3.1.5.3.7.5.2.2.4.5.5.7h.1V7.8H68V21zm-6.8-4.4c0 .5.1.9.2 1.3.1.4.3.8.5 1.1.2.3.5.5.8.7.3.2.7.3 1.1.3.4 0 .8-.1 1.1-.3.3-.2.6-.5.8-.8.2-.3.4-.7.5-1.1.1-.4.2-.8.2-1.3 0-.5-.1-.9-.2-1.3-.1-.4-.3-.8-.5-1.1-.2-.3-.5-.6-.8-.8-.3-.2-.7-.3-1.1-.3-.4 0-.8.1-1.1.3-.3.2-.6.4-.8.7-.2.3-.4.7-.5 1.1-.1.4-.2.9-.2 1.4zM75.4 21.2c-.8 0-1.4-.1-2-.4-.6-.3-1-.6-1.4-1.1-.4-.5-.7-1-.9-1.7-.2-.7-.3-1.4-.3-2.1 0-.8.1-1.5.3-2.1.2-.7.5-1.2.9-1.7.4-.5.8-.8 1.4-1.1.5-.3 1.2-.4 1.9-.4.8 0 1.4.1 2 .4.5.3 1 .7 1.3 1.2.3.5.6 1 .7 1.7.2.6.2 1.3.2 2v.7h-6.1c0 .4.1.7.2 1.1.1.3.3.6.5.9.2.3.5.4.8.6.3.1.7.2 1.1.2.5 0 1-.1 1.3-.4.4-.3.6-.6.8-1l2 .9c-.3.8-.9 1.4-1.6 1.8-.6.3-1.4.5-2.3.5h.2zm2.2-5.6c0-.3-.1-.6-.2-.9-.1-.3-.2-.6-.4-.8-.2-.2-.4-.4-.7-.6-.3-.1-.6-.2-1-.2s-.7.1-1 .2c-.3.1-.5.3-.7.6-.2.2-.3.5-.4.8-.1.3-.2.6-.2.9h4.6zM80.9 11.8h2.3v1.5h.1c.3-.6.8-1 1.3-1.3.5-.3 1.1-.4 1.7-.4.7 0 1.2.1 1.7.4.5.2.8.6 1.1 1 .4-.5.8-.8 1.4-1.1.5-.2 1.1-.4 1.6-.4.5 0 1 .1 1.4.2.4.2.8.4 1.1.7.3.3.5.7.7 1.2.2.5.2 1 .2 1.6V21h-2.5v-5.3c0-.3 0-.6-.1-.8 0-.2-.1-.5-.3-.6-.1-.2-.3-.3-.5-.4-.2-.1-.5-.1-.8-.1-.7 0-1.2.2-1.5.6-.3.4-.5 1-.5 1.7V21h-2.5v-5.4c0-.6-.1-1.1-.4-1.4-.3-.3-.6-.5-1.2-.5-.3 0-.6.1-.9.2-.3.1-.5.3-.7.5-.2.2-.3.5-.4.8-.1.3-.1.7-.1 1V21h-2.5V11.8h.2zM97.5 7.8h2.5V21h-2.5V7.8zM101.8 11.8h2.5V21h-2.5v-9.2zm1.2-4.5c.4 0 .8.2 1.1.4.3.3.4.6.4 1s-.2.8-.4 1c-.3.3-.7.4-1.1.4-.4 0-.8-.2-1-.4-.3-.3-.4-.6-.4-1s.2-.8.4-1c.3-.3.6-.4 1-.4zM108.3 11.8h2.3v1.5h.1c.3-.6.8-1 1.3-1.3.5-.3 1.1-.4 1.7-.4.7 0 1.2.1 1.7.3.5.2.9.6 1.2 1 .3.4.5.9.7 1.5.1.6.2 1.2.2 1.9 0 .6-.1 1.2-.2 1.8-.1.6-.4 1.1-.7 1.5-.3.4-.7.8-1.2 1-.5.3-1 .4-1.7.4-.3 0-.6 0-.9-.1-.3-.1-.6-.2-.8-.3-.3-.1-.5-.3-.7-.5-.2-.2-.4-.5-.5-.7h-.1V24h-2.5V11.8h.1zm6.8 4.5c0-.4-.1-.9-.2-1.3-.1-.4-.3-.8-.5-1.1-.2-.3-.5-.5-.8-.7-.3-.2-.7-.3-1.1-.3-.8 0-1.4.3-1.9.9-.4.6-.7 1.4-.7 2.4 0 .5.1 1 .2 1.4.1.4.3.8.5 1.1.2.3.5.5.8.7.3.2.7.3 1.1.3.4 0 .8-.1 1.1-.3.3-.2.6-.4.8-.7.2-.3.3-.7.5-1.1.1-.4.2-.9.2-1.3zM118.9 7.8h2.5v5.5h.1c.3-.6.8-1 1.3-1.3.5-.3 1.1-.4 1.7-.4.7 0 1.2.1 1.7.3.5.2.9.6 1.2 1 .3.4.5.9.7 1.5.1.6.2 1.2.2 1.9 0 .6-.1 1.2-.2 1.8-.1.6-.4 1.1-.7 1.5-.3.4-.7.8-1.2 1-.5.3-1 .4-1.7.4-.3 0-.6 0-.9-.1-.3-.1-.6-.2-.8-.3-.3-.1-.5-.3-.7-.5-.2-.2-.4-.5-.5-.7h-.1V21h-2.3V7.8h-.2zm6.8 8.5c0-.4-.1-.9-.2-1.3-.1-.4-.3-.8-.5-1.1-.2-.3-.5-.5-.8-.7-.3-.2-.7-.3-1.1-.3-.8 0-1.4.3-1.9.9-.4.6-.7 1.4-.7 2.4 0 .5.1 1 .2 1.4.1.4.3.8.5 1.1.2.3.5.5.8.7.3.2.7.3 1.1.3.4 0 .8-.1 1.1-.3.3-.2.6-.4.8-.7.2-.3.3-.7.5-1.1.1-.4.2-.9.2-1.3z" />
    </svg>
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
