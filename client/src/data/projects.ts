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
    name: "Restaurant Danieli",
    url: "https://restaurantdanieli.be/",
    image: "/projects/danieli_opt.webp",
    tags: ["Restaurant", "Premium"],
    gradient: "from-amber-800 to-stone-900",
  },
  {
    name: "Mabelita Pizza",
    url: "https://mabelita-pizza.be/",
    image: "/projects/mabelita_opt.webp",
    tags: ["Restaurant", "Foodtruck"],
    gradient: "from-red-600 to-orange-500",
  },
  {
    name: "DSV Burgers",
    url: "https://dsvburgers.be/",
    image: "/projects/dsvburgers_opt.webp",
    tags: ["Restaurant", "Livraison"],
    gradient: "from-yellow-400 to-red-500",
  },
  {
    name: "Ideal Fitness",
    url: "https://idealfitness.be/",
    image: "/projects/idealfitness_opt.webp",
    tags: ["Sport", "Coaching"],
    gradient: "from-yellow-400 to-zinc-800",
  },
  {
    name: "Maison Vagabonde",
    url: "https://maisonvagabonde.be/",
    image: "/projects/maisonvagabonde_opt.webp",
    tags: ["Vitrine", "Premium"],
    gradient: "from-amber-100 to-amber-200",
  },
  {
    name: "Aste Esthétique",
    url: "https://aste-esthetique.be/",
    image: "/projects/aste_opt.webp",
    tags: ["Beauté", "Contact"],
    gradient: "from-rose-100 to-rose-200",
  },
  {
    name: "Dissocle",
    url: "https://dissocle.space/",
    image: "/projects/dissocle_opt.webp",
    tags: ["Architecture", "Multi-page"],
    gradient: "from-slate-100 to-slate-200",
  },
  {
    name: "Mouv'Up",
    url: "http://mouvup.be/",
    image: "/projects/mouvup_opt.webp",
    tags: ["Sport", "Vitrine"],
    gradient: "from-sky-100 to-sky-200",
  },
  {
    name: "Examtir",
    url: "https://examtir.be/",
    image: "/projects/examtir_opt.webp",
    tags: ["Formation", "Contact"],
    gradient: "from-emerald-100 to-emerald-200",
  },
  {
    name: "Valoriser Mon Entreprise",
    url: "https://valorisermonentreprise.be/",
    image: "/projects/valoriser_opt.webp",
    tags: ["Corporate", "Premium"],
    gradient: "from-violet-100 to-violet-200",
  },
];
