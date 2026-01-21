# done Studio - Web Creation Platform

## Overview

This is a premium web design studio website ("done") targeting freelancers and small businesses in Belgium, France, and Luxembourg. The platform serves as both a marketing showcase and a lead generation funnel, featuring a multi-step qualification wizard to capture potential clients.

The site is built as a mobile-first, single-page application with smooth animations and a premium agency aesthetic. It offers tiered website packages (Landing, Vitrine, Multi-page) with a subscription-based hosting and maintenance model.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS v4 with custom CSS variables for theming
- **UI Components**: shadcn/ui (New York style) built on Radix UI primitives
- **Animations**: Framer Motion for scroll reveals and transitions
- **State Management**: TanStack React Query for server state

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
- **Component Organization**: UI primitives in `components/ui/`, layout in `components/layout/`, page sections in `components/sections/`

### Email Integration
- **Service**: Resend for transactional emails
- **Purpose**: Lead confirmation and studio notification emails

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
- `STUDIO_EMAIL`: Destination email for lead notifications (optional, defaults in code)