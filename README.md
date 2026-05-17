# Full-Stack Application Blueprint

## Stack
| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Frontend    | React 18 + Vite + TypeScript + Tailwind CSS   |
| State       | Redux Toolkit + React Query (TanStack)        |
| Backend     | Node.js + Express + TypeScript                |
| ORM         | Prisma                                        |
| Database    | PostgreSQL + Redis                            |
| Auth        | JWT (Access + Refresh tokens)                 |
| File Upload | AWS S3 + Multer                               |
| Real-time   | Socket.io                                     |
| CI/CD       | GitHub Actions                                |
| Container   | Docker + Docker Compose                       |

## Quick Start
```bash
# Clone and setup
git clone <repo> && cd fullstack
cp .env.example .env          # fill in your values

# Start databases
docker-compose up -d postgres redis

# Setup backend
cd backend && npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev                   # runs on :5000

# Setup frontend (new terminal)
cd frontend && npm install
npm run dev                   # runs on :3000
```

## Directory Structure
```
fullstack/
├── frontend/                  # React SPA
│   └── src/
│       ├── components/        # Reusable UI components
│       │   ├── ui/            # Base: Button, Input, Modal, Card
│       │   ├── layout/        # Navbar, Sidebar, Footer
│       │   ├── forms/         # LoginForm, RegisterForm, UserForm
│       │   └── charts/        # LineChart, BarChart, DonutChart
│       ├── pages/             # Route-level page components
│       │   ├── auth/          # Login, Register, ForgotPassword
│       │   ├── dashboard/     # Dashboard home
│       │   ├── users/         # User list, detail, edit
│       │   └── settings/      # Profile, Security, Notifications
│       ├── hooks/             # useAuth, useApi, useDebounce
│       ├── services/          # API layer: authService, userService
│       ├── store/             # Redux store + slices
│       │   └── slices/        # authSlice, uiSlice, userSlice
│       ├── utils/             # formatters, validators, helpers
│       └── types/             # TypeScript interfaces
│
├── backend/                   # Express REST API
│   └── src/
│       ├── controllers/       # Request handlers (thin layer)
│       ├── services/          # Business logic (fat layer)
│       ├── repositories/      # Database queries (Prisma calls)
│       ├── middleware/        # auth, error, upload, rateLimit
│       ├── routes/            # Express router definitions
│       ├── models/            # Prisma schema models
│       ├── config/            # db, redis, s3, email config
│       ├── validators/        # Zod schemas for request validation
│       ├── jobs/              # Background jobs (queues)
│       └── utils/             # jwt, bcrypt, s3, email helpers
│
├── database/
│   ├── migrations/            # Prisma migration files
│   ├── seeds/                 # Seed data scripts
│   └── schemas/               # prisma.schema
│
├── infrastructure/
│   ├── docker/                # Dockerfiles
│   ├── nginx/                 # Reverse proxy config
│   ├── terraform/             # IaC for cloud provisioning
│   └── k8s/                   # Kubernetes manifests
│
├── shared/                    # Code shared FE + BE
│   ├── types/                 # Shared TypeScript types
│   ├── constants/             # Shared constants
│   └── utils/                 # Shared utility functions
│
└── .github/
    └── workflows/             # CI/CD pipelines
```
