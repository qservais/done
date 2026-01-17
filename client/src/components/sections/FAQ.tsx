import { Section } from "@/components/ui/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BRAND } from "@/config/brand";

export function FAQ() {
  return (
    <Section id="faq" className="bg-background">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-12 text-center">Questions fréquentes</h2>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Pourquoi l’abonnement est obligatoire ?</AccordionTrigger>
            <AccordionContent>
              Pour assurer la pérennité de votre site. Un site sans maintenance finit par casser, être piraté ou devenir lent. On s'occupe de tout pour vous.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>C’est quoi un "ticket" de support ?</AccordionTrigger>
            <AccordionContent>
              Un ticket correspond à une demande d'intervention de max 30 minutes. Exemple : changer une image, modifier un texte, ajouter un bouton. Vous en avez 2 par mois inclus.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>Que se passe-t-il si je veux une nouvelle fonctionnalité ?</AccordionTrigger>
            <AccordionContent>
              Si ça dépasse les 30 minutes du ticket (ex: ajouter une page, un système de paiement), on vous fait un devis précis avant de commencer.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>Vous répondez en combien de temps ?</AccordionTrigger>
            <AccordionContent>
              Nous garantissons une réponse et une prise en charge sous {BRAND.SLA_HOURS}h ouvrées (souvent moins).
            </AccordionContent>
          </AccordionItem>

           <AccordionItem value="item-5">
            <AccordionTrigger>Multilingue inclus ?</AccordionTrigger>
            <AccordionContent>
              Jusqu'à 2 langues sont incluses dans la structure technique. Vous fournissez les textes traduits. Au-delà, c'est une option.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Section>
  );
}
