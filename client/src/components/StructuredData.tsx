import { useEffect } from "react";
import { BRAND } from "@/config/brand";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "done",
  "alternateName": "madebydone",
  "url": "https://madebydone.be",
  "logo": "https://madebydone.be/logo.svg",
  "image": "https://madebydone.be/og-image.jpg",
  "description": "Studio de création web premium pour freelances et PME en Belgique, France et Luxembourg. Sites vitrines, landing pages et sites multi-pages livrés en 72h.",
  "email": BRAND.CONTACT_EMAIL,
  "telephone": BRAND.PHONE,
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "BE",
    "addressRegion": "Wallonie"
  },
  "areaServed": [
    { "@type": "Country", "name": "Belgium" },
    { "@type": "Country", "name": "France" },
    { "@type": "Country", "name": "Luxembourg" }
  ],
  "serviceType": ["Web Design", "Web Development", "Landing Page", "Site Vitrine"],
  "priceRange": "€€",
  "knowsLanguage": ["fr", "en"],
  "sameAs": [
    BRAND.INSTAGRAM_URL,
    BRAND.FACEBOOK_URL
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": "5",
    "reviewCount": "5"
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Salomé L.-G." },
      "datePublished": "2026-02-21",
      "reviewBody": "Ils ont été à l'écoute, ont rapidement saisi les objectifs, les besoins ainsi que la direction artistique. Rapide, premium et accessible, je recommande vivement !",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
    },
    {
      "@type": "Review",
      "author": { "@type": "Organization", "name": "Ideal Fitness Embourg" },
      "datePublished": "2026-02-20",
      "reviewBody": "Nous avons fait appel à Madebydone pour la conception de notre site, depuis nos clients sont ravis ! Service rapide et de qualité.",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Philippe S." },
      "datePublished": "2026-02-08",
      "reviewBody": "Professionnalisme, écoute, de très bons conseils pour réaliser notre website. En 24 heures il était fait. Pour un prix modique il fait des merveilles, très réactif même durant les week-ends.",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
    }
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "done",
  "url": "https://madebydone.be"
};

interface BreadcrumbItem {
  name: string;
  url: string;
}

function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

interface StructuredDataProps {
  type: "localBusiness" | "website" | "breadcrumb";
  breadcrumbs?: BreadcrumbItem[];
}

export function StructuredData({ type, breadcrumbs }: StructuredDataProps) {
  useEffect(() => {
    const id = `structured-data-${type}`;
    let script = document.getElementById(id) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    let schema;
    switch (type) {
      case "localBusiness":
        schema = localBusinessSchema;
        break;
      case "website":
        schema = websiteSchema;
        break;
      case "breadcrumb":
        if (breadcrumbs) {
          schema = createBreadcrumbSchema(breadcrumbs);
        }
        break;
    }

    if (schema) {
      script.textContent = JSON.stringify(schema);
    }

    return () => {
      const existingScript = document.getElementById(id);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [type, breadcrumbs]);

  return null;
}
