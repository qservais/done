# SEO Map — madebydone.be

> Document de référence pour les titles, metas et H1 de chaque page.
> Dernière mise à jour : Janvier 2026

---

## Pages principales

### HOME `/`

| Élément | Valeur |
|---------|--------|
| **Title** | Sites web premium à prix accessible \| done |
| **Meta description** | Sites web & landing pages au rendu haut de gamme, pensés mobile-first, livrés en 72h. Simple, beau, efficace — madebydone.be |
| **H1** | Un site premium qui coûte moins qu'un logo. |
| **Canonical** | https://madebydone.be/ |
| **Mots-clés secondaires** | site web premium, landing page, création site belgique, mobile-first |
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

### GUIDES `/guides`

| Élément | Valeur |
|---------|--------|
| **Title** | Guides & conseils — done. · Sites web Belgique |
| **Meta description** | Conseils sur la création de sites web, le SEO et le digital pour indépendants et PME en Belgique, France et Luxembourg. |
| **H1** | Nos guides. |
| **Canonical** | https://madebydone.be/guides |
| **Notes** | Liste des articles publiés via `GET /api/seo-pages`. Schema: BreadcrumbList |

---

### ARTICLE DE GUIDE `/guides/:slug`

| Élément | Valeur |
|---------|--------|
| **Title** | `{metaTitle ?? title} — done.` |
| **Meta description** | Générée par article (`metaDescription`, ≤170 caractères) |
| **H1** | Titre de l'article |
| **Canonical** | https://madebydone.be/guides/:slug |
| **Notes** | Contenu généré automatiquement — voir "Générateur de blog SEO" ci-dessous. Schema: Article + BreadcrumbList. Pré-rendu HTML pour les bots via middleware Express (avant le bundle React). |

---

## Générateur de blog SEO (`/guides`)

Système de génération automatique d'articles pour alimenter `/guides`, ajouté en juillet 2026.

- **Génération** : `POST /api/generate-content` (Bearer `CRON_SECRET`) — Claude (`claude-sonnet-5`) génère un article via sortie structurée (`output_config.format`, pas de prefill assistant — ce dernier renvoie 400 sur les modèles actuels), validé côté client par le même schéma Zod.
- **Image hero** : générée par Flux Schnell (fal.ai) et hébergée sur Cloudinary ; non bloquant — si `FAL_KEY`/`CLOUDINARY_URL` sont absents ou que la génération échoue, l'article est publié avec un fallback dégradé CSS.
- **Config métier** : `server/blog-config.ts` (catégories, longueur cible, modèle, service area) + `server/blog-topics.json` (catalogue de sujets, éditable sans redéploiement).
- **Fichiers serveur** : `server/blog-generate.ts` (génération), `server/blog-routes.ts` (routes + sitemap dynamique), `server/blog-prerender.ts` (pré-rendu bots), `server/storage.ts` (accès DB).
- **Monitoring** : `GET /api/seo-pages/_stats` (Bearer `ADMIN_PASSWORD`) — coût total et dernière génération.
- **Cron externe** : voir `replit.md` pour les variables d'environnement requises (`CRON_SECRET`, `FAL_KEY`, `CLOUDINARY_URL`, `SITE_URL` optionnel).

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
- [x] Sitemap.xml (dynamique, `GET /sitemap.xml`, inclut les articles `/guides`)
- [x] Robots.txt (`client/public/robots.txt`)
- [ ] JSON-LD Organization
- [ ] JSON-LD WebSite
- [ ] Favicon complet (ico, apple-touch-icon)

---

## Comment éditer

1. **Metas globales** : `client/index.html` (fallback)
2. **Metas par page** : Composant `<SEO>` dans chaque page
3. **Contenu H1** : Dans les composants de section
4. **Structured Data** : `client/src/components/StructuredData.tsx`
