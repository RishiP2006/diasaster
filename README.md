# DisasterHQ — Disaster Management & Response System

A full-stack disaster management platform built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Citizen** — Report disasters, track your own submissions
- **Admin** — View all requests, assign authorities, close incidents; live stats dashboard
- **Authority** — View assigned requests, update progress, mark resolved
- **Volunteer** — Browse active requests, volunteer to help, track participation

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- Supabase (PostgreSQL backend)
- React Query + react-router-dom

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Run dev server
npm run dev
```

## Deploying to Vercel

1. Push this repo to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add these **Environment Variables** in Vercel project settings:
   - `VITE_SUPABASE_URL` — your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` — your Supabase anon key
   - `VITE_SUPABASE_PROJECT_ID` — your Supabase project ref
4. Deploy — Vercel automatically runs `npm run build`

> The included `vercel.json` handles SPA routing (all paths → `index.html`).

## Database Schema

Tables: `User`, `authority`, `request`, `crisistype`, `zone`, `authorityassignment`, `userhelp`, `family`, `department`, `deptbranch`, `depthandlecrisistype`

### User Roles (determined at login)
| Role | Source Table | Criteria |
|------|-------------|----------|
| CITIZEN | `User` | Default |
| VOLUNTEER | `User` | `wishtovolunteer = true` |
| ADMIN | `User` | `level >= 5` |
| AUTHORITY | `authority` | Any authority record |

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
npm run test      # Run unit tests
```
