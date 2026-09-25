# Mission Mindfulness Platform

Premium mobile-first learning platform + admin dashboard for **Mission Mindfulness**.

## Architecture

Monorepo modules:
- `apps/mobile`: React Native/Expo app shell with web/PWA-friendly structure.
- `apps/admin`: Next.js + TypeScript secure admin shell.
- `apps/api-worker`: Cloudflare Worker APIs for secure payments and enrollment verification.
- `packages/shared`: shared types/constants.
- `supabase/migrations`: PostgreSQL schema + RLS policies.
- `supabase/seed`: editable initial content seed.
- `tests`: worker and policy-level tests.

## Confirmed public profile seeded

- Brand: Mission Mindfulness
- Tagline: Nurturing Human Intelligence
- Company: MMI Mindworks (OPC) Private Limited
- Support: +91 89487 65399 / missionmindfulness16@gmail.com
- Website: https://missionmindfulness.in
- Social: YouTube / Instagram / Facebook (as published)

## Hard rules implemented

- Payment amount is server-side from DB; frontend cannot set final amount.
- Razorpay verification endpoints in Worker only.
- `payments` and `enrollments` are blocked from client writes via RLS.
- Enrollment grant is idempotent.
- Legal, GST/tax, refund, WhatsApp, trainer/schedule uncertainties are editable and marked review-required.
- No production deployment should happen without explicit approval.

## Environment variables

Public (frontend-safe):
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_PAYMENTS_URL`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`

Server/secret (Worker only):
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

Also required for Worker auth:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `RAZORPAY_KEY_ID`

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Apply Supabase migration in your Supabase project.
3. Run seed SQL after migration.
4. Configure env vars in local runtime files (`.env.local`, `.dev.vars`) without committing secrets.

## Scripts

From repository root:
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run lint`

## Staging first policy

- Use separate staging Supabase + Razorpay test keys.
- Never use production keys in staging.
- Keep staging and production domains separate.

## Current implementation scope in this commit

- Phase 1 foundations: monorepo, schema, RLS baseline, admin/mobile shells, seed content.
- Phase 3 foundations: Worker routes for `/v2/create-order`, `/v2/verify`, and Razorpay webhook.
- Placeholders for phase 2/4 UI workflows and full CRUD screens are scaffolded and ready.

## Legal and claims policy

All legal pages are draft editable content marked as requiring lawyer review. The app must avoid fabricated outcomes, credentials, testimonials, or certifications.
