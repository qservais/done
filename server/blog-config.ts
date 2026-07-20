// Configuration métier du générateur de blog SEO.
// Seul fichier (avec blog-topics.json) à modifier pour adapter ce système à un autre client.
export const BLOG_CONFIG = {
  name: "done",
  expertField: "création de sites web et présence digitale pour indépendants et PME",
  serviceArea: "Belgique, en France et au Luxembourg",
  authorOrgName: "done",

  siteUrl: process.env.SITE_URL ?? "https://madebydone.be",
  guidesPath: "/guides",

  language: "fr",
  locale: "fr_BE",

  allowedCategories: [
    "Prix & Devis",
    "Conseils Web",
    "SEO & Visibilité",
    "Tendances Design",
    "E-commerce",
    "Outils & IA",
  ] as const,

  defaultCategory: "Conseils Web",
  minWords: 600,
  maxWords: 900,

  anthropicModel: "claude-sonnet-5",
  anthropicMaxTokens: 4096,

  imageGeneration: {
    enabled: true,
    falModel: "fal-ai/flux/schnell" as const,
    imageSize: "landscape_16_9" as const,
    inferenceSteps: 4,
    styleSuffix: "professional editorial photography, natural lighting, clean composition, sharp focus, high detail",
    exclusions: "no people, no humans, no faces, no hands, no body parts, no text, no words, no letters, no logos, no watermarks, no signs",
    cloudinaryFolder: "seo-blog/done",
  },
} as const;

export type BlogCategory = (typeof BLOG_CONFIG.allowedCategories)[number];
