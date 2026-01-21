import { Section } from "@/components/ui/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BRAND } from "@/config/brand";
import { FadeIn } from "@/components/ui/fade-in";
import { trackFAQOpen } from "@/lib/tracking";

const faqItems = [
  { id: "item-1", question: "Pourquoi un abonnement ?", answer: `Pour votre tranquillité. Un site web n'est pas un produit fini qu'on pose sur une étagère. Il a besoin d'hébergement, de sécurité et de maintenance. On gère tout ça pour ${BRAND.SUB_PRICE}€/mois, pour que vous n'ayez jamais à vous en soucier.` },
  { id: "item-2", question: "C'est quoi une \"demande d'ajustement\" ?", answer: "C'est inclus dans votre abonnement. Vous avez besoin de changer une photo, un texte, ou un horaire ? Vous nous envoyez un message, et on le fait. Chaque demande couvre un lot de changements réalisables en 30 minutes." },
  { id: "item-3", question: "Et si je n'ai ni logo ni photos ?", answer: "Pas de panique. On ne vous laisse pas seul face à une page blanche. On vous aide à structurer l'essentiel lors du démarrage, et on peut utiliser des banques d'images premium en attendant vos propres visuels." },
  { id: "item-4", question: "En combien de temps mon site est prêt ?", answer: "Nous nous engageons sur une V1 (première version complète) en 72h ouvrées après réception des éléments de base. C'est rapide, mais le travail est soigné." },
  { id: "item-5", question: "Puis-je ajouter des fonctionnalités plus tard ?", answer: "Bien sûr. Votre site est évolutif. Si vous avez besoin de nouvelles fonctionnalités complexes hors abonnement (ex: espace membre), on vous fera un devis clair avant toute intervention." },
  { id: "item-6", question: "Et si j'ai beaucoup de trafic ?", answer: "C'est une bonne nouvelle ! L'abonnement couvre un usage normal. Si votre site devient viral et consomme énormément de ressources serveur, on ajustera simplement l'hébergement avec vous, en toute transparence." },
];

export function FAQ() {
  return (
    <Section id="faq" className="bg-background">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Questions fréquentes</h2>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <Accordion 
            type="single" 
            collapsible 
            className="w-full"
            onValueChange={(value) => {
              if (value) {
                const item = faqItems.find(i => i.id === value);
                if (item) trackFAQOpen(item.question);
              }
            }}
          >
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </Section>
  );
}
