# Medelec Healthcare Solutions

The MHS medical equipment website, built with React, Vite and Firebase. The existing Vercel project and Firebase database remain the deployment targets; no separate application server is required.

## Website

- Responsive home, company, service and contact pages.
- Published Firestore equipment catalogue with search, specialty and manufacturer filters. Filters are reflected in the URL.
- Quote list with quantities, removal and local browser persistence. Legacy session quote lists are migrated.
- Contact and service inquiries saved to the existing `inquiries` collection. Failed submissions retain the form and selection; email fallback explicitly opens a draft and never claims delivery.
- Staff sign-in at `/admin/login`; catalogue creation, editing, reversible archive/publish and inquiry inbox at `/admin`.
- Brochure links appear only when a product has a web URL. Missing images use clearly labelled category illustrations.
- Keyboard-accessible quote dialog, labelled forms, reduced-motion support and a recovery page for loading errors.

## Local development

Use Node 24 (also specified in `.nvmrc` and `package.json`).

```sh
npm ci
cp .env.example .env.local
# Fill in the existing Firebase web app configuration.
npm run dev
```

The Vite `VITE_FIREBASE_*` configuration is build-time configuration. Required fields are API key, auth domain, project ID and app ID. Do not commit environment files, service account keys or staff passwords. Missing configuration leaves the public information pages available and displays connection errors for dependent actions.

```sh
npm test
npm run lint
npm run build
npm run preview
```

Firebase Firestore Lite is used because these flows read and write on request; no realtime listener or offline database is needed. Larger route modules load on demand. The gRPC override updates Firebase 11's Node-only transitive dependency to a patched compatible 1.x version.

## Existing Vercel deployment

Push `main` to the connected GitHub repository. Keep the existing project environment variables, Vite framework preset, `npm run build` and `dist` output directory. `vercel.json` serves client routes on direct navigation. No database migration or new service is needed for the redesign.

Firebase Email/Password sign-in, staff users and security rules are managed in the existing Firebase project. See [mhs-backend](https://github.com/Harshkhurdi/mhs-backend) for the rules and original setup. Staff accounts must already be provisioned; this website does not expose public registration. Never make catalogue writes or inquiry reads public to fix a permission error.

## Data contracts

`products/{documentId}`: `name`, `slug`, `brand`, `specialty`, `description`, `image_url`, `pdf_url`, `is_published`, `created_at`.

`inquiries/{documentId}`: `name`, `hospital`, `department`, `email`, `phone`, `message`, `items` (`id`, `name`, `quantity`), `status`, `created_at`; new inquiries also include `type` (`equipment` or `service`). Existing inquiries without `type` remain readable. Dates support numeric timestamps, Firestore timestamps and date strings, displayed in Asia/Kolkata.

The public catalogue shows only `is_published == true`. Archive changes this flag and preserves the record. The inbox reads inquiries; it does not require broader update/delete permissions. Quote selections and contact drafts stay in the visitor's browser until submission or clearing.

## Verification

Automated checks cover malformed saved quote data, safe media URLs, email encoding and connection timeouts. Browser verification should cover:

1. Load the published catalogue; search and combine/reset specialty and manufacturer filters.
2. Add equipment, change quantities, close with Escape, reload and continue to the contact form.
3. Verify required fields, failed-save retention, successful receipt and cleared quote list using isolated data.
4. With a test staff session, create/edit/archive/republish a product and confirm the submitted inquiry appears in the inbox. Sign out and verify protected access redirects.
5. Check public routes, a missing route, phone navigation and desktop/tablet/phone layouts.

The redesign was checked against the live public catalogue. Submission and staff mutations were verified through an isolated local Firebase adapter so no test records were written to production. A real staff sign-in and production write still depend on the existing account and deployed Firebase rules.

Photos and source attribution are listed in [public/images/README.md](public/images/README.md). Clinical photos are illustrative and are not presented as Medelec projects or premises.
