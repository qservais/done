import { DevisWizard } from "@/components/DevisWizard";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { X } from "lucide-react";

export default function DevisPage() {
  return (
    <>
      <SEO
        title="Démarrez votre projet — done."
        description="Remplissez votre brief en quelques minutes. Devis gratuit, sans engagement — on vous répond sous 24h."
        noindex={true}
      />
      <div className="min-h-screen bg-secondary/40">
        <div className="sticky top-0 z-10 bg-secondary/60 backdrop-blur-sm border-b border-border/40">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-serif font-bold text-lg tracking-tighter hover:opacity-70 transition-opacity">
              done<span className="text-accent">.</span>
            </Link>
            <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Retour au site</span>
            </Link>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
          <div className="mb-5 md:mb-7 text-center">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">Démarrez votre projet</h1>
            <p className="text-sm text-muted-foreground">13 étapes · ~3 minutes · Devis gratuit</p>
          </div>
          <DevisWizard />
        </div>
      </div>
    </>
  );
}
