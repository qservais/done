import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/ui/section";
import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";
import { BRAND } from "@/config/brand";
import { useLocation } from "wouter";

const legalContent = {
  mentions: {
    title: "Mentions légales — done",
    description: "Informations légales du studio done. Éditeur, hébergeur et conditions d'utilisation.",
    canonical: "https://madebydone.be/mentions",
    h1: "Mentions légales",
  },
  privacy: {
    title: "Politique de confidentialité — done",
    description: "Comment done collecte et protège vos données personnelles. RGPD compliant.",
    canonical: "https://madebydone.be/privacy",
    h1: "Politique de confidentialité",
  },
  cookies: {
    title: "Politique cookies — done",
    description: "Utilisation des cookies sur madebydone.be. Paramètres et consentement.",
    canonical: "https://madebydone.be/cookies",
    h1: "Politique cookies",
  },
};

export default function Legal() {
  const [location] = useLocation();
  const page = location.replace("/", "") as keyof typeof legalContent;
  const content = legalContent[page] || legalContent.mentions;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SEO
        title={content.title}
        description={content.description}
        canonical={content.canonical}
        noindex={true}
      />
      <StructuredData type="localBusiness" />
      
      <Header />
      <main className="pt-28 md:pt-32">
        <Section className="prose prose-lg dark:prose-invert max-w-3xl mx-auto pb-20">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">{content.h1}</h1>
          
          {page === "mentions" && (
            <>
              <h3>Éditeur du site</h3>
              <p>
                <strong>DONE.</strong><br />
                Rue Haute 12, Boîte 003<br />
                4460 Grâce-Hollogne — Belgique<br />
                Email : <a href="mailto:hello@madebydone.be">hello@madebydone.be</a><br />
                Numéro d'entreprise (BCE) : BE 1035.756.397<br />
                Représentée par : Maxime Gillent et Quentin Servais
              </p>

              <h3>Hébergement</h3>
              <p>
                Ce site est hébergé par <strong>Replit, Inc.</strong><br />
                767 Bryant St. #203, San Francisco, CA 94107, États-Unis
              </p>

              <h3>Propriété intellectuelle</h3>
              <p>
                L'ensemble des contenus présents sur ce site (textes, visuels, logotype, structure) est la propriété exclusive de DONE., sauf mention contraire. Toute reproduction ou utilisation sans autorisation préalable est interdite.
              </p>

              <h3>Responsabilité</h3>
              <p>
                DONE. met tout en œuvre pour assurer l'exactitude des informations publiées sur ce site. Toutefois, nous ne pouvons garantir l'exhaustivité ou l'actualité de ces informations et déclinons toute responsabilité pour les dommages directs ou indirects liés à leur utilisation.
              </p>
            </>
          )}

          {page === "privacy" && (
            <>
              <p>
                Le studio {BRAND.STUDIO_NAME} s'engage à protéger vos données personnelles conformément au RGPD.
              </p>

              <h3>Données collectées</h3>
              <p>
                Nous collectons uniquement les données que vous nous fournissez via le formulaire de contact : nom, email, description du projet.
              </p>

              <h3>Utilisation des données</h3>
              <p>
                Vos données sont utilisées exclusivement pour répondre à votre demande et vous proposer nos services. Elles ne sont jamais vendues à des tiers.
              </p>

              <h3>Conservation</h3>
              <p>
                Vos données sont conservées pendant 3 ans maximum après le dernier contact.
              </p>

              <h3>Vos droits</h3>
              <p>
                Vous pouvez demander l'accès, la rectification ou la suppression de vos données en nous contactant à hello@madebydone.be.
              </p>
            </>
          )}

          {page === "cookies" && (
            <>
              <p>
                Ce site utilise des cookies pour améliorer votre expérience.
              </p>

              <h3>Cookies essentiels</h3>
              <p>
                Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.
              </p>

              <h3>Cookies analytiques</h3>
              <p>
                Nous utilisons des cookies pour comprendre comment vous utilisez le site (pages visitées, temps passé). Ces données sont anonymisées.
              </p>

              <h3>Gérer vos préférences</h3>
              <p>
                Vous pouvez modifier vos préférences cookies à tout moment via les paramètres de votre navigateur.
              </p>
            </>
          )}
        </Section>
      </main>
      <Footer />
    </div>
  );
}
