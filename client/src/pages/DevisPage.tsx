import { DevisWizard } from "@/components/DevisWizard";
import { SEO } from "@/components/SEO";

export default function DevisPage() {
  return (
    <>
      <SEO
        title="Démarrez votre projet — done."
        description="Remplissez votre brief en quelques minutes. Devis gratuit, sans engagement — on vous répond sous 24h."
        noindex={true}
      />
      <DevisWizard />
    </>
  );
}
