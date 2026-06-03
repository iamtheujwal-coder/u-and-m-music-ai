# U&M Music AI

> Your AI Music Studio at Home.

Turn your raw voice into a studio-quality song. Record from home. Upload your vocals. Let AI clean, mix, master, and produce your music.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi)

## Features

- 🎤 **AI Vocal Cleanup** — Remove noise, echo, and room interference
- 🎵 **Smart Pitch Correction** — Natural-sounding auto-tune
- 🎧 **AI Mix & Master** — Professional-grade mixing at a click
- 🎼 **Instrumental Generation** — AI-generated background music from text prompts
- 🧬 **Voice DNA** — Train your own personal voice model
- 📊 **AI Vocal Coach** — Get personalized singing feedback
- 📦 **Release Kit** — Everything needed to release your song
- 💳 **Razorpay Payments** — Subscription management
- 🔒 **Consent-first** — Voice data protection and rights management

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), TypeScript |
| Styling | Tailwind CSS 4, custom design system |
| Animations | Framer Motion |
| State | Zustand |
| Auth | Supabase Auth (Google OAuth + Email/OTP) |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Payments | Razorpay |
| Audio Service | Python FastAPI (mock, ready for real AI models) |

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+ (for audio service)
- Supabase account
- Razorpay account

### 1. Clone and install

```bash
git clone <repo-url>
cd uandm-music-ai
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase and Razorpay keys
```

### 3. Set up database

Run the SQL in `supabase/schema.sql` in your Supabase SQL editor.

### 4. Run the app

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5. Run the audio service (optional)

```bash
cd audio-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Project Structure

```
├── src/
│   ├── app/                    # Next.js pages (App Router)
│   │   ├── (main)/             # Authenticated app pages
│   │   │   ├── dashboard/      # Dashboard
│   │   │   ├── create/         # Create song flow
│   │   │   ├── projects/       # Projects list & detail
│   │   │   ├── voice-dna/      # Voice DNA training
│   │   │   ├── coach/          # AI Vocal Coach
│   │   │   └── release-kit/    # Release kit generator
│   │   ├── login/              # Authentication
│   │   ├── onboarding/         # User onboarding
│   │   ├── pricing/            # Pricing page
│   │   ├── admin/              # Admin dashboard
│   │   ├── support/            # Support tickets
│   │   ├── legal/              # Legal pages (6)
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── landing/            # Landing page sections
│   │   └── shared/             # Shared components
│   └── lib/
│       ├── constants.ts        # App constants
│       ├── types.ts            # TypeScript types
│       ├── store.ts            # Zustand stores
│       ├── utils.ts            # Utilities
│       └── supabase/           # Supabase config
├── audio-service/              # Python FastAPI microservice
├── supabase/
│   └── schema.sql              # Database schema
├── .env.example                # Environment template
└── README.md
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/projects` | GET, POST | List/create projects |
| `/api/projects/[id]` | GET, DELETE | Get/delete project |
| `/api/upload/audio` | POST | Upload audio file |
| `/api/process` | POST | Start processing job |
| `/api/process/status/[jobId]` | GET | Get job status |
| `/api/voice-model` | GET, POST | Voice model CRUD |
| `/api/payment/create-order` | POST | Create Razorpay order |
| `/api/payment/verify` | POST | Verify payment |
| `/api/support` | GET, POST | Support tickets |
| `/api/admin` | GET | Admin stats |

## Audio Service Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /clean-vocal` | Remove noise from vocal |
| `POST /mix-master` | Mix and master track |
| `POST /generate-instrumental` | Generate instrumental from prompt |
| `POST /analyze-vocal` | Analyze vocal quality |
| `POST /train-voice-model` | Train Voice DNA model |

## Deployment

### Vercel (Recommended for Next.js)

```bash
npx vercel
```

### Audio Service

Deploy the FastAPI service to any Python-compatible platform (Railway, Render, AWS Lambda, etc.).

## License

© 2026 U&M Music AI. All rights reserved.
