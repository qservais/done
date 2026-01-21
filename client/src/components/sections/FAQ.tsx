import { Section } from "@/components/ui/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BRAND } from "@/config/brand";
import { FadeIn } from "@/components/ui/fade-in";

export function FAQ() {
  return (
    <Section id="faq" className="bg-background">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Questions fréquentes</h2>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Pourquoi un abonnement ?</AccordionTrigger>
              <AccordionContent>
                Pour votre tranquillité. Un site web n'est pas un produit fini qu'on pose sur une étagère. Il a besoin d'hébergement, de sécurité et de maintenance. On gère tout ça pour {BRAND.SUB_PRICE}€/mois, pour que vous n'ayez jamais à vous en soucier.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>C’est quoi une “demande d’ajustement” ?</AccordionTrigger>
              <AccordionContent>
                C'est inclus dans votre abonnement. Vous avez besoin de changer une photo, un texte, ou un horaire ? Vous nous envoyez un message, et on le fait. Chaque demande couvre un lot de changements réalisables en 30 minutes.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Et si je n’ai ni logo ni photos ?</AccordionTrigger>
              <AccordionContent>
                Pas de panique. On ne vous laisse pas seul face à une page blanche. On vous aide à structurer l'essentiel lors du démarrage, et on peut utiliser des banques d'images premium en attendant vos propres visuels.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>En combien de temps mon site est prêt ?</AccordionTrigger>
              <AccordionContent>
                Nous nous engageons sur une V1 (première version complète) en 72h ouvrées après réception des éléments de base. C'est rapide, mais le travail est soigné.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Puis-je ajouter des fonctionnalités plus tard ?</AccordionTrigger>
              <AccordionContent>
                Bien sûr. Votre site est évolutif. Si vous avez besoin de nouvelles fonctionnalités complexes hors abonnement (ex: espace membre), on vous fera un devis clair avant toute intervention.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Et si j’ai beaucoup de trafic ?</AccordionTrigger>
              <AccordionContent>
                C'est une bonne nouvelle ! L'abonnement couvre un usage normal. Si votre site devient viral et consomme énormément de ressources serveur, on ajustera simplement l'hébergement avec vous, en toute transparence.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </FadeIn>
      </div>
    </Section>
  );
}
