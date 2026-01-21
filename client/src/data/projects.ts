export type Project = {
  name: string;
  url: string;
  image?: string;
  beforeImage?: string;
  afterImage?: string;
  tags: string[];
  gradient: string;
};

export const projects: Project[] = [
  {
    name: "Maison Vagabonde",
    url: "https://maisonvagabonde.be/",
    tags: ["Vitrine", "Premium"],
    gradient: "from-amber-100 to-amber-200",
    beforeImage: "/projects/placeholder-before.svg",
    afterImage: "/projects/placeholder-after.svg",
  },
  {
    name: "Aste Esthétique",
    url: "https://aste-esthetique.be/",
    tags: ["Beauté", "Contact"],
    gradient: "from-rose-100 to-rose-200",
    beforeImage: "/projects/placeholder-before.svg",
    afterImage: "/projects/placeholder-after.svg",
  },
  {
    name: "Dissocle",
    url: "https://dissocle.space/",
    tags: ["Architecture", "Multi-page"],
    gradient: "from-slate-100 to-slate-200",
    beforeImage: "/projects/placeholder-before.svg",
    afterImage: "/projects/placeholder-after.svg",
  },
  {
    name: "Mouv'Up",
    url: "http://mouvup.be/",
    tags: ["Sport", "Vitrine"],
    gradient: "from-sky-100 to-sky-200",
    beforeImage: "/projects/placeholder-before.svg",
    afterImage: "/projects/placeholder-after.svg",
  },
  {
    name: "Examtir",
    url: "https://examtir.be/",
    tags: ["Formation", "Contact"],
    gradient: "from-emerald-100 to-emerald-200",
    beforeImage: "/projects/placeholder-before.svg",
    afterImage: "/projects/placeholder-after.svg",
  },
  {
    name: "Valoriser Mon Entreprise",
    url: "https://valorisermonentreprise.be/",
    tags: ["Corporate", "Premium"],
    gradient: "from-violet-100 to-violet-200",
    beforeImage: "/projects/placeholder-before.svg",
    afterImage: "/projects/placeholder-after.svg",
  },
];
