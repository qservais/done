import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { BLOG_CONFIG } from "./blog-config";

const BOT_REGEX = /bot|crawler|spider|crawling|facebookexternalhit|linkedinbot|whatsapp|telegram|slackbot/i;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Convertit le markdown [texte](/slug) inséré par l'IA en vrais <a> pour que
// les crawlers suivent le maillage interne (le frontend React fait la même
// conversion côté client via renderWithLinks dans GuideArticle.tsx).
function renderContentHtml(text: string): string {
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let result = "";
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = linkPattern.exec(text)) !== null) {
    result += escapeHtml(text.slice(lastIndex, m.index));
    result += `<a href="${escapeHtml(m[2])}">${escapeHtml(m[1])}</a>`;
    lastIndex = m.index + m[0].length;
  }
  result += escapeHtml(text.slice(lastIndex));
  return result;
}

// Un site React avec balises méta posées via useEffect est mal indexé par la
// plupart des crawlers (bots, Open Graph). Ce middleware sert du HTML complet
// pré-rendu aux bots pour /guides/:slug, avant que le bundle React ne prenne le relais.
export async function blogPrerenderMiddleware(req: Request, res: Response, next: NextFunction) {
  const ua = req.headers["user-agent"] ?? "";
  if (!BOT_REGEX.test(ua)) {
    next();
    return;
  }

  const match = req.path.match(/^\/guides\/([a-z0-9-]+)$/);
  if (!match) {
    next();
    return;
  }

  const article = await storage.getPublishedSeoPageBySlug(match[1]);
  if (!article) {
    next();
    return;
  }

  const url = `${BLOG_CONFIG.siteUrl}${BLOG_CONFIG.guidesPath}/${article.slug}`;
  const ogImage = article.heroImageUrl
    ? article.heroImageUrl.replace("/upload/", "/upload/f_auto,q_auto,w_1200,h_630,c_fill/")
    : null;
  const title = escapeHtml(article.metaTitle ?? article.title);
  const description = escapeHtml(article.metaDescription ?? "");

  const html = `<!DOCTYPE html>
<html lang="${BLOG_CONFIG.language}">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">${ogImage ? `
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${ogImage}">` : ""}
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: ogImage ? [ogImage] : undefined,
    datePublished: article.date,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: BLOG_CONFIG.authorOrgName },
  })}</script>
</head>
<body>
<article>
<h1>${escapeHtml(article.title)}</h1>${article.heroImageUrl ? `
<img src="${article.heroImageUrl.replace("/upload/", "/upload/f_auto,q_auto,w_1280/")}" alt="${escapeHtml(article.heroImageAlt ?? article.title)}" width="1280" height="720">` : ""}
<p>${escapeHtml(article.intro)}</p>
${article.sections.map((s) => `<section><h2>${escapeHtml(s.heading)}</h2><p>${renderContentHtml(s.content)}</p></section>`).join("")}
</article>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
}
