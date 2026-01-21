# SEO Map — madebydone.be

> Document de référence pour les titles, metas et H1 de chaque page.
> Dernière mise à jour : Janvier 2026

---

## Pages principales

### HOME `/`

| Élément | Valeur |
|---------|--------|
| **Title** | Studio web, Ads & tracking en Belgique \| done |
| **Meta description** | Sites rapides, landing pages, Google Ads, Meta Ads et tracking GA4. Simple, beau, efficace — madebydone.be |
| **H1** | Web. Ads. Tracking. Done. |
| **Canonical** | https://madebydone.be/ |
| **Mots-clés secondaires** | studio web belgique, création site vitrine, tracking GA4, agence digitale |
| **Notes** | Page principale one-page. Schema: Organization + WebSite |

---

### RÉALISATIONS `/realisations`

| Élément | Valeur |
|---------|--------|
| **Title** | Projets & études de cas \| done |
| **Meta description** | Avant/Après, choix UX, tracking, Ads. Des projets livrés vite, propres, mesurables. |
| **H1** | Before → Done. |
| **Canonical** | https://madebydone.be/realisations |
| **Mots-clés secondaires** | portfolio web, études de cas, projets web belgique |
| **Notes** | Galerie projets. Schema: BreadcrumbList |

---

### MENTIONS LÉGALES `/mentions`

| Élément | Valeur |
|---------|--------|
| **Title** | Mentions légales \| done |
| **Meta description** | Informations légales du studio done. Éditeur, hébergeur et conditions d'utilisation. |
| **H1** | Mentions légales |
| **Canonical** | https://madebydone.be/mentions |
| **Notes** | noindex, follow recommandé |

---

### POLITIQUE DE CONFIDENTIALITÉ `/privacy`

| Élément | Valeur |
|---------|--------|
| **Title** | Politique de confidentialité \| done |
| **Meta description** | Comment done collecte et protège vos données personnelles. RGPD compliant. |
| **H1** | Politique de confidentialité |
| **Canonical** | https://madebydone.be/privacy |
| **Notes** | noindex, follow recommandé |

---

### COOKIES `/cookies`

| Élément | Valeur |
|---------|--------|
| **Title** | Politique cookies \| done |
| **Meta description** | Utilisation des cookies sur madebydone.be. Paramètres et consentement. |
| **H1** | Politique cookies |
| **Canonical** | https://madebydone.be/cookies |
| **Notes** | noindex, follow recommandé |

---

## Pages futures (TODO)

### SERVICES `/services`

| Élément | Valeur |
|---------|--------|
| **Title** | Services web, Ads & GA4 \| done |
| **Meta description** | Landing pages, sites vitrines, tracking GA4, Google Ads & Meta Ads. Une exécution claire, orientée conversion. |
| **H1** | Des services simples. Et bien faits. |
| **Mots-clés secondaires** | landing page belgique, google ads, meta ads, tracking analytics |

---

### À PROPOS `/about`

| Élément | Valeur |
|---------|--------|
| **Title** | À propos du studio done \| madebydone.be |
| **Meta description** | done = fait. Un studio orienté clarté, conversion et performance, sans blabla ni sites lourds. |
| **H1** | done = fait. |
| **Mots-clés secondaires** | agence web liège, studio digital belgique |

---

### CONTACT `/contact`

| Élément | Valeur |
|---------|--------|
| **Title** | Contact & brief projet \| done |
| **Meta description** | Décris ton besoin (site, ads, tracking). Réponse claire, rapide, et un plan concret. |
| **H1** | Un projet ? On le rend done. |
| **Mots-clés secondaires** | devis site web, brief projet, contact agence web |

---

## Structured Data (JSON-LD)

### Organization (global)
```json
{
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
}
```

### WebSite (global)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "done",
  "url": "https://madebydone.be",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://madebydone.be/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### BreadcrumbList (pages internes)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Accueil",
      "item": "https://madebydone.be"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Réalisations",
      "item": "https://madebydone.be/realisations"
    }
  ]
}
```

---

## Checklist SEO

- [x] Titles uniques par page
- [x] Meta descriptions persuasives
- [x] H1 unique et cohérent
- [ ] Images avec alt text
- [ ] Canonical sur chaque page
- [ ] OpenGraph complet
- [ ] Twitter Cards
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] JSON-LD Organization
- [ ] JSON-LD WebSite
- [ ] Favicon complet (ico, apple-touch-icon)

---

## Comment éditer

1. **Metas globales** : `client/index.html` (fallback)
2. **Metas par page** : Composant `<SEO>` dans chaque page
3. **Contenu H1** : Dans les composants de section
4. **Structured Data** : `client/src/components/StructuredData.tsx`
