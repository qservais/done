export type FAQItem = {
  question: string;
  answer: string;
};

export const faqItems: FAQItem[] = [
  {
    question: "Pourquoi l'accompagnement est-il obligatoire ?",
    answer: "L'accompagnement couvre l'hébergement, la maintenance, la sécurité et les petits ajustements mensuels. C'est ce qui nous permet de proposer des prix aussi bas sur les packs. Un site abandonné = un site vulnérable.",
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
    question: "C'est quoi les 2 demandes d'ajustement/mois ?",
    answer: "Chaque mois, vous pouvez demander 2 lots de petits changements (texte, image, ajout de section simple). Chaque demande = jusqu'à 30 min de travail + 1 aller-retour de validation.",
  },
];
