import type { Express, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { storage } from "./storage";
import { blogBearerAuth, generateArticle, pickNextTopic, slugify } from "./blog-generate";
import { blogPrerenderMiddleware } from "./blog-prerender";
import { BLOG_CONFIG, type BlogCategory } from "./blog-config";

const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1h
  max: 10,
  message: { error: "Rate limit dépassé (10/h max)" },
});

function requireAdmin(req: Request, res: Response): boolean {
  const authHeader = req.headers.authorization;
  const adminPassword = process.env.ADMIN_PASSWORD || "done2024";
  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    res.status(401).json({ success: false, message: "Non autorisé" });
    return false;
  }
  return true;
}

export function registerBlogRoutes(app: Express) {
  app.use(blogPrerenderMiddleware);

  app.post("/api/generate-content", generateLimiter, blogBearerAuth, async (req: Request, res: Response) => {
    const BodySchema = z.object({
      topic: z.string().optional(),
      category: z.enum(BLOG_CONFIG.allowedCategories).optional(),
    });
    const body = BodySchema.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Body invalide", details: body.error.issues });
      return;
    }

    let { topic, category } = body.data;
    if (!topic) {
      const picked = await pickNextTopic();
      topic = picked.topic;
      category = picked.category as BlogCategory;
    }
    if (!category || !BLOG_CONFIG.allowedCategories.includes(category)) {
      category = BLOG_CONFIG.defaultCategory as BlogCategory;
    }

    // Réponse immédiate — génération en arrière-plan
    res.status(202).json({ status: "processing", topic, slug: slugify(topic) });

    generateArticle(topic, category).catch((err) => {
      console.error("[Blog] Erreur non gérée:", err);
    });
  });

  // Stats de génération (monitoring) — enregistrée avant /:slug pour éviter la collision de route
  app.get("/api/seo-pages/_stats", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const stats = await storage.getGenerationStats();
    const lastRun = await storage.getLastGenerationLog();
    res.json({ stats, lastRun });
  });

  app.get("/api/seo-pages", async (_req: Request, res: Response) => {
    const pages = await storage.getPublishedSeoPagesList();
    res.json(pages);
  });

  app.get("/api/seo-pages/:slug", async (req: Request, res: Response) => {
    const page = await storage.getPublishedSeoPageBySlug(req.params.slug as string);
    if (!page) {
      res.status(404).json({ error: "Article introuvable" });
      return;
    }
    res.json(page);
  });

  app.delete("/api/seo-pages/:slug", async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    await storage.deleteSeoPageBySlug(req.params.slug as string);
    res.status(204).send();
  });

  app.get("/sitemap.xml", async (_req: Request, res: Response) => {
    const pages = await storage.getPublishedSeoPagesList();
    const base = BLOG_CONFIG.siteUrl;

    const staticEntries: Array<{ loc: string; lastmod?: string; changefreq: string; priority: string }> = [
      { loc: `${base}/`, changefreq: "weekly", priority: "1.0" },
      { loc: `${base}/realisations`, changefreq: "weekly", priority: "0.8" },
      { loc: `${base}${BLOG_CONFIG.guidesPath}`, changefreq: "daily", priority: "0.8" },
    ];

    const articleEntries = pages.map((p) => ({
      loc: `${base}${BLOG_CONFIG.guidesPath}/${p.slug}`,
      lastmod: p.updatedAt.toISOString().split("T")[0],
      changefreq: "monthly",
      priority: "0.7",
    }));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...articleEntries].map((e) => `  <url>
    <loc>${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.send(xml);
  });
}
