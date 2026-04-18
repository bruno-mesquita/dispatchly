# Tarefas de Implementação

## Fase Atual: 4 - Notification Providers

## Fase 3: Database Schemas ✅ COMPLETO
- [x] 3.1 Organization model
- [x] 3.2 NotificationLog model
- [x] 3.3 Template model
- [x] 3.4 Subscription model
- [x] 3.5 Webhook model
- [x] 3.6 Export all models

## Fase 2: Auth ✅ COMPLETO
- [x] 2.1 Instalar @better-auth/stripe + stripe
- [x] 2.2 Configurar plugins (estrutura ready)
- [x] 2.3 Fix async auth (authPromise export)

## Fase 1: Infraestrutura ✅ COMPLETO
- [x] 1.1 Adicionar Redis ao docker-compose.yml
- [x] 1.2 Adicionar env vars
- [x] 1.3 Scripts redis

---

## Fase 4: Notification Providers (próxima)

### Task 4.1: Criar package notifications
**Arquivo:** `packages/notifications/package.json`

```json
{
  "name": "@dispatchly/notifications",
  "type": "module",
  "exports": {
    ".": { "default": "./src/index.ts" }
  },
  "dependencies": {
    "resend": "^4.0.0",
    "twilio": "^5.0.0",
    "expo-server-sdk": "^4.0.0",
    "bullmq": "^5.0.0",
    "ioredis": "^5.0.0"
  }
}
```

### Task 4.2: Criar tipos
**Arquivo:** `packages/notifications/src/types.ts`

```typescript
export type NotificationType = 'email' | 'sms' | 'push';
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';

export interface SendNotificationInput {
  type: NotificationType;
  to: string;
  subject?: string;
  content: string;
  templateId?: string;
  variables?: Record<string, any>;
}

export interface NotificationProvider {
  send(input: SendNotificationInput): Promise<{ messageId: string; status: NotificationStatus }>;
}
```

### Task 4.3: Implementar Resend provider
**Arquivo:** `packages/notifications/src/providers/resend.ts`

Use `resend` package para enviar emails.

### Task 4.4: Implementar Twilio provider
**Arquivo:** `packages/notifications/src/providers/twilio.ts`

Use `twilio` package para enviar SMS.

### Task 4.5: Implementar Expo provider
**Arquivo:** `packages/notifications/src/providers/expo.ts`

Use `expo-server-sdk` para push notifications.