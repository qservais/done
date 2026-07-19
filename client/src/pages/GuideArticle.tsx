import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/ui/section";
import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";
import { FadeIn } from "@/components/ui/fade-in";

type ArticleSection = { heading: string; content: string };
type Article = {
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  intro: string;
  sections: ArticleSection[];
  category: string | null;
  readTime: string | null;
  date: string;
  updatedAt: string;
  tags: string[];
  heroImageUrl: string | null;
  heroImageAlt: string | null;
};

function cloudinaryTransform(url: string, transform: string): string {
  return url.replace("/upload/", `/upload/${transform}/`);
}

function HeroImage({ src, alt }: { src: string; alt: string }) {
  const at = (w: number) => cloudinaryTransform(src, `f_auto,q_auto,w_${w}`);
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={`${at(1280)} 1x, ${at(2560)} 2x`} />
      <source media="(min-width: 640px)" srcSet={`${at(960)} 1x, ${at(1920)} 2x`} />
      <img
        src={at(640)}
        srcSet={`${at(640)} 1x, ${at(1280)} 2x`}
        alt={alt}
        loading="eager"
        decoding="async"
        width={1280}
        height={720}
        className="w-full aspect-video object-cover rounded-2xl"
      />
    </picture>
  );
}

function HeroFallback() {
  return (
    <div
      className="w-full aspect-video rounded-2xl"
      style={{ background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)" }}
      aria-hidden="true"
    />
  );
}

// Transforme le markdown [texte](/slug) inséré par l'IA en <Link> internes
function renderWithLinks(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) {
      return (
        <Link key={i} href={m[2]} className="text-accent underline underline-offset-2 hover:opacity-75">
          {m[1]}
        </Link>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export default function GuideArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = useQuery<Article>({
    queryKey: [`/api/seo-pages/${slug}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Header />
        <main className="pt-32 pb-20 text-center text-muted-foreground">Chargement…</main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans">
        <SEO title="Article introuvable — done." description="Ce guide n'existe pas ou plus." noindex canonical={`https://madebydone.be/guides/${slug}`} />
        <Header />
        <main className="pt-32 pb-20 text-center">
          <p className="text-muted-foreground mb-4">Cet article est introuvable.</p>
          <Link href="/guides" className="text-accent underline underline-offset-4">Retour aux guides</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const url = `https://madebydone.be/guides/${article.slug}`;
  const ogImage = article.heroImageUrl ? cloudinaryTransform(article.heroImageUrl, "f_auto,q_auto,w_1200,h_630,c_fill") : undefined;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SEO
        title={`${article.metaTitle ?? article.title} — done.`}
        description={article.metaDescription ?? ""}
        canonical={url}
        ogImage={ogImage}
      />
      <StructuredData
        type="article"
        article={{
          headline: article.title,
          description: article.metaDescription ?? "",
          image: ogImage,
          datePublished: article.date,
          dateModified: article.updatedAt,
          authorName: "done",
          url,
        }}
      />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Accueil", url: "https://madebydone.be" },
          { name: "Guides", url: "https://madebydone.be/guides" },
          { name: article.title, url },
        ]}
      />

      <Header />
      <main className="pt-28 md:pt-32">
        <Section className="pb-20 md:pb-28" containerClassName="max-w-3xl">
          <FadeIn>
            {article.category && (
              <span className="text-xs uppercase tracking-wide text-accent font-medium">{article.category}</span>
            )}
            <h1 className="text-3xl md:text-5xl font-bold mt-2 mb-4 leading-tight">{article.title}</h1>
            <p className="text-sm text-muted-foreground mb-8">
              {article.readTime ? `${article.readTime} · ` : ""}
              Mis à jour le {new Date(article.updatedAt).toLocaleDateString("fr-BE")}
            </p>

            <div className="mb-10">
              {article.heroImageUrl
                ? <HeroImage src={article.heroImageUrl} alt={article.heroImageAlt ?? article.title} />
                : <HeroFallback />}
            </div>

            <div className="text-lg leading-relaxed text-foreground/90 space-y-6">
              <p>{article.intro}</p>
              {article.sections.map((s, i) => (
                <section key={i} className="space-y-3">
                  <h2 className="text-2xl font-semibold pt-2">{s.heading}</h2>
                  <p>{renderWithLinks(s.content)}</p>
                </section>
              ))}
            </div>

            {article.tags?.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {article.tags.map((t) => (
                  <span key={t} className="text-xs bg-secondary text-muted-foreground px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-border">
              <Link href="/guides" className="text-sm text-accent underline underline-offset-4 hover:opacity-75">
                ← Tous les guides
              </Link>
            </div>
          </FadeIn>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
