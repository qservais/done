# done Studio - Web Creation Platform

## Overview

This is a premium web design studio website ("done") targeting freelancers and small businesses in Belgium, France, and Luxembourg. The platform serves as both a marketing showcase and a lead generation funnel, featuring a multi-step qualification wizard to capture potential clients.

The site is built as a mobile-first, single-page application with smooth animations and a premium agency aesthetic. It offers tiered website packages (Vitrine Premium 197€, Multi-pages Premium 297€, Boutique E-commerce 797€) with 3 monthly accompagnement modules (Essentiel 5,90€, Performance 19,90€, Google Boost 49,90€).

**Domain**: madebydone.be

## User Preferences

- Preferred communication style: Simple, everyday language
- DA (Direction Artistique): minimal, éditorial, premium, micro-animations sobres, mobile-first
- Codes DA validés: signature "DONE", capsules typo, concept "Before → Done", ton transparent/léger mais pro

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS v4 with custom CSS variables for theming
- **UI Components**: shadcn/ui (New York style) built on Radix UI primitives
- **Animations**: Framer Motion for scroll reveals and transitions
- **State Management**: TanStack React Query for server state
- **SEO**: Custom SEO component with dynamic meta tags per page

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **API Design**: RESTful endpoints under `/api/` prefix
- **Build System**: esbuild for server bundling, Vite for client

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines the leads table
- **Migrations**: Managed via `drizzle-kit push`

### Key Design Patterns
- **Monorepo Structure**: `client/`, `server/`, `shared/` directories with path aliases
- **Shared Types**: Schema and types in `shared/` are imported by both client and server
- **Configuration Centralization**: Brand constants in `client/src/config/brand.ts`
- **Component Organization**: UI primitives in `components/ui/`, layout in `components/layout/`, page sections in `components/sections/`, signature in `components/signature/`
- **Editable Data**: Content in `client/src/data/` (pricing, projects, options, faq, copy)

### Signature Components
Located in `client/src/components/signature/`:
- **DoneUnderline**: Ink-style underline (6-8px) with hover animation, accent color at 30% opacity
- **DoneStamp**: Circular "DONE" stamp, rotated -12deg, opacity ~15%, sizes sm/md/lg
- **MadeByDoneBadge**: Pill badge "made by done" with outline/subtle variants
- **BeforeAfter**: Draggable image comparison slider with "Avant/Done" labels (ready for V2)

All signature components support `prefers-reduced-motion`.

### Email Integration
- **Service**: Resend for transactional emails
- **Purpose**: Lead confirmation and studio notification emails
- **Studio Email**: hello@madebydone.be

## SEO Implementation

### Files & Documentation
- **SEO Map**: `/docs/seo-map.md` - All titles, metas, H1 per route
- **Sitemap**: `/public/sitemap.xml` - Static sitemap
- **Robots**: `/public/robots.txt` - Search engine directives

### Components
- **SEO Component**: `client/src/components/SEO.tsx` - Dynamic meta tags
- **Structured Data**: `client/src/components/StructuredData.tsx` - JSON-LD schemas

### Per-Page SEO
Each page uses the `<SEO>` component with:
- Unique title
- Meta description
- Canonical URL
- OpenGraph tags
- Twitter Cards

## External Dependencies

### Third-Party Services
- **Resend**: Email delivery service (requires `RESEND_API_KEY` environment variable)
- **PostgreSQL**: Database (requires `DATABASE_URL` environment variable)

### Key NPM Packages
- `drizzle-orm` + `drizzle-zod`: Database ORM with Zod schema validation
- `@tanstack/react-query`: Server state management
- `framer-motion`: Animation library
- `wouter`: Lightweight React router
- Radix UI components: Accessible UI primitives
- `resend`: Email API client

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `RESEND_API_KEY`: Resend email service API key
- `STUDIO_EMAIL`: Destination email for lead notifications (optional, defaults to hello@madebydone.be)
- `HUBSPOT_ACCESS_TOKEN`: HubSpot Private App access token for CRM contact sync (requires `crm.objects.contacts.write` + `crm.objects.contacts.read` scopes)

## Routes

| Route | Page | SEO |
|-------|------|-----|
| `/` | Home (one-page) | Indexed |
| `/realisations` | Portfolio projets | Indexed |
| `/mentions` | Mentions légales | noindex |
| `/privacy` | Politique vie privée | noindex |
| `/cookies` | Politique cookies | noindex |
| `/admin` | Dashboard admin | Protected, noindex |

## Recent Changes (March 2026)

- **Refonte tarifaire complète**: 3 nouveaux packs one-time (Vitrine Premium 197€, Multi-pages Premium 297€, Boutique E-commerce 797€) + 3 modules mensuels (Essentiel 5,90€, Performance 19,90€, Google Boost 49,90€)
- Subscription section redesigned: 3 cards côte à côte avec highlight sur Performance (recommandé)
- Hero chip updated: "dès 5,90€/mois" + disclaimer "À partir de 197€ + module mensuel dès 5,90€"
- FAQ updated to reference the 3 modules and their prices
- LeadWizard micro-copy updated with new pricing
- Split single "name" field into separate "Prénom" (firstname) and "Nom" (lastname) fields in lead wizard
- Added HubSpot CRM integration: server-side sync via `server/hubspot.ts` pushes all lead data (firstname, lastname, email, phone, company, activity, zone, pages, languages, domain, timing, message) to HubSpot contacts on every form submission
- Replaced "abonnement" terminology with "accompagnement" site-wide (Packs, Subscription section, FAQ, Hero)

## Earlier Changes (February 2026)

- Replaced pack selection (Step 2) with needs assessment: pages, languages, domain, timing
- Added beforeunload/visibilitychange listeners to save abandon data on page leave (fixes missing step 3 data)
- Admin shows all needs data: pages, languages, domain, timing with human-readable labels
- Email notifications show needs breakdown instead of pack/price
- Simplified lead wizard from 7 steps to 3 steps: Activité, Besoins, Coordonnées
- Added "Devis gratuit, sans engagement" messaging throughout
- Name field now optional in lead form (email OR phone required)
- Removed honeypot anti-spam — all visitors welcome
- Fixed duplicate abandons: unique sessionId constraint + onConflictDoUpdate
- Added client projects: Restaurant Danieli, Mabelita Pizza, DSV Burgers, Ideal Fitness

## Earlier Changes (January 2026)

- Added comprehensive SEO: titles, metas, structured data, sitemap
- Created signature components: DoneUnderline, DoneStamp, MadeByDoneBadge, BeforeAfter
- Improved Hero with DoneUnderline on "moins qu'un logo"
- Enhanced project cards with browser frame design and MadeByDoneBadge
- Added DoneStamp to Process, Realizations, Footer sections
- Added micro-copy "done" at strategic places (Hero, Packs, Contact)
- Added captions under key sections
- All animations respect prefers-reduced-motion
- Added mobile sticky CTA
- Unified capsules/tags styling
- Created editable data files for content management (copy.ts, projects.ts with before/after)
