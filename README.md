# Safetrace - Frontend

Safetrace adalah aplikasi frontend open-source berbasis Sistem Informasi Geografis (GIS) untuk dashboard ketertelusuran (traceability) perkebunan. Frontend ini dapat dihubungkan ke backend REST API Anda sendiri untuk mengelola data petani, perkebunan, dokumen STDB, kepatuhan GAP, dan layer peta interaktif.

## Fitur Utama

- Dashboard peta interaktif (GIS): visualisasi poligon perkebunan, peringatan deforestasi, filter spasial, dan layer khusus menggunakan Leaflet.
- Traceability (ketertelusuran): pengelolaan data petani, kebun, penjualan, hingga kepatuhan standar GAP yang meliputi produksi, pestisida, pupuk, dan limbah B3.
- Pengaturan dan role-based access: manajemen pengguna, profil, kontrol peran (Admin, Ketua Kelompok Tani, Dinas, Mitra Pabrik), dan konfigurasi layer peta.

## Teknologi yang Digunakan

- Framework: Next.js 15 (App Router, Turbopack)
- UI: React 19 dan Tailwind CSS
- State management: Redux Toolkit
- Peta: Leaflet, React Leaflet, Turf.js
- Tabel dan chart: AG Grid, Chart.js, D3
- Form: Formik dan Yup
- API client: Axios
- Komponen UI: Atomic Design dan Radix UI

## Prasyarat

Sebelum memulai, pastikan sistem Anda telah memiliki:

- Node.js versi 18 atau lebih baru (disarankan versi 20 ke atas)
- npm (atau pnpm / yarn)

## Instalasi dan Setup

### 1. Clone repository

```bash
git clone https://github.com/adamdavareln/safe-tracibility-system-fe.git
cd safe-traceability-system-fe
```

### 2. Install dependencies

```bash
npm install
```

### 3. Konfigurasi environment variables

Salin file contoh environment menjadi file .env:

```bash
cp .env.local.example .env
```

Buka file .env di text editor Anda, lalu isi nilai berikut:

- NEXT_PUBLIC_BASE_URL: URL utama backend REST API Anda. Wajib diisi.

### 4. Jalankan aplikasi

```bash
npm run dev
```

Aplikasi dapat diakses di http://localhost:3000

## Daftar Script

- `npm run dev`: menjalankan server development (menggunakan Turbopack agar lebih cepat).
- `npm run build`: membuat build produksi yang telah teroptimasi.
- `npm run start`: menjalankan server dari hasil build produksi.
- `npm run lint`: menjalankan ESLint untuk mengecek potensi error pada kode.

## Struktur Folder Proyek

Proyek ini dibangun menggunakan arsitektur Atomic Design untuk mempermudah skalabilitas UI komponen.

```text
src/
├── app/                  # Direktori utama Next.js App Router (Pages & Layouts)
├── assets/               # Berkas ikon, gambar SVG statis khusus project
├── components/           # Komponen UI Reusable (Atomic Design)
│   ├── atoms/            # Elemen terkecil (Button, Input, Icon)
│   ├── molecules/        # Gabungan atoms (Form Field, Card Header)
│   ├── organisms/        # Kumpulan molekul (Modal, Form Complex, Header)
│   ├── providers/        # Context Providers (Redux Provider, Toast, Theme)
│   └── ui/               # Komponen dari Radix UI / Shadcn
├── config/               # Konfigurasi Tema (Brand colors) dan Aset dasar
├── constants/            # Variabel statis / Enum yang digunakan global
├── hooks/                # Custom React hooks (Fetch data, logic reuse)
├── i18n/                 # Konfigurasi dan data terjemahan bahasa
├── libs/                 # Utilitas library (Permissions, helpers)
├── services/             # Integrasi REST API endpoints menggunakan Axios
├── store/                # Konfigurasi state management Redux (Slices)
├── styles/               # File global CSS (globals.css, tailwind base)
├── types/                # Definisi type / interface (jika ada typescript parts)
└── utils/                # Fungsi bantuan umum (formatter, env var util)

public/                   # File statis publik (Logo, Background, Icons browser)
```

## Kustomisasi Tema dan Logo

1. Brand colors: ubah warna tema di `src/config/brand.ts`. Kelas Tailwind akan digenerate otomatis berdasarkan file ini.
2. Logo dan aset: ubah path file (logo lembaga, background login, dan lainnya) melalui `src/config/assets.ts`, lalu simpan file fisiknya di direktori /public.

## Lisensi

MIT. Lihat file LICENSE untuk selengkapnya.