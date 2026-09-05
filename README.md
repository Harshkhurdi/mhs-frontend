# Medelec Healthcare Solutions (MHS) — Frontend

A modern, high-performance web platform for **Medelec Healthcare Solutions**, an authorized distributor of premium medical equipment across North India (Hamilton Medical, Samsung Healthcare, Linet, Spacelabs Healthcare).

---

## 🚀 Features

- **Dynamic Product Catalog**: Browse by clinical specialty or manufacturer brand with realtime Firebase (Firestore) connectivity.
- **RFQ Inquiry Builder**: Add items to an RFQ list persisted across sessions.
- **PDF Resource Vault**: Single-click access to product brochures and datasheets.
- **Protected Admin Panel**: Manage equipment catalog, toggle publish state, link product images/PDFs by URL.
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
Fill in your Firebase web app credentials (Firebase console → Project settings → General → Your apps):
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Firebase console setup (one time)
See the setup flow in [`mhs-backend/README.md`](https://github.com/Harshkhurdi/mhs-backend): create the Firestore database, publish the security rules, enable Email/Password sign-in, and create the admin user.

### 5. Run the development server
```bash
npm run dev
```

---

## 🌐 Deploy to Vercel

1. Import the repository in **Vercel Dashboard**.
2. Add the `VITE_FIREBASE_*` Environment Variables.
3. Deploy! `vercel.json` will automatically handle SPA routing for all sub-pages. Remember to also add the Vercel domain under **Authentication → Settings → Authorized domains** in Firebase so admin sign-in works from production.
