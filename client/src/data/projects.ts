export type Project = {
  name: string;
  url: string;
  image?: string;
  beforeImage?: string;
  afterImage?: string;
  tags: string[];
  gradient: string;
  hasReview?: boolean;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    name: "Heron Solutions",
    url: "https://heronsolutions.be/",
    image: "/projects/heronsolutions_opt.webp",
    tags: ["Artisan", "Multi-page"],
    gradient: "from-green-800 to-green-950",
  },
  {
    name: "Smart Analytics",
    url: "https://smartanalytics.be/",
    image: "/projects/smartanalytics_opt.webp",
    tags: ["Tech", "Multi-page"],
    gradient: "from-violet-600 to-purple-900",
  },
  {
    name: "Mon Réseau Immo",
    url: "https://monreseauimmo.be/",
    image: "/projects/reseauimmo_opt.webp",
    tags: ["Immobilier", "Événementiel"],
    gradient: "from-amber-900 to-zinc-900",
  },
  {
    name: "Évasion Camping-Car",
    url: "https://mon-evasion-campingcar.fr/",
    image: "/projects/evasioncampingcar_opt.webp",
    tags: ["Tourisme", "Vitrine"],
    gradient: "from-slate-700 to-slate-900",
  },
  {
    name: "Moment.",
    url: "https://moment-liege.be/",
    image: "/projects/moment_opt.webp",
    tags: ["Restaurant", "Premium"],
    gradient: "from-stone-800 to-zinc-900",
    featured: true,
  },
  {
    name: "Kuore",
    url: "https://kuore.be/",
    image: "/projects/kuore_opt.webp",
    tags: ["Restaurant", "Premium"],
    gradient: "from-red-900 to-stone-800",
  },
  {
    name: "Mood BXL",
    url: "https://moodbxl.com/",
    image: "/projects/moodbxl_opt.webp",
    tags: ["Mode", "E-commerce"],
    gradient: "from-stone-200 to-stone-400",
    featured: true,
  },
  {
    name: "Laser Cleaning",
    url: "https://lasercleaning.pro/",
    image: "/projects/lasercleaning_opt.webp",
    tags: ["Industrie", "Multi-page"],
    gradient: "from-slate-800 to-orange-900",
    featured: true,
  },
  {
    name: "Assitel",
    url: "https://assitel.be/",
    image: "/projects/assitel_opt.webp",
    tags: ["Médical", "Services"],
    gradient: "from-blue-600 to-blue-900",
    featured: true,
  },
  {
    name: "Kollich Toiture",
    url: "https://kollich-toiture.be/",
    image: "/projects/kollichtoiture_opt.webp",
    tags: ["Artisan", "Multi-page"],
    gradient: "from-orange-600 to-zinc-800",
    featured: true,
  },
  {
    name: "Maymss Car",
    url: "https://maymss-car.be/",
    image: "/projects/maymsscar_opt.webp",
    tags: ["Automobile", "Multi-page"],
    gradient: "from-zinc-800 to-yellow-900",
    featured: true,
  },
  {
    name: "Frites & Fourchettes",
    url: "https://fritesetfourchette.be/",
    image: "/projects/fritesetfourchette_opt.webp",
    tags: ["Friterie", "Livraison"],
    gradient: "from-amber-700 to-yellow-900",
  },
  {
    name: "Quebarca",
    url: "https://quebarca.be/",
    image: "/projects/quebarca_opt.webp",
    tags: ["Bar", "Restaurant"],
    gradient: "from-red-900 to-zinc-900",
  },
  {
    name: "Vert & Vie",
    url: "https://www.vert-et-vie.be/",
    image: "/projects/vertetvie_opt.webp",
    tags: ["Association", "Multi-page"],
    gradient: "from-green-700 to-green-900",
  },
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
    name: "Ideal Fitness",
    url: "https://idealfitness.be/",
    image: "/projects/idealfitness_opt.webp",
    tags: ["Sport", "Coaching"],
    gradient: "from-yellow-400 to-zinc-800",
    hasReview: true,
  },
  {
    name: "Maison Vagabonde",
    url: "https://maisonvagabonde.be/",
    image: "/projects/maisonvagabonde_opt.webp",
    tags: ["Vitrine", "Premium"],
    gradient: "from-amber-100 to-amber-200",
    hasReview: true,
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
    name: "Nov-Isol",
    url: "https://www.nov-isol.be/",
    image: "/projects/novisol_opt.webp",
    tags: ["Isolation", "Multi-page"],
    gradient: "from-green-600 to-green-800",
  },
  {
    name: "On-Site Medic",
    url: "https://onsitemedic.be/",
    image: "/projects/onsitemedic_opt.webp",
    tags: ["Médical", "Multi-page"],
    gradient: "from-sky-600 to-blue-900",
  },
  {
    name: "SL Rejointoyage",
    url: "https://sl-rejointoyage.be/",
    image: "/projects/slrejointoyage_opt.webp",
    tags: ["Artisan", "Vitrine"],
    gradient: "from-stone-700 to-stone-900",
  },
  {
    name: "Urban Jungle",
    url: "https://www.urban-jungle.net/",
    image: "/projects/urbanjungle_opt.webp",
    tags: ["Événementiel", "Premium"],
    gradient: "from-yellow-400 to-pink-600",
  },
];

export const featuredProjects = projects.filter(p => p.featured);
