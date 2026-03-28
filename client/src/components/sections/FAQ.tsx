import { Section } from "@/components/ui/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn } from "@/components/ui/fade-in";
import { trackFAQOpen } from "@/lib/tracking";
import { faqItems } from "@/data/faq";

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
                const item = faqItems.find((_, i) => `item-${i + 1}` === value);
                if (item) trackFAQOpen(item.question);
              }
            }}
          >
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
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
