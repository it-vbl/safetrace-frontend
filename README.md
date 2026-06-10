# Safe Traceability System — Frontend

Frontend for **SIP (Sistem Informasi Perkebunan)**, a web dashboard for palm-oil plantation traceability, STDB (Surat Tanda Daftar Budidaya) management, and farmer communication.

## Overview

This application connects to a REST API backend and provides role-based access to:

- **Peta** — Interactive map dashboard with plantation (kebun) data, deforestation alerts, static layers, and custom map overlays
- **Traceability** — Farmer, plantation, sales, GAP compliance (production, pesticides, fertilizer, hazardous waste), training, workers, and reporting
- **Kabar Tani** — WhatsApp contact management, groups, broadcast messages, and device pairing
- **STDB** — Registration, verification, issuance, and lifecycle tracking of plantation registration documents
- **Settings** — User management, profile, and map overlay configuration

Access to each module is controlled by a role-based permission matrix defined in `src/libs/permissions.js`.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 15](https://nextjs.org) (App Router, Turbopack in dev) |
| UI | [React 19](https://react.dev), [Tailwind CSS](https://tailwindcss.com) |
| State | [Redux Toolkit](https://redux-toolkit.js.org) |
| Data tables | [AG Grid](https://www.ag-grid.com) |
| Maps | [Leaflet](https://leafletjs.com), [React Leaflet](https://react-leaflet.js.org), Turf.js |
| Charts | Chart.js, D3, Nivo |
| Forms | Formik, Yup |
| HTTP | Axios |
| Components | Atomic design (`atoms` / `molecules` / `organisms`), [Radix UI](https://www.radix-ui.com), [shadcn/ui](https://ui.shadcn.com) primitives |
| Component dev | [Storybook 8](https://storybook.js.org) |
| Language | JavaScript (`.jsx`) with partial TypeScript (`.ts` / `.tsx`) |

## Prerequisites

- Node.js 18+
- npm
- A running backend API (see `NEXT_PUBLIC_BASE_URL`)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and set your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_BASE_URL` | Backend API base URL (required) |
| `NEXT_PUBLIC_SITE_URL` | Frontend site URL (default: `http://localhost:3000`) |
| `NEXT_PUBLIC_WHATSAPP_API_URL` | WhatsApp integration API URL (Kabar Tani module) |
| `NEXT_PUBLIC_URL` | Legacy API URL used by some services |

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated users are redirected to `/login`.

### 4. Build for production

```bash
npm run build
npm start
```

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build (standalone output) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run storybook` | Start Storybook on port 6006 |
| `npm run build-storybook` | Build static Storybook |

## Application Modules

### Peta (`/`)

Map-first dashboard showing plantation polygons, filters (commodity, certification, legality), deforestation alert layers (GLAD, RADD, UMD), and configurable map overlays. Requires `peta.dashboard` permission.

### Traceability (`/traceability/*`)

| Route | Feature |
| --- | --- |
| `/traceability/dashboard/statistik` | STDB and plantation statistics |
| `/traceability/dashboard/sankey` | Supply-chain Sankey diagram |
| `/traceability/petani` | Farmer records |
| `/traceability/kebun` | Plantation records with map geometry |
| `/traceability/penjualan` | Sales transactions |
| `/traceability/gap/produksi` | Production (GAP) |
| `/traceability/gap/pestisida` | Pesticide usage |
| `/traceability/gap/pupuk` | Fertilizer usage |
| `/traceability/gap/lb3` | Hazardous waste (LB3) |
| `/traceability/diklat` | Training records |
| `/traceability/pekerja` | Worker records |
| `/traceability/laporan` | Reports |

### Kabar Tani (`/kabar-tani/*`)

| Route | Feature |
| --- | --- |
| `/kabar-tani/kontak` | Contact list |
| `/kabar-tani/grup` | WhatsApp groups |
| `/kabar-tani/blast-pesan` | Broadcast messages |
| `/kabar-tani/kirim-pesan` | Direct messages |
| `/kabar-tani/device` | WhatsApp device management |

### STDB (`/stdb/*`)

| Route | Feature |
| --- | --- |
| `/stdb/pendataan` | Registration and data collection |
| `/stdb/verifikasi` | Verification workflow |
| `/stdb/penerbitan` | Document issuance |
| `/stdb/data-terbit` | Issued documents |
| `/stdb/tidak-terbit` | Rejected documents |
| `/stdb/data-berakhir` | Expired documents |
| `/stdb/ringkasan` | Summary dashboard |

### Settings (`/settings/*`)

| Route | Feature |
| --- | --- |
| `/settings/profile` | User profile |
| `/settings/users` | User management |
| `/settings/peta-overlay` | Map overlay configuration |

## Authentication

Authentication uses JWT tokens stored in cookies (`token`, `refreshToken`). The client-side guard in `src/components/providers/ClientLayout.jsx` redirects unauthenticated users to `/login`.

Supported auth flows:

- Login — `/login`
- OTP verification — `/otp`
- Forgot password — `/forgot-password`, `/forgot-password/verify-otp`, `/forgot-password/reset-password`

API calls attach the bearer token via an Axios interceptor in `src/services/api.js`. On `401` responses, the client attempts a token refresh before logging out.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages and layouts
├── assets/               # Static icons and images
├── components/
│   ├── atoms/            # Smallest UI building blocks
│   ├── molecules/        # Composed UI elements
│   ├── organisms/        # Feature-level UI (forms, tables, modals, map)
│   ├── providers/        # Client-side providers (layout, Redux, mobile)
│   └── ui/               # shadcn/ui primitives
├── constants/            # Shared constants
├── hooks/                # Custom React hooks
├── libs/                 # Utilities (permissions, Redux, formatting)
├── services/             # API service modules (one file per domain)
├── store/                # Redux store and slices
├── styles/               # Global CSS
└── utils/                # General helpers
```

### API services

Domain logic is organized under `src/services/`:

`api.js`, `auth.js`, `petani.js`, `kebun.js`, `stdb.js`, `penjualan.js`, `produksi.js`, `pestisida.js`, `pupuk.js`, `lb3.js`, `analisis.js`, `alert.js`, `petaOverlay.js`, `staticLayer.js`, `wilayah.js`, `referensi.js`, `user.js`, `grup.js`, `kontak.js`, `pesan.js`, `broadcast.js`, `device.js`, `wa.js`, `whatsapp.js`, and others.

### Permissions

Role IDs and the permission matrix live in `src/libs/permissions.js`. Sidebar and navbar items are filtered at runtime based on the logged-in user's roles (stored in cookies).

## Docker

A multi-stage Dockerfile builds the app with `output: 'standalone'` and runs it on port 3000:

```bash
docker build -t safe-tracibility-system-fe .
docker run -p 3000:3000 -e NEXT_PUBLIC_BASE_URL=<api-url> safe-tracibility-system-fe
```

## CI/CD

Deployment is configured via Jenkins (`.cicd/jenkinsfile-cd`). The pipeline builds a Docker image, pushes it to a container registry, and notifies Discord on build status.

## Storybook

UI components can be developed and reviewed in isolation:

```bash
npm run storybook
```

Stories live alongside components (e.g. `Button.stories.jsx`) and in `src/stories/`.

## Notes

- The production build uses `output: 'standalone'` with cache-control headers to prevent stale HTML after deploys.
- A chunk-error handler (`src/utils/chunkErrorHandler.ts`) auto-reloads the page when a new deployment causes `ChunkLoadError`.
- This project was originally bootstrapped from a Next.js + Supabase + Stripe starter template. Some legacy scripts (`email:*`, `stripe:*`, `migration:*`, `supabase:*`) remain in `package.json` but are not part of the core application workflow.

## License

MIT — see [LICENSE](LICENSE).
