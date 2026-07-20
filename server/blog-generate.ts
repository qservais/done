import { timingSafeEqual } from "node:crypto";
import type { Request, Response, NextFunction } from "express";
// zodOutputFormat() converts the schema via zod/v4's toJSONSchema internally
// and needs a schema built from that same API — the classic "zod" import
// (v3, used everywhere else in this app) has a different internal shape and
// crashes at runtime (`Cannot read properties of undefined (reading 'def')`).
import { z } from "zod/v4";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { fal } from "@fal-ai/client";
import { v2 as cloudinary } from "cloudinary";
import { storage } from "./storage";
import { BLOG_CONFIG, type BlogCategory } from "./blog-config";
import topicsCatalog from "./blog-topics.json";

fal.config({ credentials: process.env.FAL_KEY });
// cloudinary lit automatiquement CLOUDINARY_URL depuis process.env

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ---------- Auth Bearer (timing-safe) pour le cron externe ----------
export function blogBearerAuth(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    res.status(503).json({ error: "CRON_SECRET non configuré" });
    return;
  }

  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token manquant" });
    return;
  }

  const provided = Buffer.from(auth.slice(7).trim());
  const expected = Buffer.from(secret);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    res.status(401).json({ error: "Token invalide" });
    return;
  }
  next();
}

// Plage Unicode des diacritiques combinants (U+0300 à U+036F), isolés par
// normalize("NFD"). Construite via codes numériques pour rester compatible
// avec le target JS de ce projet (le flag /u des regex n'est pas autorisé).
const COMBINING_DIACRITICS = new RegExp(
  `[${String.fromCharCode(0x300)}-${String.fromCharCode(0x36f)}]`,
  "g",
);

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

// Tarifs par million de tokens (mettre à jour si le modèle change)
const PRICING: Record<string, { in: number; out: number }> = {
  "claude-sonnet-5": { in: 3 / 1_000_000, out: 15 / 1_000_000 },
  "claude-opus-4-8": { in: 5 / 1_000_000, out: 25 / 1_000_000 },
  "claude-haiku-4-5": { in: 1 / 1_000_000, out: 5 / 1_000_000 },
};

function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const p = PRICING[model] ?? PRICING["claude-sonnet-5"];
  return inputTokens * p.in + outputTokens * p.out;
}

export async function pickNextTopic(): Promise<{ topic: string; category: string }> {
  const usedSlugs = new Set(await storage.getAllSeoPageSlugs());
  const unused = topicsCatalog.filter((t) => !usedSlugs.has(slugify(t.topic)));

  if (unused.length > 0) {
    return unused[Math.floor(Math.random() * unused.length)];
  }
  // Tous générés : on reprend l'article le plus ancien pour régénération
  const oldest = await storage.getOldestPublishedSeoPage();
  const fromCatalog = topicsCatalog.find((t) => slugify(t.topic) === oldest?.slug);
  return fromCatalog ?? topicsCatalog[0];
}

// ---------- Schéma de validation du JSON IA (aussi utilisé comme structured output) ----------
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

export async function generateArticle(topic: string, category: BlogCategory): Promise<void> {
  const slug = slugify(topic);
  const year = new Date().getFullYear();
  const cfg = BLOG_CONFIG;

  // 1. Lock du sujet (placeholder) — empêche la double génération si 2 crons partent en parallèle
  const locked = await storage.createSeoPageLock({
    slug,
    title: `[En cours] ${topic}`,
    category,
  });
  if (!locked) {
    console.log(`[Blog] Slug ${slug} déjà en cours ou existant — skip`);
    return;
  }

  // 2. Récupération des articles existants pour le maillage interne
  const existing = await storage.getPublishedSeoPageTitles();
  const existingList = existing.length > 0
    ? existing.slice(0, 15).map((a) => `- "${a.title}" → ${cfg.guidesPath}/${a.slug}`).join("\n")
    : "(aucun article existant pour le moment)";

  const systemPrompt = `Tu es un expert en ${cfg.expertField}. Tu rédiges des articles de blog SEO en français pour ${cfg.name}, un studio de création web actif en ${cfg.serviceArea}.

Règles strictes anti-hallucination :
- N'invente JAMAIS de prix précis pour des prestations web. Donne des fourchettes larges (à titre indicatif) et précise toujours qu'un devis personnalisé permet d'obtenir un prix exact.
- N'invente pas de statistiques précises (pourcentages, classements Google, volumes de recherche) sans les présenter comme des ordres de grandeur généraux.
- N'invente pas de noms d'outils, de plugins ou de technologies spécifiques que tu ne peux pas confirmer.
- Utilise ${year} pour toute mention d'année. Évite "récemment" ou "actuellement" sans contexte temporel.`;

  const userPrompt = `Rédige un article SEO sur le sujet suivant.

Sujet : ${topic}
Catégorie : ${category}
Longueur cible : ${cfg.minWords} à ${cfg.maxWords} mots
Ton : professionnel, clair, utile à un·e indépendant·e ou une PME en Belgique, en France ou au Luxembourg

Articles existants sur le site (pour maillage interne, choisis 1 à 2 liens pertinents à insérer dans le corps des sections au format markdown [texte d'ancre](/slug)) :
${existingList}

Règles strictes pour "imagePrompt" :
- Décris UN détail visuel concret et abstrait : écran affichant des blocs UI colorés, poste de travail, détail graphique, texture.
- JAMAIS l'idée abstraite de l'article. JAMAIS de personnes, visages, mains, corps humain. JAMAIS de texte lisible, panneaux, logos.
- Format type : "Close-up [ou Wide-angle / Detail shot] of [sujet matériel concret], [détail de matière/lumière/contexte]"
- Exemple bon : "Close-up shot of a laptop screen displaying abstract colorful UI blocks and grid layouts, soft natural daylight, shallow depth of field, modern minimalist desk"
- Exemple mauvais : "A designer working on a website" (contient une personne)

Règles pour "imageAlt" :
- Phrase descriptive en français de 60 à 125 caractères, décrivant ce qui est visible (pas le sujet de l'article).

Génère 3 à 4 sections.`;

  let parsed: z.infer<typeof ArticleSchema>;
  let usage = { input_tokens: 0, output_tokens: 0 };

  try {
    // Sortie structurée garantie par le serveur (le prefill assistant classique
    // renvoie 400 sur les modèles actuels — on passe par output_config.format).
    // `zodOutputFormat`'s .d.ts constrains against the bare "zod" (v3) ZodType,
    // even though it needs a zod/v4 schema at runtime — cast to bypass that
    // upstream type/runtime mismatch (see the zod/v4 import note above).
    const message = await anthropic.messages.parse({
      model: cfg.anthropicModel,
      max_tokens: cfg.anthropicMaxTokens,
      thinking: { type: "disabled" },
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      output_config: { format: zodOutputFormat(ArticleSchema as unknown as Parameters<typeof zodOutputFormat>[0]) },
    });

    if (message.stop_reason === "refusal") {
      throw new Error("Génération refusée par le modèle (garde-fou sécurité)");
    }
    if (!message.parsed_output) {
      throw new Error("Réponse IA non conforme au schéma attendu");
    }

    usage = message.usage;
    parsed = message.parsed_output;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    await storage.updateSeoPageBySlug(slug, { status: "failed", title: `[Échec] ${topic}` });
    await storage.createGenerationLog({
      topic, slug, status: "failed", errorMessage: errorMsg, model: cfg.anthropicModel,
    });
    console.error(`[Blog] Échec génération "${topic}":`, errorMsg);
    return;
  }

  // 3. Extraction des liens internes du contenu markdown
  const linkRegex = /\[([^\]]+)\]\(\/([^)]+)\)/g;
  const internalLinks: Array<{ anchor: string; slug: string }> = [];
  for (const section of parsed.sections) {
    let m;
    while ((m = linkRegex.exec(section.content)) !== null) {
      internalLinks.push({ anchor: m[1], slug: m[2].replace(`${cfg.guidesPath.replace(/^\//, "")}/`, "") });
    }
  }

  // 4. Génération de l'image hero (non-bloquante : si échec, l'article est publié sans image)
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

      const uploadResult = await cloudinary.uploader.upload(falImageUrl, {
        folder: cfg.imageGeneration.cloudinaryFolder,
        public_id: slug,
        overwrite: true,
        resource_type: "image",
      });

      heroImageUrl = uploadResult.secure_url;
      imageCostUsd = cfg.imageGeneration.falModel.includes("schnell") ? 0.003 : 0.04;
      console.log(`[Blog] Image générée pour ${cfg.guidesPath}/${slug}`);
    } catch (imgErr) {
      console.warn(`[Blog] Échec génération image pour ${cfg.guidesPath}/${slug}:`, imgErr instanceof Error ? imgErr.message : imgErr);
    }
  }

  // 5. Sauvegarde finale
  await storage.updateSeoPageBySlug(slug, {
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
  });

  // 6. Log de succès avec tracking des coûts
  await storage.createGenerationLog({
    topic, slug, status: "success",
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    costUsd: estimateCost(cfg.anthropicModel, usage.input_tokens, usage.output_tokens).toFixed(6),
    imageCostUsd: imageCostUsd.toFixed(6),
    model: cfg.anthropicModel,
  });

  console.log(`[Blog] "${parsed.title}" (${cfg.guidesPath}/${slug}) publié — ${usage.input_tokens}+${usage.output_tokens} tokens, image: ${heroImageUrl ? "OK" : "aucune"}`);
}
