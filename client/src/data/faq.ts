export type FAQItem = {
  question: string;
  answer: string;
};

export const faqItems: FAQItem[] = [
  {
    question: "Pourquoi l'accompagnement est-il obligatoire ?",
    answer: "L'accompagnement couvre l'hébergement, la sécurité et la maintenance de votre site. Sans lui, le site n'est pas en ligne. On propose 3 modules selon vos besoins : Essentiel (5,90€/mois), Performance (19,90€/mois) ou Google Boost (49,90€/mois).",
  },
  {
    question: "Comment se passe la livraison en 72h ?",
    answer: "Dès réception de vos contenus (textes, images, logo), on démarre. Vous recevez une V1 fonctionnelle sous 72h. Ensuite, on affine ensemble via 1 aller-retour inclus.",
  },
  {
    question: "Et si je veux arrêter l'accompagnement ?",
    answer: "Vous êtes libre. On vous transfère les fichiers source. Par contre, l'hébergement et la maintenance s'arrêtent. Il faudra trouver une autre solution pour garder votre site en ligne.",
  },
  {
    question: "Les prix incluent-ils la TVA ?",
    answer: "Les prix affichés sont HT pour les professionnels. Pour les particuliers belges, ajoutez 21% de TVA.",
  },
  {
    question: "Et si mon site explose en trafic ?",
    answer: "Bonne nouvelle ! On adapte la solution technique avec vous. Pas de surprises, on en discute pour trouver la meilleure option.",
  },
  {
    question: "C'est quoi les ajustements inclus dans Performance ?",
    answer: "Avec le Module Performance, vous pouvez demander des modifications régulières (texte, image, ajout de section simple). Chaque demande couvre un lot de changements réalisables en 30 minutes, avec un aller-retour de validation.",
  },
];
