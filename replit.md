# done Studio - Web Creation Platform

## Overview

This is a premium web design studio website ("done") targeting freelancers and small businesses in Belgium, France, and Luxembourg. The platform serves as both a marketing showcase and a lead generation funnel, featuring a multi-step qualification wizard to capture potential clients.

The site is built as a mobile-first, single-page application with smooth animations and a premium agency aesthetic. It offers tiered website packages (Landing, Vitrine, Multi-page) with a subscription-based hosting and maintenance model.

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

## Routes

| Route | Page | SEO |
|-------|------|-----|
| `/` | Home (one-page) | Indexed |
| `/realisations` | Portfolio projets | Indexed |
| `/mentions` | Mentions légales | noindex |
| `/privacy` | Politique vie privée | noindex |
| `/cookies` | Politique cookies | noindex |
| `/admin` | Dashboard admin | Protected, noindex |

## Recent Changes (February 2026)

- Simplified lead wizard from 7 steps to 3 steps: Activité, Pack, Coordonnées
- Added "Devis gratuit, sans engagement" messaging throughout
- Name field now optional in lead form (email OR phone required)
- Removed honeypot anti-spam — all visitors welcome
- Fixed duplicate abandons: unique sessionId constraint + onConflictDoUpdate
- Fixed phone number display in admin for anonymous leads
- Updated email templates for simplified form (handles missing name/email gracefully)
- Admin dashboard reflects 3-step progress instead of 7
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
