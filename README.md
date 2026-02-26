# DisasterHQ — Disaster Management & Response System

A full-stack disaster management platform built with React + TypeScript + Tailwind CSS + Supabase.

---

## ⚡ Quick Start

### 1. Seed the Database (required first!)

Open your **Supabase project → SQL Editor** and run the contents of:
```
supabase/seed.sql
```

This populates all tables: zones, crisis types, authorities, users, sample requests, assignments, and volunteer entries. Without this step the dropdowns (disaster type, zone) will be empty.

### 2. Local Development

```bash
npm install
cp .env.example .env      # fill in your Supabase URL + anon key
npm run dev
```

### 3. Deploy to Vercel

1. Push this repo to GitHub
2. Import in [vercel.com](https://vercel.com/new)
3. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Deploy — `vercel.json` handles SPA routing automatically.

---

## User Roles

| Role | How determined | Dashboard |
|---|---|---|
| **Admin** | `User.level >= 5` | All requests, assign responders, force-close |
| **Responder** (Authority) | From `authority` table | Assigned incidents + all requests view |
| **Volunteer** | `User.wishtovolunteer = true` | Browse open requests, volunteer/withdraw |
| **Citizen** | Default `User` | Public feed + submit own reports |

---

## Database Tables

`zone` · `crisistype` · `department` · `deptbranch` · `authority` · `User` · `family` · `request` · `authorityassignment` · `userhelp` · `depthandlecrisistype`

---

## Scripts

```bash
npm run dev       # dev server
npm run build     # production build
npm run preview   # preview build locally
npm run lint      # ESLint
npm run test      # unit tests
```
