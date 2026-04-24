# Tarefas de Implementação - Dispatchly SaaS

> **Última atualização:** 2026-04-22

---

## ✅ Fases Completas

### Fase 1: Infraestrutura
- [x] 1.1 Redis no docker-compose.yml
- [x] 1.2 Env vars (RESEND_*, TWILIO_*, EXPO_*, STRIPE_*)
- [x] 1.3 Scripts docker
- [x] 1.4 Infraestrutura de testes (docker-compose.test.yml)

### Fase 2: Auth
- [x] 2.1 Instalar @better-auth/stripe + stripe
- [x] 2.2 Configurar plugins (estrutura ready)
- [x] 2.3 Fix async auth (authPromise export)

### Fase 3: Database Schemas
- [x] 3.1 Organization model
- [x] 3.2 NotificationLog model
- [x] 3.3 Template model
- [x] 3.4 Subscription model
- [x] 3.5 Webhook model
- [x] 3.6 Export all models

### Fase 4: Notification Providers
- [x] 4.1 @dispatchly/notifications package
- [x] 4.2 Types (NotificationType, Status, SendNotificationInput)
- [x] 4.3 ResendProvider (email)
- [x] 4.4 TwilioProvider (SMS)
- [x] 4.5 ExpoProvider (Push)
- [x] 4.6 getProvider() factory

### Fase 5: Queue System
- [x] 5.1 BullMQ setup
- [x] 5.2 Filas (email, sms, push, retry)
- [x] 5.3 addToQueue() function
- [x] 5.4 Worker com retry logic

### Fase 6: Templates
- [x] 6.1 @dispatchly/templates package
- [x] 6.2 CRUD service
- [x] 6.3 applyTemplate()

### Fase 7: Billing
- [x] 7.1 @dispatchly/billing package
- [x] 7.2 Plans (Free, Basic, Pro, Enterprise)
- [x] 7.3 createCheckoutSession()
- [x] 7.4 createPortalSession()
- [x] 7.5 handleWebhook()
- [x] 7.6 checkQuota()

### Fase 8: APIs tRPC
- [x] 8.1 notificationsRouter
- [x] 8.2 templatesRouter
- [x] 8.3 billingRouter

### Fase 9: Frontend - Dashboard
- [x] 9.1 notifications/send - Enviar 1 notificação
- [x] 9.2 notifications/batch - Enviar múltiplas
- [x] 9.3 templates - Listar/criar/editar
- [x] 9.4 logs - Ver histórico
- [x] 9.5 settings - Config org
- [x] 9.6 billing - Ver plano/Upgrade

### Fase 10: Frontend - Admin
- [x] 10.1 /admin/organizations
- [x] 10.2 /admin/subscriptions
- [x] 10.3 /admin/logs
- [x] 10.4 /admin/analytics

### Fase 11: Testes
- [x] 11.1 Testes de providers
- [x] 11.2 Testes de queue
- [x] 11.3 Testes de APIs
- [x] 11.4 Testes de billing
- [x] 11.5 Testes E2E (Auth, Billing, Notifications)

---

## 📁 Estrutura do Projeto

```
dispatchly/
├── packages/
│   ├── notifications/src/
│   │   ├── providers/resend.ts, twilio.ts, expo.ts
│   │   ├── queue/worker.ts
│   │   └── types/index.ts
│   ├── db/src/models/
│   │   ├── organization.model.ts
│   │   ├── notification-log.model.ts
│   │   ├── template.model.ts
│   │   ├── subscription.model.ts
│   │   └── webhook.model.ts
│   ├── billing/src/index.ts
│   ├── templates/src/service.ts
│   └── api/src/routers/
│       ├── notifications.ts
│       ├── templates.ts
│       └── billing.ts
├── apps/server/src/index.ts
└── apps/web/src/app/
    └── dashboard/
```

---

## 🔧 Comandos

```bash
# Infra
bun run db:start
bun run redis:start

# Desenvolvimento
bun run dev

# Verificar tipos
bun run check-types
bun run check

# Testes
bun test
```

---

## 📋 Referência

Ver `PROJECT.md` para contexto completo.
