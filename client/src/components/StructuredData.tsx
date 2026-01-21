import { useEffect } from "react";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "done",
  "url": "https://madebydone.be",
  "logo": "https://madebydone.be/logo.svg",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hello@madebydone.be",
    "contactType": "customer service",
    "areaServed": ["BE", "FR", "LU"],
    "availableLanguage": ["French", "English"]
  },
  "sameAs": [
    "https://instagram.com/done.studio"
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
  type: "organization" | "website" | "breadcrumb";
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
      case "organization":
        schema = organizationSchema;
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
