# Blog SEO Generator v2.1 — Template Done.

Système de génération automatique d'articles SEO **avec image hero générée par IA**, prêt à drop dans un projet Replit (Express + PostgreSQL + React/Vite). Réutilisable d'un client à l'autre via un seul fichier de configuration métier.

**Améliorations vs v1 :** modèle Claude corrigé, JSON garanti par prefill, slug déterministe, lock anti-concurrence, rate limiting, validation Zod, anti-hallucination, logs + tracking des coûts, méta SEO côté serveur, JSON-LD, maillage interne, régénération automatique du contenu vieillissant.

**Nouveau en v2.1 :** génération d'image hero via Flux Schnell (fal.ai) + stockage Cloudinary, prompt d'image généré par Claude dans le même appel que l'article, exclusion stricte des humains/texte, srcset responsive, fallback CSS si la génération échoue. Coût total ~$0.013/article.

---

## ⚠️ Important — SEO et rendu

Un site React avec balises méta posées via `useEffect` est **mal indexé** par la plupart des crawlers (Bing, IA, réseaux sociaux pour Open Graph). Trois niveaux possibles, à choisir selon le client :

1. **Minimum vital** (inclus dans ce template) : `react-helmet-async` + middleware Express qui pré-rend les pages `/guides/:slug` à la volée pour les User-Agents bots. Suffisant pour Google et la plupart des cas.
2. **Robuste** : pré-rendu statique généré à l'écriture de l'article (HTML écrit sur disque, servi avant le bundle React). Inclus en option dans ce doc.
3. **Idéal** : passer à Next.js App Router ou Astro. Hors scope de ce template Express.

Si le client priorise vraiment le SEO, recommande l'option 3 dès la phase devis.

---

## Vue d'ensemble

```
Cron externe → POST /api/generate-content (Bearer token)
                      ↓
              Lock du sujet en DB (status="generating")
                      ↓
              Claude génère l'article (Sonnet 4.6, JSON garanti)
                      ↓
              Validation Zod + sauvegarde (table seo_pages)
                      ↓
              Log des tokens consommés (table generation_logs)
                      ↓
Frontend → GET /api/seo-pages         → liste publiée
           GET /api/seo-pages/:slug   → article (avec maillage interne)
Sitemap  → GET /sitemap.xml           → entrées dynamiques
Bots     → Middleware pre-render      → HTML complet (méta + JSON-LD)
```

---

## 1. Configuration métier centralisée

**Tout ce qui change d'un client à l'autre est dans un seul fichier.** Modifier uniquement ce fichier (et `topics.json`) pour adapter à un nouveau métier.

```typescript
// artifacts/api-server/src/config/business.ts
export const BUSINESS_CONFIG = {
  // Identité
  name: "Nom Entreprise",
  type: "toiture",                   // métier (utilisé dans le prompt)
  expertField: "toiture en Belgique", // pour "Tu es un expert en..."

  // Localisation
  city: "Liège",
  region: "Wallonie",
  country: "Belgique",

  // Site
  siteUrl: process.env.SITE_URL ?? "https://exemple.be",
  guidesPath: "/guides",             // ou /blog, /conseils, etc.

  // Contenu
  language: "fr",                    // pour <html lang> et le prompt
  locale: "fr_BE",                   // pour og:locale
  authorOrgName: "Nom Entreprise",   // pour JSON-LD Article

  // Catégories autorisées (validation)
  allowedCategories: [
    "Prix & Devis",
    "Entretien & Réparation",
    "Conseils",
    "Matériaux",
    "Aides & Primes",
    "Isolation",
  ] as const,

  // Génération
  defaultCategory: "Conseils",
  minWords: 600,
  maxWords: 900,

  // Anthropic
  anthropicModel: "claude-sonnet-4-6", // bon rapport qualité/coût pour ce use case
  anthropicMaxTokens: 4096,

  // Génération d'image hero (Flux Schnell via fal.ai)
  imageGeneration: {
    enabled: true,
    falModel: "fal-ai/flux/schnell" as const, // alt: "fal-ai/flux-pro/v1.1" (~13x plus cher, qualité marginalement supérieure)
    imageSize: "landscape_16_9" as const,     // 1024×576 — parfait pour og:image
    inferenceSteps: 4,                         // 4 pour Schnell, 28-50 pour Pro
    styleSuffix: "professional editorial photography, natural lighting, clean composition, sharp focus, high detail",
    exclusions: "no people, no humans, no faces, no hands, no body parts, no text, no words, no letters, no logos, no watermarks, no signs",
    cloudinaryFolder: "seo-blog",              // folder Cloudinary où uploader
  },
} as const;

export type AllowedCategory = (typeof BUSINESS_CONFIG.allowedCategories)[number];
```

**Pourquoi Sonnet 4.6 et pas Opus :** pour un article SEO de 700 mots, Sonnet produit une qualité indiscernable à un coût ~5x inférieur. Garde Opus uniquement si tu constates des problèmes de profondeur sur des sujets techniques pointus.

---

## 2. Variables d'environnement requises

| Variable             | Description                                                      |
|----------------------|------------------------------------------------------------------|
| `ANTHROPIC_API_KEY`  | Clé API Anthropic                                                |
| `CRON_SECRET`        | Token Bearer protégeant `/api/generate-content` et `DELETE`       |
| `DATABASE_URL`       | PostgreSQL (fourni automatiquement par Replit)                   |
| `SITE_URL`           | URL canonique du site (ex: `https://exemple.be`) — pas de slash final |
| `FAL_KEY`            | Clé API fal.ai pour la génération d'image (créer sur fal.ai/dashboard/keys) |
| `CLOUDINARY_URL`     | URL Cloudinary au format `cloudinary://<key>:<secret>@<cloud>` (dashboard → API Environment variable) |

Dans Replit : **Secrets** → ajouter les 6 variables.

---

## 3. Schéma de base de données

### 3.1 Migration SQL

```sql
CREATE TABLE IF NOT EXISTS seo_pages (
  id                SERIAL PRIMARY KEY,
  slug              TEXT NOT NULL UNIQUE,
  date              TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMP NOT NULL DEFAULT NOW(),
  last_reviewed_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  title             TEXT NOT NULL,
  meta_title        TEXT,
  meta_description  TEXT,
  intro             TEXT NOT NULL DEFAULT '',
  sections          JSONB NOT NULL DEFAULT '[]',
  internal_links    JSONB NOT NULL DEFAULT '[]',
  hero_image_url    TEXT,
  hero_image_alt    TEXT,
  hero_image_prompt TEXT,
  category          TEXT,
  read_time         TEXT,
  tags              TEXT[] DEFAULT '{}',
  status            TEXT NOT NULL DEFAULT 'published'
    CHECK (status IN ('generating', 'published', 'failed', 'archived'))
);

CREATE INDEX IF NOT EXISTS idx_seo_pages_status_date
  ON seo_pages (status, date DESC);

CREATE TABLE IF NOT EXISTS generation_logs (
  id              SERIAL PRIMARY KEY,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  topic           TEXT NOT NULL,
  slug            TEXT,
  status          TEXT NOT NULL,     -- 'success' | 'failed'
  error_message   TEXT,
  input_tokens    INTEGER,
  output_tokens   INTEGER,
  cost_usd        NUMERIC(10, 6),    -- coût Anthropic estimé
  image_cost_usd  NUMERIC(10, 6),    -- coût fal.ai estimé
  model           TEXT
);
```

### 3.2 Schéma Drizzle

```typescript
// artifacts/db/schema.ts
import { pgTable, serial, text, timestamp, jsonb, integer, numeric } from "drizzle-orm/pg-core";

export type Section = { heading: string; content: string };
export type InternalLink = { anchor: string; slug: string };

export const seoPages = pgTable("seo_pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  date: timestamp("date").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastReviewedAt: timestamp("last_reviewed_at").notNull().defaultNow(),
  title: text("title").notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  intro: text("intro").notNull().default(""),
  sections: jsonb("sections").$type<Section[]>().notNull().default([]),
  internalLinks: jsonb("internal_links").$type<InternalLink[]>().notNull().default([]),
  heroImageUrl: text("hero_image_url"),
  heroImageAlt: text("hero_image_alt"),
  heroImagePrompt: text("hero_image_prompt"),
  category: text("category"),
  readTime: text("read_time"),
  tags: text("tags").array().notNull().default([]),
  status: text("status").notNull().default("published"),
});

export const generationLogs = pgTable("generation_logs", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  topic: text("topic").notNull(),
  slug: text("slug"),
  status: text("status").notNull(),
  errorMessage: text("error_message"),
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  costUsd: numeric("cost_usd", { precision: 10, scale: 6 }),
  imageCostUsd: numeric("image_cost_usd", { precision: 10, scale: 6 }),
  model: text("model"),
});
```

---

## 4. Catalogue de sujets (fichier JSON séparé)

Pas hardcodé dans le code — édition sans redéploiement, et plus facile à confier au client.

```json
// artifacts/api-server/src/config/topics.json
[
  { "topic": "Prix d'une réfection de toiture en ardoise à Liège", "category": "Prix & Devis" },
  { "topic": "Comment détecter une fuite de toiture avant l'hiver", "category": "Entretien & Réparation" },
  { "topic": "Couvreur à Liège : comment choisir le bon artisan ?", "category": "Conseils" },
  { "topic": "Toiture ardoise vs tuiles : comparatif pour la Belgique", "category": "Matériaux" },
  { "topic": "Les primes rénovation toiture en Wallonie", "category": "Aides & Primes" },
  { "topic": "Isolation toiture : réduire sa facture énergétique", "category": "Isolation" },
  { "topic": "Quand faut-il remplacer sa toiture en tuiles ?", "category": "Entretien & Réparation" },
  { "topic": "TVA sur rénovation toiture en Belgique", "category": "Aides & Primes" }
]
```

**Règle de sélection :** priorité à un sujet dont le slug n'existe pas encore. Si tous sont générés, on pioche le plus ancien `last_reviewed_at` pour régénération.

---

## 5. Route de génération (`POST /api/generate-content`)

```typescript
// artifacts/api-server/src/routes/generate-content.ts
import { Router, type Request, type Response, type NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { fal } from "@fal-ai/client";
import { v2 as cloudinary } from "cloudinary";
import { eq, asc } from "drizzle-orm";
import { db } from "@workspace/db";
import { seoPages, generationLogs } from "@workspace/db/schema";
import { BUSINESS_CONFIG, type AllowedCategory } from "../config/business";
import topicsCatalog from "../config/topics.json";

// Config des SDK (une fois au démarrage)
fal.config({ credentials: process.env.FAL_KEY });
// cloudinary lit automatiquement CLOUDINARY_URL depuis process.env

const router = Router();

// ---------- Auth Bearer (timing-safe) ----------
function bearerAuth(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.CRON_SECRET;
  if (!secret) { res.status(503).json({ error: "CRON_SECRET non configuré" }); return; }

  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) { res.status(401).json({ error: "Token manquant" }); return; }

  const provided = Buffer.from(auth.slice(7).trim());
  const expected = Buffer.from(secret);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    res.status(401).json({ error: "Token invalide" }); return;
  }
  next();
}

// ---------- Rate limit (anti-abuse si le secret leak) ----------
const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1h
  max: 10,
  message: { error: "Rate limit dépassé (10/h max)" },
});

// ---------- Utilitaires ----------
function slugify(text: string): string {
  return text.toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);
}

// Estimation coût USD (tarifs Sonnet 4.6 — à mettre à jour si modèle change)
function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing: Record<string, { in: number; out: number }> = {
    "claude-sonnet-4-6": { in: 3 / 1_000_000, out: 15 / 1_000_000 },
    "claude-opus-4-7":   { in: 15 / 1_000_000, out: 75 / 1_000_000 },
    "claude-haiku-4-5-20251001": { in: 1 / 1_000_000, out: 5 / 1_000_000 },
  };
  const p = pricing[model] ?? pricing["claude-sonnet-4-6"];
  return inputTokens * p.in + outputTokens * p.out;
}

// ---------- Sélection du sujet ----------
async function pickNextTopic() {
  const existing = await db.select({ slug: seoPages.slug }).from(seoPages);
  const usedSlugs = new Set(existing.map(p => p.slug));
  const unused = topicsCatalog.filter(t => !usedSlugs.has(slugify(t.topic)));

  if (unused.length > 0) {
    return unused[Math.floor(Math.random() * unused.length)];
  }
  // Tous générés : on prend l'article le plus ancien pour régénération
  const [oldest] = await db.select().from(seoPages)
    .where(eq(seoPages.status, "published"))
    .orderBy(asc(seoPages.lastReviewedAt))
    .limit(1);
  const fromCatalog = topicsCatalog.find(t => slugify(t.topic) === oldest?.slug);
  return fromCatalog ?? topicsCatalog[0];
}

// ---------- Schéma de validation du JSON IA ----------
const ArticleSchema = z.object({
  title: z.string().min(10).max(100),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(170).optional(),
  intro: z.string().min(50),
  sections: z.array(z.object({
    heading: z.string().min(3),
    content: z.string().min(50),
  })).min(2).max(6),
  readTime: z.string().optional(),
  tags: z.array(z.string()).max(8).optional(),
  imagePrompt: z.string().min(20).max(400),
  imageAlt: z.string().min(10).max(125),
});

// ---------- Génération ----------
async function generateArticle(topic: string, category: AllowedCategory) {
  const slug = slugify(topic); // slug DÉTERMINISTE (basé sur topic, pas sur titre IA)
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const year = new Date().getFullYear();
  const cfg = BUSINESS_CONFIG;

  // 1. Lock du sujet (placeholder) — empêche la double génération si 2 crons partent en parallèle
  try {
    await db.insert(seoPages).values({
      slug,
      title: `[En cours] ${topic}`,
      intro: "",
      sections: [],
      category,
      status: "generating",
    });
  } catch {
    console.log(`[SEO] Slug ${slug} déjà en cours ou existant — skip`);
    return;
  }

  // 2. Récupération des articles existants pour le maillage interne
  const existing = await db.select({ slug: seoPages.slug, title: seoPages.title })
    .from(seoPages)
    .where(eq(seoPages.status, "published"));

  const existingList = existing.length > 0
    ? existing.slice(0, 15).map(a => `- "${a.title}" → /${cfg.guidesPath.replace(/^\//, "")}/${a.slug}`).join("\n")
    : "(aucun article existant pour le moment)";

  // 3. Prompt — system (instructions stables) + user (sujet)
  const systemPrompt = `Tu es un expert en ${cfg.expertField}. Tu rédiges des articles de blog SEO en ${cfg.language === "fr" ? "français" : cfg.language} pour ${cfg.name}, basée à ${cfg.city} (${cfg.region}, ${cfg.country}).

Règles strictes anti-hallucination :
- N'invente JAMAIS de prix précis. Donne des fourchettes larges (ex: "entre 80 et 150 €/m²") et précise toujours "à titre indicatif, demandez un devis personnalisé".
- Ne cite pas de montants de primes spécifiques. Renvoie vers "le site officiel de la Région wallonne" ou équivalent.
- N'invente pas de réglementations ou de noms d'organismes officiels. Reste sur les principes généraux.
- Utilise ${year} pour toute mention d'année. Évite "récemment" ou "actuellement" sans contexte temporel.

Tu réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans préambule, sans commentaire.`;

  const userPrompt = `Rédige un article SEO sur le sujet suivant.

Sujet : ${topic}
Catégorie : ${category}
Longueur cible : ${cfg.minWords} à ${cfg.maxWords} mots
Ton : professionnel, rassurant, utile à un propriétaire ${cfg.country === "Belgique" ? "belge" : ""}

Articles existants sur le site (pour maillage interne, choisis 1 à 2 liens pertinents à insérer dans le corps des sections au format markdown [texte d'ancre](/slug)) :
${existingList}

Format de réponse (JSON strict) :
{
  "title": "Titre H1 accrocheur (max 70 caractères)",
  "metaTitle": "Titre SEO (max 60 caractères)",
  "metaDescription": "Meta description avec CTA (max 155 caractères)",
  "intro": "Introduction 2-3 paragraphes (~150 mots)",
  "sections": [
    { "heading": "Titre H2", "content": "Corps de section 150-200 mots, intégrant 0-2 liens internes en markdown si pertinent" }
  ],
  "readTime": "X min",
  "tags": ["tag1", "tag2", "tag3"],
  "imagePrompt": "Prompt visuel en anglais pour générer l'image hero (voir règles ci-dessous)",
  "imageAlt": "Texte alternatif en français pour l'image (max 125 caractères)"
}

Règles strictes pour "imagePrompt" :
- Décris UN détail visuel concret du métier : matériau, outil sur matériau, vue d'architecture, structure technique, gros plan de texture.
- JAMAIS l'idée abstraite de l'article. JAMAIS de personnes, visages, mains, corps humain. JAMAIS de texte, panneaux, logos, écrans.
- Format type : "Close-up [ou Macro / Wide-angle / Aerial view / Detail shot] of [sujet matériel concret], [détail de matière/lumière/contexte], [ambiance géographique discrète si pertinent]"
- Exemple bon : "Close-up macro shot of new blue-grey slate tiles overlapping on a traditional Belgian house roof, morning dew on textures, soft diffused daylight, sharp focus on layered patterns"
- Exemple mauvais : "A roofer in Liège fixing a slate roof" (contient une personne)

Règles pour "imageAlt" :
- Phrase descriptive en français de 60 à 125 caractères.
- Décrit ce qui est visible, pas le sujet de l'article.

Génère 3 à 4 sections.`;

  let parsed: z.infer<typeof ArticleSchema>;
  let usage = { input_tokens: 0, output_tokens: 0 };

  try {
    // 4. Appel Claude avec prefill "{" pour garantir un JSON parsable
    const message = await client.messages.create({
      model: cfg.anthropicModel,
      max_tokens: cfg.anthropicMaxTokens,
      system: systemPrompt,
      messages: [
        { role: "user", content: userPrompt },
        { role: "assistant", content: "{" }, // prefill — la réponse commence forcément par {
      ],
    });

    usage = message.usage;
    const rawText = message.content
      .filter(b => b.type === "text")
      .map(b => (b as { type: "text"; text: string }).text)
      .join("");

    // Le prefill "{" n'est PAS dans la réponse — on le rajoute
    parsed = ArticleSchema.parse(JSON.parse("{" + rawText));
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    await db.update(seoPages)
      .set({ status: "failed", title: `[Échec] ${topic}` })
      .where(eq(seoPages.slug, slug));
    await db.insert(generationLogs).values({
      topic, slug, status: "failed", errorMessage: errorMsg, model: cfg.anthropicModel,
    });
    console.error(`[SEO] Échec génération "${topic}":`, errorMsg);
    return;
  }

  // 5. Extraction des liens internes du contenu markdown
  const linkRegex = /\[([^\]]+)\]\(\/([^)]+)\)/g;
  const internalLinks: Array<{ anchor: string; slug: string }> = [];
  for (const section of parsed.sections) {
    let m;
    while ((m = linkRegex.exec(section.content)) !== null) {
      internalLinks.push({ anchor: m[1], slug: m[2].replace(`${cfg.guidesPath.replace(/^\//, "")}/`, "") });
    }
  }

  // 6. Génération de l'image hero (non-bloquante : si échec, l'article est publié sans image)
  let heroImageUrl: string | null = null;
  let imageCostUsd = 0;
  const fullImagePrompt = `${parsed.imagePrompt}, ${cfg.imageGeneration.styleSuffix}. ${cfg.imageGeneration.exclusions}.`;

  if (cfg.imageGeneration.enabled) {
    try {
      const falResult = await fal.subscribe(cfg.imageGeneration.falModel, {
        input: {
          prompt: fullImagePrompt,
          image_size: cfg.imageGeneration.imageSize,
          num_inference_steps: cfg.imageGeneration.inferenceSteps,
          num_images: 1,
          enable_safety_checker: true,
        },
        logs: false,
      });

      const falImageUrl = (falResult.data as { images: { url: string }[] }).images[0]?.url;
      if (!falImageUrl) throw new Error("Aucune image retournée par fal.ai");

      // Upload sur Cloudinary depuis l'URL fal (qui expire vite)
      const uploadResult = await cloudinary.uploader.upload(falImageUrl, {
        folder: `${cfg.imageGeneration.cloudinaryFolder}/${cfg.type}`,
        public_id: slug,
        overwrite: true,
        resource_type: "image",
        // Cloudinary va héberger l'image en haute qualité, les transformations se feront via URL côté frontend
      });

      heroImageUrl = uploadResult.secure_url;
      imageCostUsd = cfg.imageGeneration.falModel.includes("schnell") ? 0.003 : 0.04; // estimation
      console.log(`[SEO] ✓ Image générée pour /${slug}`);
    } catch (imgErr) {
      // Échec image = pas bloquant. L'article sera publié avec un fallback CSS côté frontend.
      console.warn(`[SEO] ⚠ Échec génération image pour /${slug}:`, imgErr instanceof Error ? imgErr.message : imgErr);
    }
  }

  // 7. Sauvegarde finale
  await db.update(seoPages)
    .set({
      title: parsed.title,
      metaTitle: parsed.metaTitle ?? parsed.title,
      metaDescription: parsed.metaDescription ?? "",
      intro: parsed.intro,
      sections: parsed.sections,
      internalLinks,
      heroImageUrl,
      heroImageAlt: heroImageUrl ? parsed.imageAlt : null,
      heroImagePrompt: heroImageUrl ? fullImagePrompt : null,
      readTime: parsed.readTime ?? "5 min",
      tags: parsed.tags ?? [],
      status: "published",
      updatedAt: new Date(),
      lastReviewedAt: new Date(),
    })
    .where(eq(seoPages.slug, slug));

  // 8. Log de succès avec tracking des coûts
  await db.insert(generationLogs).values({
    topic, slug, status: "success",
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    costUsd: estimateCost(cfg.anthropicModel, usage.input_tokens, usage.output_tokens).toFixed(6),
    imageCostUsd: imageCostUsd.toFixed(6),
    model: cfg.anthropicModel,
  });

  console.log(`[SEO] ✓ "${parsed.title}" (/${slug}) — ${usage.input_tokens}+${usage.output_tokens} tokens, image: ${heroImageUrl ? "OK" : "skip"}`);
}

// ---------- Endpoint ----------
router.post("/generate-content", generateLimiter, bearerAuth, async (req: Request, res: Response) => {
  const BodySchema = z.object({
    topic: z.string().optional(),
    category: z.enum(BUSINESS_CONFIG.allowedCategories).optional(),
  });
  const body = BodySchema.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Body invalide", details: body.error.issues }); return; }

  let { topic, category } = body.data;
  if (!topic) {
    const picked = await pickNextTopic();
    topic = picked.topic;
    category = picked.category as AllowedCategory;
  }
  if (!category || !BUSINESS_CONFIG.allowedCategories.includes(category)) {
    category = BUSINESS_CONFIG.defaultCategory as AllowedCategory;
  }

  // Réponse immédiate (202) — génération en arrière-plan
  res.status(202).json({ status: "processing", topic, slug: slugify(topic) });

  generateArticle(topic, category).catch(err => {
    console.error("[SEO] Erreur non gérée:", err);
  });
});

export { router as generateContentRouter, bearerAuth };
```

---

## 6. Routes de lecture

```typescript
// artifacts/api-server/src/routes/seo-pages.ts
import { Router, type Request, type Response } from "express";
import { eq, desc, and, ne } from "drizzle-orm";
import { db } from "@workspace/db";
import { seoPages } from "@workspace/db/schema";
import { bearerAuth } from "./generate-content";

const router = Router();

// Liste des articles publiés
router.get("/seo-pages", async (_req, res) => {
  const pages = await db.select({
    slug: seoPages.slug,
    title: seoPages.title,
    metaDescription: seoPages.metaDescription,
    category: seoPages.category,
    readTime: seoPages.readTime,
    tags: seoPages.tags,
    date: seoPages.date,
    updatedAt: seoPages.updatedAt,
  })
    .from(seoPages)
    .where(eq(seoPages.status, "published"))
    .orderBy(desc(seoPages.date));
  res.json(pages);
});

// Article par slug
router.get("/seo-pages/:slug", async (req: Request, res: Response) => {
  const [page] = await db.select().from(seoPages)
    .where(and(eq(seoPages.slug, req.params.slug), eq(seoPages.status, "published")))
    .limit(1);
  if (!page) { res.status(404).json({ error: "Article introuvable" }); return; }
  res.json(page);
});

// Stats de génération (monitoring)
router.get("/seo-pages/_stats", bearerAuth, async (_req, res) => {
  const { generationLogs } = await import("@workspace/db/schema");
  const { count, sum, sql } = await import("drizzle-orm");
  const [stats] = await db.select({
    totalSuccess: count(),
    totalCostUsd: sum(generationLogs.costUsd),
  }).from(generationLogs).where(eq(generationLogs.status, "success"));
  const [lastRun] = await db.select().from(generationLogs)
    .orderBy(desc(generationLogs.createdAt)).limit(1);
  res.json({ stats, lastRun });
});

// Suppression (protégée)
router.delete("/seo-pages/:slug", bearerAuth, async (req: Request, res: Response) => {
  await db.delete(seoPages).where(eq(seoPages.slug, req.params.slug));
  res.status(204).send();
});

export default router;
```

---

## 7. Sitemap dynamique

```typescript
// artifacts/api-server/src/routes/sitemap.ts
import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { seoPages } from "@workspace/db/schema";
import { BUSINESS_CONFIG } from "../config/business";

const router = Router();

router.get("/sitemap.xml", async (_req, res) => {
  const articles = await db.select({
    slug: seoPages.slug,
    updatedAt: seoPages.updatedAt,
  }).from(seoPages).where(eq(seoPages.status, "published"));

  const base = BUSINESS_CONFIG.siteUrl;
  const guidesPath = BUSINESS_CONFIG.guidesPath;

  const staticEntries = [
    { loc: base, changefreq: "weekly", priority: "1.0" },
    { loc: `${base}${guidesPath}`, changefreq: "daily", priority: "0.8" },
  ];

  const articleEntries = articles.map(p => ({
    loc: `${base}${guidesPath}/${p.slug}`,
    lastmod: p.updatedAt.toISOString().split("T")[0],
    changefreq: "monthly",
    priority: "0.7",
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...articleEntries].map(e => `  <url>
    <loc>${e.loc}</loc>${"lastmod" in e ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.send(xml);
});

export default router;
```

---

## 8. Frontend React — page liste

```tsx
// src/pages/Guides.tsx
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";

type ArticleSummary = {
  slug: string; title: string; metaDescription: string;
  category: string; readTime: string; date: string;
};

export default function Guides() {
  const { data: articles, isLoading } = useQuery<ArticleSummary[]>({
    queryKey: ["seo-pages"],
    queryFn: () => fetch("/api/seo-pages").then(r => r.json()),
  });

  return (
    <>
      <Helmet>
        <title>Guides & Conseils — Nom Entreprise</title>
        <meta name="description" content="Tous nos guides pour mieux comprendre votre toiture, les prix, les primes et l'entretien." />
        <link rel="canonical" href={`${window.location.origin}/guides`} />
      </Helmet>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Nos guides</h1>
        {isLoading ? <p>Chargement…</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles?.map(a => (
              <Link key={a.slug} href={`/guides/${a.slug}`}>
                <article className="border rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
                  <span className="text-xs uppercase text-gray-500">{a.category}</span>
                  <h2 className="text-xl font-semibold mt-2 mb-3">{a.title}</h2>
                  <p className="text-gray-700 text-sm">{a.metaDescription}</p>
                  <span className="text-xs text-gray-500 mt-4 block">{a.readTime}</span>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
```

---

## 9. Frontend React — page article (avec Helmet + JSON-LD + maillage)

```tsx
// src/pages/SeoPage.tsx
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";

type Section = { heading: string; content: string };
type Article = {
  slug: string; title: string; metaTitle: string; metaDescription: string;
  intro: string; sections: Section[]; category: string; readTime: string;
  date: string; updatedAt: string; tags: string[];
  heroImageUrl: string | null; heroImageAlt: string | null;
};

// Composant image responsive Cloudinary avec srcset (WebP/AVIF servis automatiquement via f_auto)
function HeroImage({ src, alt }: { src: string; alt: string }) {
  const t = (w: number) => src.replace("/upload/", `/upload/f_auto,q_auto,w_${w}/`);
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={`${t(1280)} 1x, ${t(2560)} 2x`} />
      <source media="(min-width: 640px)" srcSet={`${t(960)} 1x, ${t(1920)} 2x`} />
      <img
        src={t(640)}
        srcSet={`${t(640)} 1x, ${t(1280)} 2x`}
        alt={alt}
        loading="eager"
        decoding="async"
        width={1280}
        height={720}
        className="w-full aspect-video object-cover rounded-lg"
      />
    </picture>
  );
}

// Fallback visuel si l'image n'a pas pu être générée
function HeroFallback() {
  return (
    <div
      className="w-full aspect-video rounded-lg"
      style={{ background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)" }}
      aria-hidden="true"
    />
  );
}

// Transforme le markdown `[texte](/slug)` en JSX <Link>
function renderWithLinks(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) return <Link key={i} href={m[2]}><a className="text-blue-600 underline">{m[1]}</a></Link>;
    return <span key={i}>{part}</span>;
  });
}

export default function SeoPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = useQuery<Article>({
    queryKey: ["seo-page", slug],
    queryFn: () => fetch(`/api/seo-pages/${slug}`).then(r => {
      if (!r.ok) throw new Error("Not found");
      return r.json();
    }),
  });

  if (isLoading) return <p className="p-12">Chargement…</p>;
  if (!article) return <p className="p-12">Article introuvable.</p>;

  const url = `${window.location.origin}/guides/${article.slug}`;
  const ogImage = article.heroImageUrl
    ? article.heroImageUrl.replace("/upload/", "/upload/f_auto,q_auto,w_1200,h_630,c_fill/")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: ogImage ? [ogImage] : undefined,
    datePublished: article.date,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: "Nom Entreprise" },
    publisher: {
      "@type": "Organization", name: "Nom Entreprise",
      logo: { "@type": "ImageObject", url: `${window.location.origin}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <>
      <Helmet>
        <title>{article.metaTitle ?? article.title}</title>
        <meta name="description" content={article.metaDescription} />
        <link rel="canonical" href={url} />
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.metaTitle ?? article.title} />
        <meta property="og:description" content={article.metaDescription} />
        <meta property="og:url" content={url} />
        <meta property="og:locale" content="fr_BE" />
        {ogImage && <meta property="og:image" content={ogImage} />}
        {ogImage && <meta property="og:image:width" content="1200" />}
        {ogImage && <meta property="og:image:height" content="630" />}
        <meta property="article:published_time" content={article.date} />
        <meta property="article:modified_time" content={article.updatedAt} />
        {/* Twitter */}
        <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />
        <meta name="twitter:title" content={article.metaTitle ?? article.title} />
        <meta name="twitter:description" content={article.metaDescription} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        {/* JSON-LD Article */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <article className="container mx-auto px-4 py-12 max-w-3xl">
        <span className="text-xs uppercase text-gray-500">{article.category}</span>
        <h1 className="text-4xl font-bold mt-2 mb-4">{article.title}</h1>
        <p className="text-sm text-gray-600 mb-8">{article.readTime} · Mis à jour le {new Date(article.updatedAt).toLocaleDateString("fr-BE")}</p>

        <div className="mb-8">
          {article.heroImageUrl
            ? <HeroImage src={article.heroImageUrl} alt={article.heroImageAlt ?? article.title} />
            : <HeroFallback />}
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="lead">{article.intro}</p>
          {article.sections.map((s, i) => (
            <section key={i}>
              <h2>{s.heading}</h2>
              <p>{renderWithLinks(s.content)}</p>
            </section>
          ))}
        </div>

        {article.tags?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map(t => <span key={t} className="text-xs bg-gray-100 px-3 py-1 rounded-full">{t}</span>)}
          </div>
        )}
      </article>
    </>
  );
}
```

**Routes à enregistrer dans App.tsx :**
```tsx
import { HelmetProvider } from "react-helmet-async";

<HelmetProvider>
  <Route path="/guides" component={Guides} />
  <Route path="/guides/:slug" component={SeoPage} />
</HelmetProvider>
```

---

## 10. (Optionnel mais recommandé) Pré-rendu pour les bots

Pour que Google et les crawlers voient le HTML complet sans exécuter JS :

```typescript
// artifacts/api-server/src/middleware/prerender.ts
import type { Request, Response, NextFunction } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "@workspace/db";
import { seoPages } from "@workspace/db/schema";
import { BUSINESS_CONFIG } from "../config/business";

const BOT_REGEX = /bot|crawler|spider|crawling|facebookexternalhit|linkedinbot|whatsapp|telegram|slackbot/i;

export async function prerenderMiddleware(req: Request, res: Response, next: NextFunction) {
  const ua = req.headers["user-agent"] ?? "";
  if (!BOT_REGEX.test(ua)) return next();

  const match = req.path.match(/^\/guides\/([a-z0-9-]+)$/);
  if (!match) return next();

  const [article] = await db.select().from(seoPages)
    .where(and(eq(seoPages.slug, match[1]), eq(seoPages.status, "published")))
    .limit(1);
  if (!article) return next();

  const url = `${BUSINESS_CONFIG.siteUrl}/guides/${article.slug}`;
  const ogImage = article.heroImageUrl
    ? article.heroImageUrl.replace("/upload/", "/upload/f_auto,q_auto,w_1200,h_630,c_fill/")
    : null;

  const html = `<!DOCTYPE html>
<html lang="${BUSINESS_CONFIG.language}">
<head>
<meta charset="UTF-8">
<title>${article.metaTitle ?? article.title}</title>
<meta name="description" content="${article.metaDescription ?? ""}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${article.metaTitle ?? article.title}">
<meta property="og:description" content="${article.metaDescription ?? ""}">
<meta property="og:url" content="${url}">${ogImage ? `
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${ogImage}">` : ""}
<script type="application/ld+json">${JSON.stringify({
  "@context": "https://schema.org", "@type": "Article",
  headline: article.title, description: article.metaDescription,
  image: ogImage ? [ogImage] : undefined,
  datePublished: article.date, dateModified: article.updatedAt,
  author: { "@type": "Organization", name: BUSINESS_CONFIG.authorOrgName },
})}</script>
</head>
<body>
<article>
<h1>${article.title}</h1>${article.heroImageUrl ? `
<img src="${article.heroImageUrl.replace("/upload/", "/upload/f_auto,q_auto,w_1280/")}" alt="${article.heroImageAlt ?? article.title}" width="1280" height="720">` : ""}
<p>${article.intro}</p>
${article.sections.map(s => `<section><h2>${s.heading}</h2><p>${s.content}</p></section>`).join("")}
</article>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
}
```

Branche-le **avant** le serve-static du bundle React dans `index.ts` :
```typescript
app.use(prerenderMiddleware);
app.use(express.static("dist"));
```

---

## 11. Cron job — automatisation

**Service recommandé : [cron-job.org](https://cron-job.org)** (gratuit) ou Replit Scheduled Deployments.

| Paramètre  | Valeur                                                              |
|------------|---------------------------------------------------------------------|
| URL        | `https://votre-app.replit.app/api/generate-content`                |
| Méthode    | `POST`                                                              |
| Headers    | `Authorization: Bearer <CRON_SECRET>`, `Content-Type: application/json` |
| Body       | `{}` (sélection auto) ou `{"topic": "...", "category": "..."}`     |
| Fréquence  | Tous les 2 jours à 8h : `0 8 */2 * *`                              |

**Test manuel :**
```bash
curl -X POST https://votre-app.replit.app/api/generate-content \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## 12. Script CLI — génération locale

Utile pour tester le prompt avant déploiement, ou pour seed initial.

```typescript
// scripts/generate-one.ts
import "dotenv/config";
import { generateArticle, pickNextTopic } from "../artifacts/api-server/src/routes/generate-content";
// (exporter generateArticle et pickNextTopic depuis le module)

const topicArg = process.argv[2];
const categoryArg = process.argv[3];

(async () => {
  if (topicArg) {
    await generateArticle(topicArg, categoryArg as any);
  } else {
    const picked = await pickNextTopic();
    await generateArticle(picked.topic, picked.category as any);
  }
  process.exit(0);
})();
```

Dans `package.json` :
```json
"scripts": {
  "seo:generate": "tsx scripts/generate-one.ts",
  "seo:generate:topic": "tsx scripts/generate-one.ts"
}
```

Usage : `pnpm seo:generate` (sujet auto) ou `pnpm seo:generate:topic "Mon sujet" "Conseils"`.

---

## 13. Monitoring & maintenance

**Voir les stats** (auth Bearer requise) :
```bash
curl https://votre-app.replit.app/api/seo-pages/_stats \
  -H "Authorization: Bearer $CRON_SECRET"
```
Retourne `{ stats: { totalSuccess, totalCostUsd }, lastRun: {...} }`.

**Régénération automatique du contenu vieillissant :** la logique de `pickNextTopic()` re-pioche l'article au `last_reviewed_at` le plus ancien une fois tous les sujets épuisés. Pour forcer une régénération précise :
```bash
curl -X POST .../api/generate-content -d '{"topic":"...","category":"..."}'
```
(l'article existant sera mis à jour via le lock + update).

---

## 14. Adaptation à un autre métier

Trois fichiers à modifier — **aucun autre changement nécessaire** :

1. **`config/business.ts`** — `name`, `type`, `expertField`, `city`, `region`, `siteUrl`, `allowedCategories`, `authorOrgName`.
2. **`config/topics.json`** — remplacer par les sujets du métier.
3. **(éventuellement) `systemPrompt`** dans `generate-content.ts` — adapter les règles anti-hallucination au métier (un avocat n'a pas les mêmes contraintes qu'un couvreur).

**Exemple plombier :**
```typescript
// business.ts
type: "plomberie",
expertField: "plomberie et chauffage en Belgique",
allowedCategories: ["Prix & Devis", "Urgences", "Conseils", "Chauffage", "Sanitaires", "Aides & Primes"],
```

---

## 15. Dépendances

```bash
pnpm add @anthropic-ai/sdk @fal-ai/client cloudinary drizzle-orm zod express-rate-limit react-helmet-async @tanstack/react-query
pnpm add -D drizzle-kit tsx
```

---

## Changelog

### v2.1 (génération d'image)
- **Image hero générée par IA** via Flux Schnell (fal.ai), prompt produit par Claude dans le même appel que l'article (~$0.003/image)
- **Stockage Cloudinary** avec transformations responsive automatiques (`f_auto,q_auto,w_X`) — WebP/AVIF servis via CDN
- **Composant `<HeroImage>`** avec `<picture>` + srcset 1x/2x sur 3 breakpoints
- **Fallback CSS** (gradient) si la génération d'image échoue — l'article reste publié
- **Open Graph image** (`og:image` 1200×630) et Twitter Card `summary_large_image`
- **JSON-LD Article** enrichi avec `image`
- **Pré-rendu bot** mis à jour pour inclure `og:image` et `<img>` dans le HTML servi aux crawlers
- **Exclusions strictes au prompt** : pas d'humains, pas de texte, pas de logos — éliminé les rendus IA visibles
- **Tracking coût image** dans `generation_logs.image_cost_usd`

### v2 vs v1

| Domaine        | v1                                          | v2                                              |
|----------------|---------------------------------------------|-------------------------------------------------|
| Modèle Claude  | `claude-opus-4-5` (n'existe pas)            | `claude-sonnet-4-6` (correct, 5x moins cher)    |
| Parsing JSON   | Regex `match(/\{...\}/)` fragile            | Prefill `{` + Zod                               |
| Slug           | Dérivé du titre (non-déterministe)          | Dérivé du topic (déterministe)                  |
| Concurrence    | Race condition possible                     | Lock via `status='generating'`                  |
| Bearer auth    | Comparaison `===`                           | `timingSafeEqual`                               |
| Rate limit     | Aucun                                       | 10 req/h sur génération                         |
| Validation     | Aucune (parse direct)                       | Zod schema strict                               |
| Anti-hallu.    | Aucune                                      | Règles strictes dans le system prompt           |
| Maillage       | Aucun                                       | Liens internes passés à Claude + parsés         |
| SEO meta       | `useEffect` (invisible aux bots)            | `react-helmet-async` + middleware pré-rendu     |
| JSON-LD        | Absent                                      | Article schema complet                          |
| OG/Twitter     | Absents                                     | Présents                                        |
| Coûts          | Non tracké                                  | Tokens + estimation USD par article             |
| Logs           | `console.error` perdu                       | Table `generation_logs`                         |
| Fraîcheur      | Pas de re-génération                        | `last_reviewed_at` + pickup des plus anciens    |
| Catalogue      | Hardcodé en TS                              | `topics.json` éditable                          |
| Configuration  | Dispersée                                   | `BUSINESS_CONFIG` centralisé                    |
| Domaine        | Hardcodé `votre-domaine.be`                 | `SITE_URL` env var                              |
| CLI            | Absent                                      | `pnpm seo:generate`                             |
| Monitoring     | Absent                                      | Endpoint `/api/seo-pages/_stats`                |

---

Site réalisé par Done. — madebydone.be
