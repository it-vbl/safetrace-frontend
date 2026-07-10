# Safe Traceability System — Frontend

Open-source frontend for a **GIS-based plantation traceability dashboard**. Connect it to your own REST API backend to manage farmers, plantations, STDB documents, GAP compliance, and interactive map layers.

## Overview

This application provides role-based access to:

- **Peta** — Interactive map dashboard with plantation polygons, deforestation alerts, static layers, and custom map overlays
- **Traceability** — Farmers, plantations, sales, GAP compliance (production, pesticides, fertilizer, hazardous waste), training, workers, and reporting
- **STDB** — Registration, verification, issuance, and lifecycle tracking of plantation registration documents
- **Settings** — User management, profile, and map overlay configuration

Access to each module is controlled by a role-based permission matrix in [`src/libs/permissions.js`](src/libs/permissions.js).

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

## Prerequisites

- Node.js 18+
- npm
- A running REST API backend compatible with this frontend

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
| `NEXT_PUBLIC_IMAGE_DOMAIN` | Comma-separated hostnames allowed for Next.js `<Image>` (e.g. your backend CDN) |

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

## Customization

This repo is designed so deployers can re-brand without touching component code.

### Brand colors and app name

Edit [`src/config/brand.ts`](src/config/brand.ts):

```ts
const brand = {
  appName: 'Your App Name',
  appDescription: 'Your app description',
  colors: {
    primary: '#2559A6',
    secondary: '#D1FBED',
    tertiary: '#D8F733',
    bgColor: '#EDF5F7',
    checkbox: '#0c7c59',
    layoutBg: '#F7F9FD',
  },
};
```

- Tailwind classes (`bg-primary`, `text-primary`, `bg-layoutBg`, etc.) are generated from this file via [`tailwind.config.ts`](tailwind.config.ts).
- Update `--color-checkbox` in [`src/styles/globals.css`](src/styles/globals.css) to match `brand.colors.checkbox` for checkbox styling.

### Logos and images

Edit [`src/config/assets.ts`](src/config/assets.ts) to point to your asset paths:

```ts
const assets = {
  navbar: {
    logo: '/sistem-informasi-petani.png',
    logoMobile: '/sistem-informasi-petani-mobile.png',
    logoCompact: '/your-logo.png',
  },
  login: {
    logo: '/your-logo.png',
    background: '/login-bg.png',
    partnership: '/partnership.png',
  },
  sidebar: {
    institutionalLogos: ['/logos/logo1.png', '/logos/logo2.png'],
  },
};
```

Replace or add files under [`public/`](public/). Institutional logos live in [`public/logos/`](public/logos/).

## Application Modules

### Peta (`/`)

Map-first dashboard showing plantation polygons, filters, deforestation alert layers, and configurable map overlays.

### Traceability (`/traceability/*`)

Farmer records, plantation management with map geometry, sales, GAP compliance modules, training, workers, and reports.

### STDB (`/stdb/*`)

Registration, verification, issuance, and lifecycle tracking of plantation registration documents.

### Settings (`/settings/*`)

User profile, user management, and map overlay configuration.

## Roles

Defined in [`src/libs/permissions.js`](src/libs/permissions.js):

| Role ID | Role |
| --- | --- |
| 1 | Admin |
| 3 | Ketua Kelompok Tani |
| 4 | Disbunak Kalbar |
| 5 | Disbunak Sekadau |
| 6 | Mitra Pabrik |

Sidebar and navbar items are filtered at runtime based on the logged-in user's roles (stored in cookies).

## Authentication

Authentication uses JWT tokens stored in cookies (`token`, `refreshToken`). The client-side guard in [`src/components/providers/ClientLayout.jsx`](src/components/providers/ClientLayout.jsx) redirects unauthenticated users to `/login`.

API calls attach the bearer token via an Axios interceptor in [`src/services/api.js`](src/services/api.js). On `401` responses, the client attempts a token refresh before logging out.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages and layouts
├── config/               # Brand and asset configuration (customize here)
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   ├── providers/
│   └── ui/
├── constants/
├── hooks/
├── libs/                 # Permissions, utilities
├── services/             # API service modules (one file per domain)
├── store/                # Redux store and slices
├── styles/               # Global CSS
└── utils/
public/
├── logos/                # Institutional logos (swap these)
└── ...                   # Login background, navbar logos, etc.
```

## Docker

```bash
docker build -t safe-tracibility-system-fe .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_BASE_URL=<api-url> \
  -e NEXT_PUBLIC_IMAGE_DOMAIN=<image-host> \
  safe-tracibility-system-fe
```

## Backend API

This frontend expects a REST API backend. Domain logic is organized under [`src/services/`](src/services/) — one module per resource (`petani.js`, `kebun.js`, `stdb.js`, `wilayah.js`, etc.). Point `NEXT_PUBLIC_BASE_URL` at your backend instance.

## License

MIT — see [LICENSE](LICENSE).
