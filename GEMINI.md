# GEMINI.md - Dispatchly Context

This file serves as the primary instructional context for Gemini CLI when working on the `dispatchly` project.

## Project Overview
`dispatchly` is a multi-channel Notification-as-a-Service (SaaS) platform built with the **Better T Stack**. It allows organizations to send emails (via Resend), SMS (via Twilio), and push notifications (via Expo) with full tracking, automatic retries via BullMQ, and template management.

### Key Technologies
- **Runtime:** Bun 1.3.12+
- **Monorepo Manager:** Turborepo
- **Frontend:** Next.js 16.2.0 (App Router)
- **Backend:** ElysiaJS 1.4.28
- **API Layer:** tRPC 11.16.0
- **Database:** MongoDB with Mongoose
- **Authentication:** Better Auth (with Organization & Admin plugins)
- **Queue System:** BullMQ + Redis
- **Payments:** Stripe
- **Desktop:** Tauri (for native desktop integration)
- **Styling:** TailwindCSS 4 + shadcn/ui
- **Quality:** Biome (linting/formatting), TypeScript 6

## Project Architecture
The project follows a monorepo structure:

- `apps/web`: Next.js frontend (Port 3001). Contains the dashboard, auth pages, and admin panel.
- `apps/server`: ElysiaJS backend (Port 3000). Host for tRPC API and Better Auth.
- `packages/api`: Shared tRPC routers and procedures (Notifications, Templates, Billing, etc.).
- `packages/auth`: Better Auth configuration and plugin integration.
- `packages/db`: Mongoose models (Organization, NotificationLog, Template, Subscription, Webhook).
- `packages/notifications`: Multi-channel providers (Resend, Twilio, Expo) and BullMQ worker logic.
- `packages/billing`: Stripe integration, plan definitions, and quota management.
- `packages/ui`: Shared shadcn/ui primitives.
- `packages/env`: Type-safe environment variable management.

## Getting Started & Key Commands

### Installation
```bash
bun install
```

### Infrastructure
The project requires MongoDB and Redis.
```bash
bun run db:start     # Starts MongoDB via Docker
bun run redis:start  # Starts Redis via Docker
```

### Development
```bash
bun run dev          # Starts all applications (Web & Server)
bun run dev:web      # Starts only the Next.js frontend
bun run dev:server   # Starts only the Elysia backend
```

### Desktop Development
```bash
cd apps/web && bun run desktop:dev
```

### Quality & Maintenance
```bash
bun run check        # Run Biome linting and formatting (auto-fix)
bun run check-types  # Run TypeScript type checking across the monorepo
bun run test         # Run tests using Bun's native test runner
```

## Development Conventions

1. **Type Safety:** Always use `@dispatchly/env` for environment variables. Ensure all tRPC procedures are properly typed and use `protectedProcedure` or `adminProcedure` where necessary.
2. **UI Components:**
   - Shared primitives go into `packages/ui/src/components`.
   - Add new shared components via: `npx shadcn@latest add <component> -c packages/ui`.
   - Import shared components via: `import { ... } from "@dispatchly/ui/components/..."`.
3. **API Design:** New features should be implemented as tRPC routers in `packages/api/src/routers` and registered in the main `appRouter`.
4. **Data Management:** All database interactions should use the Mongoose models defined in `packages/db/src/models`.
5. **Notifications:** Use the `addToQueue()` function from `@dispatchly/notifications` to send notifications; avoid calling providers directly in the API layer.
6. **Git Flow:** Husky and Lefthook are configured for pre-commit checks. Ensure `bun run check` passes before committing.

## Current Project Status (Phase 9: Frontend Dashboard)
- **Infrastructure:** MongoDB, Redis, and BullMQ setup is complete.
- **Backend:** tRPC routers for Notifications, Templates, and Billing are implemented.
- **Providers:** Resend (Email), Twilio (SMS), and Expo (Push) integrations are ready.
- **Frontend:** Dashboard implementation is in progress (Notifications list, Template CRUD, Billing management).

## Contextual Files
- `README.md`: High-level overview and getting started.
- `PROJECT.md`: Detailed architecture, schema definitions, and implementation checklist.
- `TASKS.md`: Current progress and pending tasks.
- `bts.jsonc`: Better T Stack configuration.
