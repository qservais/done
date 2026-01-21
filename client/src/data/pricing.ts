export const PACK_PRICES = {
  landing: 197,
  vitrine: 297,
  multipage: 497,
};

export const SUB_PRICE = 19.99;

export const packs = [
  {
    id: "landing",
    name: "Landing Express",
    price: PACK_PRICES.landing,
    description: "Pour démarrer proprement.",
    baseFeatures: [
      "1 page claire et premium",
      "Sections essentielles",
      "Design mobile-first",
      "1 langue (FR)",
      "1 aller-retour inclus",
    ],
  },
  {
    id: "vitrine",
    name: "Vitrine Contact",
    price: PACK_PRICES.vitrine,
    popular: true,
    description: "Pour capter des clients.",
    includesPrevious: "Landing Express",
    extras: [
      "Formulaire de contact efficace",
      "Réception directe par email",
      "Protection anti-spam",
    ],
  },
  {
    id: "multipage",
    name: "Multi-page Premium",
    price: PACK_PRICES.multipage,
    description: "Pour tout expliquer.",
    includesPrevious: "Vitrine Contact",
    extras: [
      "Jusqu'à 5 pages complètes",
      "Animations légères premium",
      "SEO de base (structure clean)",
    ],
  },
];
