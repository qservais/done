import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/ui/section";
import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";
import { FadeIn } from "@/components/ui/fade-in";

type ArticleSummary = {
  slug: string;
  title: string;
  metaDescription: string | null;
  category: string | null;
  readTime: string | null;
  tags: string[];
  date: string;
  updatedAt: string;
};

export default function Guides() {
  const { data: articles, isLoading } = useQuery<ArticleSummary[]>({
    queryKey: ["/api/seo-pages"],
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SEO
        title="Guides & conseils — done. · Sites web Belgique"
        description="Conseils sur la création de sites web, le SEO et le digital pour indépendants et PME en Belgique, France et Luxembourg."
        canonical="https://madebydone.be/guides"
      />
      <StructuredData type="localBusiness" />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Accueil", url: "https://madebydone.be" },
          { name: "Guides", url: "https://madebydone.be/guides" }
        ]}
      />

      <Header />
      <main className="pt-28 md:pt-32">
        <Section className="pb-20 md:pb-28">
          <FadeIn>
            <div className="max-w-3xl mb-10 md:mb-14">
              <p className="text-xs tracking-widest uppercase font-medium text-muted-foreground/60 mb-4">Guides</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Nos <span className="text-accent">guides</span>.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Conseils pratiques sur la création de site, le SEO et le digital pour indépendants et PME.
              </p>
            </div>
          </FadeIn>

          {isLoading ? (
            <p className="text-muted-foreground">Chargement…</p>
          ) : !articles || articles.length === 0 ? (
            <p className="text-muted-foreground">Les premiers guides arrivent bientôt.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {articles.map((article, index) => (
                <FadeIn key={article.slug} delay={index * 0.04}>
                  <Link
                    href={`/guides/${article.slug}`}
                    className="group block h-full bg-background border border-border rounded-2xl p-6 hover:border-accent/50 transition-all hover:shadow-xl hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
                    data-testid={`link-guide-${article.slug}`}
                  >
                    {article.category && (
                      <span className="text-xs uppercase tracking-wide text-accent font-medium">{article.category}</span>
                    )}
                    <h2 className="text-xl font-semibold mt-2 mb-3 group-hover:text-accent transition-colors">{article.title}</h2>
                    {article.metaDescription && (
                      <p className="text-muted-foreground text-sm line-clamp-3">{article.metaDescription}</p>
                    )}
                    {article.readTime && (
                      <span className="text-xs text-muted-foreground/70 mt-4 block">{article.readTime}</span>
                    )}
                  </Link>
                </FadeIn>
              ))}
            </div>
          )}
        </Section>
      </main>
      <Footer />
    </div>
  );
}
