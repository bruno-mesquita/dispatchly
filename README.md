# Dispatchly

Multi-channel Notification-as-a-Service (SaaS) platform built with the **Better T Stack**. Send emails, SMS, and push notifications with full tracking and automatic retries.

## Features

- **Multi-Channel** - Email (Resend), SMS (Twilio), and Push (Expo)
- **Queue System** - Reliable delivery with BullMQ and Redis
- **Template Engine** - Manage reusable notification templates with variable interpolation
- **Billing** - Plan-based quota management with Stripe integration
- **Dashboard** - Modern dashboard built with Next.js 16 and shadcn/ui
- **Desktop App** - Native experience powered by Tauri
- **Type Safety** - End-to-end type safety with tRPC and Bun

## Project Structure

```
dispatchly/
├── apps/
│   ├── web/         # Dashboard & Landing Pages (Next.js)
│   ├── server/      # Backend API & Auth (Elysia, tRPC)
│   └── client/      # Desktop Application (Tauri)
├── packages/
│   ├── ui/          # Shared Design System (shadcn/ui)
│   ├── api/         # Business Logic & tRPC Routers
│   ├── notifications/ # Delivery Providers & Queues
│   └── db/          # Database Models (MongoDB/Mongoose)
```

## Getting Started

1. **Install Dependencies**
   ```bash
   bun install
   ```

2. **Setup Infrastructure**
   Start MongoDB and Redis via Docker:
   ```bash
   bun run db:start
   bun run redis:start
   ```

3. **Run Development Server**
   ```bash
   bun run dev
   ```
   - Web App: [http://localhost:3001](http://localhost:3001)
   - API Server: [http://localhost:3000](http://localhost:3000)

## Documentation for Developers & Agents

For detailed technical architecture, coding conventions, request flows, and environment variable configuration, please refer to:

👉 **[AGENTS.md](AGENTS.md)**
