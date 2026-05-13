smartspoon-platform/
│
├── README.md
├── .gitignore
├── package.json
├── turbo.json
├── docker-compose.yml
├── .env.example
│
├── apps/
│   │
│   ├── admin-dashboard/
│   │   │
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── globals.css
│   │   │   │
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── revenue/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── retention/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── forecasting/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── logistics/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── dispatch/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── routes/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── tracking/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── kitchens/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── inventory/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── procurement/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── batches/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── waste/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── parents/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── profiles/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── complaints/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── subscriptions/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── invoices/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── plans/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── renewals/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── riders/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── gps/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── attendance/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── performance/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── schools/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── students/
│   │   │   │   └── attendance/
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── users/
│   │   │   │   ├── permissions/
│   │   │   │   └── integrations/
│   │   │   │
│   │   │   └── api/
│   │   │       ├── auth/
│   │   │       ├── analytics/
│   │   │       ├── logistics/
│   │   │       ├── kitchens/
│   │   │       ├── parents/
│   │   │       ├── riders/
│   │   │       ├── subscriptions/
│   │   │       ├── schools/
│   │   │       └── notifications/
│   │   │
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── modal.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── chart.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   └── loader.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   ├── analytics/
│   │   │   ├── logistics/
│   │   │   ├── kitchen/
│   │   │   ├── parents/
│   │   │   ├── subscriptions/
│   │   │   └── riders/
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useRealtime.ts
│   │   │   ├── useDeliveries.ts
│   │   │   └── useAnalytics.ts
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── analytics.service.ts
│   │   │   ├── logistics.service.ts
│   │   │   ├── kitchen.service.ts
│   │   │   ├── parent.service.ts
│   │   │   ├── subscription.service.ts
│   │   │   ├── rider.service.ts
│   │   │   ├── school.service.ts
│   │   │   └── notification.service.ts
│   │   │
│   │   ├── store/
│   │   │   ├── auth.store.ts
│   │   │   ├── logistics.store.ts
│   │   │   ├── kitchen.store.ts
│   │   │   ├── analytics.store.ts
│   │   │   └── subscription.store.ts
│   │   │
│   │   ├── lib/
│   │   │   ├── supabase.ts
│   │   │   ├── auth.ts
│   │   │   ├── maps.ts
│   │   │   ├── realtime.ts
│   │   │   ├── permissions.ts
│   │   │   ├── validators.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── types/
│   │   │   ├── auth.ts
│   │   │   ├── analytics.ts
│   │   │   ├── logistics.ts
│   │   │   ├── kitchens.ts
│   │   │   ├── parents.ts
│   │   │   ├── subscriptions.ts
│   │   │   ├── riders.ts
│   │   │   └── schools.ts
│   │   │
│   │   ├── middleware.ts
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.js
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   └── .env.local
│   │
│   ├── parent-app/
│   │   ├── lib/
│   │   │   ├── main.dart
│   │   │   ├── core/
│   │   │   ├── models/
│   │   │   ├── providers/
│   │   │   ├── services/
│   │   │   ├── widgets/
│   │   │   └── screens/
│   │   ├── android/
│   │   ├── ios/
│   │   ├── pubspec.yaml
│   │   └── analysis_options.yaml
│   │
│   └── rider-app/
│       ├── lib/
│       │   ├── main.dart
│       │   ├── services/
│       │   ├── widgets/
│       │   └── screens/
│       ├── android/
│       ├── ios/
│       └── pubspec.yaml
│
├── packages/
│   ├── ui/
│   ├── config/
│   ├── eslint-config/
│   ├── tsconfig/
│   └── shared-types/
│
├── backend/
│   │
│   ├── sql/
│   │   ├── schema.sql
│   │   ├── policies.sql
│   │   ├── indexes.sql
│   │   ├── triggers.sql
│   │   ├── functions.sql
│   │   └── seed.sql
│   │
│   ├── edge-functions/
│   │   ├── notifications/
│   │   ├── renewals/
│   │   ├── logistics/
│   │   ├── analytics/
│   │   └── forecasting/
│   │
│   ├── realtime/
│   │   ├── deliveries.ts
│   │   ├── kitchens.ts
│   │   ├── riders.ts
│   │   └── notifications.ts
│   │
│   ├── cron/
│   │   ├── renewals.ts
│   │   ├── inventory.ts
│   │   ├── delivery-alerts.ts
│   │   └── analytics-refresh.ts
│   │
│   └── workers/
│       ├── route-optimizer.ts
│       ├── demand-forecast.ts
│       └── notification-worker.ts
│
├── docs/
│   ├── architecture/
│   ├── workflows/
│   ├── deployment/
│   ├── sop/
│   ├── operations/
│   └── api/
│
├── infrastructure/
│   ├── vercel/
│   ├── firebase/
│   ├── supabase/
│   ├── monitoring/
│   ├── docker/
│   └── nginx/
│
└── scripts/
    ├── setup.sh
    ├── deploy.sh
    ├── backup.sh
    └── seed.ts