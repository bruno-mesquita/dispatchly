# MEMORY.md - Business Logic & Project Knowledge

- Notifications are sent via queues, never directly in the API.
- Each organization has channel-specific quotas based on their plan.
- NotificationLog status cycle: pending -> sent -> delivered/failed/bounced.
- Templates use `{{variable}}` syntax for interpolation.
- Better Auth sessions are the source of truth for `orgId` via `protectedProcedure`.
- Multi-channel support is mandatory: Email (Resend), SMS (Twilio), Push (Expo).
- Quota check happens in `@dispatchly/billing` before adding to queue.
- Stripe handles subscription states; local DB mirrors relevant tier info.
- Tauri requires static export configuration in `apps/web`.
- Admin permissions are required for template and organization management.
