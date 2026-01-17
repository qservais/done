import { Section } from "@/components/ui/section";
import { Check, Info } from "lucide-react";
import { BRAND } from "@/config/brand";

export function Subscription() {
  return (
    <Section className="bg-primary text-primary-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
            Abonnement obligatoire.
            <br />
            <span className="text-accent">Pourquoi ?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Pour que votre site ne meure pas après 6 mois. Hébergement, maintenance, mises à jour de sécurité et petits changements : tout est géré.
          </p>
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl mb-8">
            <h4 className="flex items-center gap-2 font-bold mb-4 text-accent">
              <Info className="w-5 h-5" /> Fair Use Policy ({BRAND.FAIR_USE_EUR}€)
            </h4>
            <p className="text-sm text-gray-300">
              L'hébergement est inclus pour un usage normal "vitrine". 
              Nous couvrons les frais d'infrastructure jusqu'à {BRAND.FAIR_USE_EUR}€/mois de coût variable. 
              Au-delà (trafic énorme), on optimise ou on facture le surplus (en toute transparence).
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-bold">Pack Complet</h3>
              <p className="text-gray-400 text-sm">Domaine + Hébergement + Maintenance</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-accent">{BRAND.PRICING.SUB_FULL}€</span>
              <span className="text-sm text-gray-400">/mois</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-bold">Pack Light</h3>
              <p className="text-gray-400 text-sm">Si vous gérez déjà votre domaine</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-accent">{BRAND.PRICING.SUB_LIGHT}€</span>
              <span className="text-sm text-gray-400">/mois</span>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <h4 className="font-bold mb-4">Inclus dans l'abonnement :</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Hébergement rapide</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Certificat SSL (HTTPS)</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Mises à jour techniques</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> 2 tickets support / mois</li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
