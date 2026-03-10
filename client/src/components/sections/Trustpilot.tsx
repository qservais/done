import { Section } from "@/components/ui/section";
import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";

const REVIEWS_URL = "https://fr-be.trustpilot.com/review/madebydone.be";

const reviews = [
  {
    name: "Salomé L.-G.",
    project: "Maison Vagabonde",
    text: "Ils ont été à l'écoute, ont rapidement saisi les objectifs, les besoins ainsi que la direction artistique. Rapide, premium et accessible, je recommande vivement !",
  },
  {
    name: "Ideal Fitness Embourg",
    project: "Ideal Fitness",
    text: "Nous avons fait appel à Madebydone pour la conception de notre site, depuis nos clients sont ravis ! Service rapide et de qualité.",
  },
];

function ReviewStar({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.4, ease: "easeOut" }}
    >
      <Star className="w-5 h-5 md:w-6 md:h-6 text-accent" fill="currentColor" />
    </motion.div>
  );
}

function MiniStars() {
  return (
    <div className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className="w-3.5 h-3.5 text-accent" fill="currentColor" />
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: typeof reviews[0]; index: number }) {
  return (
    <motion.div
      className="bg-background border border-border rounded-2xl p-5 md:p-6 text-left max-w-sm w-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.5, ease: "easeOut" }}
    >
      <MiniStars />
      <p className="text-sm md:text-base text-foreground/90 mt-3 leading-relaxed">
        "{review.text}"
      </p>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{review.name}</p>
          <p className="text-xs text-muted-foreground">{review.project}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function Reviews() {
  return (
    <Section className="py-10 md:py-14">
      <motion.div
        className="flex flex-col items-center gap-4 md:gap-5 max-w-md mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <span className="text-xs tracking-widest uppercase font-medium text-muted-foreground/60">
          Avis clients
        </span>

        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <ReviewStar key={i} index={i} />
          ))}
        </div>

        <p className="text-sm text-muted-foreground" data-testid="text-review-count">
          5/5 — basé sur les retours de nos clients
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-8 md:mt-10">
        {reviews.map((review, i) => (
          <ReviewCard key={i} review={review} index={i} />
        ))}
      </div>

      <motion.div
        className="flex justify-center mt-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <a
          href={REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/60 hover:text-accent transition-colors"
          data-testid="link-reviews"
        >
          Voir tous nos avis <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </motion.div>
    </Section>
  );
}
