export const PACK_PRICES = {
  vitrine: 197,
  multipage: 297,
  ecommerce: 797,
};

export const MODULE_PRICES = {
  essentiel: 5.90,
  performance: 19.90,
  boost: 49.90,
};

export const packs = [
  {
    id: "vitrine",
    name: "Site Vitrine Premium",
    price: PACK_PRICES.vitrine,
    description: "Pour démarrer proprement.",
    features: [
      "Site one-page professionnel",
      "Jusqu'à 6 sections sur mesure",
      "Formulaire contact / devis intégré",
      "Design moderne & responsive",
      "Nom de domaine + mise en ligne",
    ],
  },
  {
    id: "multipage",
    name: "Site Multi-pages Premium",
    price: PACK_PRICES.multipage,
    popular: true,
    description: "Pour capter et convertir.",
    features: [
      "Structure multi-pages sur mesure",
      "Système de réservation intégré",
      "Interface d'administration",
      "Design professionnel & responsive",
      "Nom de domaine + mise en ligne",
    ],
  },
  {
    id: "ecommerce",
    name: "Boutique E-commerce",
    price: PACK_PRICES.ecommerce,
    description: "Pour vendre en ligne.",
    features: [
      "Boutique en ligne complète",
      "Catalogue produits illimité",
      "Paiement sécurisé (Stripe/Mollie)",
      "Admin complet (commandes, stocks)",
      "Design optimisé conversion",
      "Nom de domaine + mise en ligne",
    ],
  },
];

export const modules = [
  {
    id: "essentiel",
    name: "Module Essentiel",
    price: MODULE_PRICES.essentiel,
    description: "L'essentiel pour rester en ligne.",
    features: [
      "Hébergement du site",
      "Sécurité & certificat SSL",
      "Sauvegardes automatiques",
      "Monitoring de disponibilité",
    ],
  },
  {
    id: "performance",
    name: "Module Performance",
    price: MODULE_PRICES.performance,
    popular: true,
    description: "Le suivi complet, mois après mois.",
    features: [
      "Hébergement & sécurité",
      "Sauvegardes automatiques",
      "Maintenance & mises à jour",
      "Améliorations / ajustements",
      "Support sous 48h",
      "Conseils d'optimisation",
    ],
  },
  {
    id: "boost",
    name: "Module Google Boost",
    price: MODULE_PRICES.boost,
    description: "Pour dominer Google.",
    features: [
      "Tout ce qui est dans Performance",
      "Optimisation SEO continue",
      "Amélioration référencement Google",
      "Optimisation technique (vitesse)",
      "Conseils visibilité & positionnement",
    ],
  },
];
