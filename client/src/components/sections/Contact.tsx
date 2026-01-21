import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/config/brand";
import { Mail, Phone } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { DoneUnderline } from "@/components/signature";
import { trackCTAClick, trackPhoneClick, trackEmailClick } from "@/lib/tracking";

export function Contact() {
  return (
    <Section id="contact" className="bg-foreground text-background py-24">
      <div className="max-w-4xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 text-white">
            <DoneUnderline>On le fait ?</DoneUnderline>
          </h2>
          <p className="text-xl text-gray-400 mb-4 max-w-2xl mx-auto">
            Promis, on répond. Même le dimanche. (Mais on dort parfois.)
          </p>
          <p className="text-sm text-gray-500 italic mb-12">
            Livré. Maintenu. Done.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex justify-center mb-16">
            <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 rounded-full" asChild>
              <a href="#wizard" onClick={() => trackCTAClick('remplir_formulaire', 'contact')}>
                Remplir le formulaire (2 min)
              </a>
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-400 border-t border-white/10 pt-12">
            <div className="flex flex-col items-center gap-2">
              <Mail className="w-6 h-6 text-accent mb-2" />
              <a href={`mailto:${BRAND.CONTACT_EMAIL}`} className="hover:text-white transition-colors" onClick={() => trackEmailClick()}>{BRAND.CONTACT_EMAIL}</a>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Phone className="w-6 h-6 text-accent mb-2" />
              <a href={`tel:${BRAND.PHONE}`} className="hover:text-white transition-colors" onClick={() => trackPhoneClick()}>{BRAND.PHONE}</a>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-accent font-bold text-lg mb-1">Zone</span>
              <span>{BRAND.SERVICE_AREA}</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}
