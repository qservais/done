import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/config/brand";
import { Mail, Phone, Calendar } from "lucide-react";

export function Contact() {
  return (
    <Section id="contact" className="bg-foreground text-background py-24">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 text-white">
          On le fait ?
        </h2>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Promis, on répond. Même le dimanche. (Mais on dort parfois.)
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
            Remplir le formulaire (2 min)
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-8 text-lg w-full sm:w-auto rounded-full bg-transparent text-white border-white hover:bg-white hover:text-black" asChild>
            <a href={BRAND.CALENDAR_URL} target="_blank" rel="noopener noreferrer">
              <Calendar className="mr-2 w-5 h-5" /> Réserver un appel
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-400 border-t border-white/10 pt-12">
          <div className="flex flex-col items-center gap-2">
            <Mail className="w-6 h-6 text-accent mb-2" />
            <a href={`mailto:${BRAND.CONTACT_EMAIL}`} className="hover:text-white transition-colors">{BRAND.CONTACT_EMAIL}</a>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Phone className="w-6 h-6 text-accent mb-2" />
            <a href={`tel:${BRAND.PHONE}`} className="hover:text-white transition-colors">{BRAND.PHONE}</a>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-accent font-bold text-lg mb-1">Zone</span>
            <span>{BRAND.SERVICE_AREA}</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
