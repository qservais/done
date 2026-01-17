import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { motion } from "framer-motion";
import { BRAND } from "@/config/brand";
import { ArrowRight, Star } from "lucide-react";

export function Hero() {
  return (
    <Section className="min-h-[90vh] flex flex-col justify-center pt-32 pb-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-accent/10 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-500/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-6 border border-accent/20">
            Design premium • Mobile first
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight leading-[1.1] mb-6">
            Un site qui <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-green-600">charge vite</span>. <br className="hidden md:block" />
            Et qui coûte moins qu’un logo.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {BRAND.TAGLINE} V1 livrée en 24–48h.
            <br />
            <span className="text-sm opacity-70 mt-2 block">
              À partir de {BRAND.PRICING.PACK_EXPRESS}€ + abonnement.
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button size="lg" className="text-lg px-8 h-14 w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 rounded-full" asChild>
            <a href="#contact">Demander mon site <ArrowRight className="ml-2 w-5 h-5" /></a>
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 h-14 w-full sm:w-auto rounded-full" asChild>
            <a href="#packs">Voir les packs</a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-8 flex justify-center gap-8 text-sm text-muted-foreground"
        >
           <div className="flex items-center gap-2">
             <Star className="w-4 h-4 text-accent fill-accent" />
             <span>Abonnement tout inclus</span>
           </div>
           <div className="flex items-center gap-2">
             <Star className="w-4 h-4 text-accent fill-accent" />
             <span>Design Premium</span>
           </div>
        </motion.div>
      </div>
    </Section>
  );
}
