import { FileText, Languages, Search, BarChart3, Mail, ShoppingBag } from "lucide-react";

export type Option = {
  label: string;
  price: string;
  description: string;
  icon: typeof FileText;
};

export const options: Option[] = [
  {
    label: "Formulaire multi-étapes",
    price: "149€",
    description: "Qualifie les demandes sans échanges inutiles.",
    icon: FileText,
  },
  {
    label: "Page supplémentaire",
    price: "99€",
    description: "Ajouter une page sans refaire le design.",
    icon: FileText,
  },
  {
    label: "Langue supplémentaire",
    price: "99€",
    description: "Traduction fournie par vous, intégration par nous.",
    icon: Languages,
  },
  {
    label: "SEO avancé",
    price: "249€",
    description: "Optimisations + structure + contenu orienté recherche.",
    icon: Search,
  },
  {
    label: "Tracking / Datalayer",
    price: "199€",
    description: "Prêt pour campagnes, events propres.",
    icon: BarChart3,
  },
  {
    label: "Newsletter setup",
    price: "149€",
    description: "Mailchimp/Brevo, template + capture.",
    icon: Mail,
  },
  {
    label: "E-commerce Shopify",
    price: "749€",
    description: "Base solide, thème, paiements, config.",
    icon: ShoppingBag,
  },
];
