import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/ui/section";
import { BRAND } from "@/config/brand";

export default function Legal() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="pt-24">
        <Section className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
          <h1>Mentions Légales</h1>
          <p>
            Conformément aux dispositions de la loi, voici les informations légales concernant le site de {BRAND.STUDIO_NAME}.
          </p>

          <h3>Éditeur</h3>
          <p>
            {BRAND.STUDIO_NAME}<br />
            Adresse : [Adresse du studio]<br />
            Email : {BRAND.CONTACT_EMAIL}<br />
            Téléphone : {BRAND.PHONE}<br />
            Numéro d'entreprise : [BE 0000.000.000]
          </p>

          <h3>Hébergement</h3>
          <p>
            Le site est hébergé par Replit, Inc.<br />
            Données localisées selon les standards en vigueur.
          </p>

          <h3>Propriété Intellectuelle</h3>
          <p>
            Tout le contenu du présent site (images, textes, vidéos) est la propriété exclusive de {BRAND.STUDIO_NAME}, sauf mention contraire.
          </p>

          <h3>Responsabilité</h3>
          <p>
            {BRAND.STUDIO_NAME} ne peut être tenu responsable des dommages directs et indirects causés au matériel de l’utilisateur lors de l’accès au site.
          </p>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
