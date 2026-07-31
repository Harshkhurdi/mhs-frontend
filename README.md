# Medelec Healthcare Solutions (MHS) — Frontend

A modern, high-performance web platform for **Medelec Healthcare Solutions**, an authorized distributor of premium medical equipment across North India (Hamilton Medical, Samsung Healthcare, Linet, Spacelabs Healthcare).

---

## 🚀 Features

- **Dynamic Product Catalog**: Browse by clinical specialty or manufacturer brand with realtime Supabase connectivity.
- **RFQ Inquiry Builder**: Add items to an RFQ list persisted across sessions.
- **PDF Resource Vault**: Single-click access to product brochures and datasheets.
- **Protected Admin Panel**: Manage equipment catalog, toggle publish state, upload images/PDFs directly to Supabase Storage.
- **Vercel SPA Ready**: Pre-configured with `vercel.json` for smooth client-side routing.

---

## 🛠 Local Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/Harshkhurdi/mhs-frontend.git
cd mhs-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the development server
```bash
npm run dev
```

---

## 🌐 Deploy to Vercel

1. Import the repository in **Vercel Dashboard**.
2. Add Environment Variables (`VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`).
3. Deploy! `vercel.json` will automatically handle SPA routing for all sub-pages.
