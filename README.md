# Medelec Healthcare Solutions

The MHS medical equipment website, built with React, Vite and Firebase. The existing Vercel project and Firebase database remain the deployment targets; no separate application server is required.

## User and admin documentation

Read the [complete user and admin guide](docs/MHS-User-and-Admin-Guide.md) for daily operation, enquiry handling, Firebase database access, staff accounts, catalogue management, backups, deployment and troubleshooting.

To check an incoming enquiry: open https://medelec.vercel.app/admin/login, sign in, select **Customer inquiries**, then **Refresh**. Enquiries are stored in Firestore; the supplied app does not send automatic email alerts.

## Website

- Responsive home, company, service and contact pages.
- Manufacturer reference library with 313 distinct equipment models, accessories and product families across eight supported brand ranges, official photography and direct manufacturer links. Published Firestore listings enrich matching entries and append supported custom equipment. Search, clinical and manufacturer filters, sorting and pagination are reflected in the URL.
- Quote list with quantities, removal and local browser persistence. Legacy session quote lists are migrated.
- Contact and service inquiries saved to the existing `inquiries` collection. Failed submissions retain the form and selection. After a timeout, **Check inquiry status** awaits the original write without sending another copy; unresolved fields remain locked. Email fallback explicitly opens a draft and never claims delivery.
- Staff sign-in at `/admin/login`; catalogue creation, editing, reversible archive/publish and inquiry inbox at `/admin`.
- Product details with official product pages on all reference entries and PDF literature links on 192 entries (164 distinct documents). Images are served locally as WebP; unavailable photographs have a clear text fallback.
- Official MHS logo, contained laptop equipment showcase, responsive cobalt/navy/warm-neutral design and five service engineer profiles.
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

The public catalogue includes the local manufacturer reference range and Firestore records with `is_published == true`. The dashboard manages Firestore listings; archive changes this flag and preserves the record. Manufacturer entries are maintained in `src/data/manufacturerCatalogue.json`; publishing or archiving a Firestore record does not remove its separate manufacturer reference entry. The inbox reads inquiries; it does not require broader update/delete permissions. Quote selections and contact drafts stay in the visitor's browser until submission or clearing.

## Verification

Seven automated checks cover catalogue identities, local image files, official resource domains, merge stability, search/filter/sort behavior, malformed saved quote data, safe media URLs, email encoding and connection timeouts. Browser verification should cover:

1. Load the published catalogue; search and combine/reset specialty and manufacturer filters.
2. Add equipment, change quantities, close with Escape, reload and continue to the contact form.
3. Verify required fields, failed-save retention, successful receipt and cleared quote list using isolated data.
4. With a test staff session, create/edit/archive/republish a product and confirm the submitted inquiry appears in the inbox. Sign out and verify protected access redirects.
5. Check public routes, a missing route, phone navigation and desktop/tablet/phone layouts.

The redesign was checked against the live public catalogue. Submission and staff mutations were verified through an isolated local Firebase adapter so no test records were written to production. A real staff sign-in and production write still depend on the existing account and deployed Firebase rules.

Photos and source attribution are listed in [public/images/README.md](public/images/README.md) and the complete [manufacturer source ledger](docs/manufacturer-sources.md). Manufacturer photography is illustrative; the Photos & events page also includes four owner-supplied photographs of Medelec installations, a CM visit and clinical training.

## Event gallery and engineer portraits

Staff can upload event albums under **Admin → Photos & events** and portraits under **Admin → Team photographs**. Three curated photo stories replace the old demo albums and can be edited or archived by staff. Customer inquiries have a reversible Delete inquiry / Trash / Restore workflow. See sections 23–24 of `docs/MHS-User-and-Admin-Guide.md` for upload limits, publishing, archiving, database paths and backups. Gallery permissions are maintained in `firebase/firestore.rules`; deploy rules separately from Vercel.


## Community photographs

`/community` provides all-company and eight company views, swipeable photo stories and nine-story pagination. Staff use **Admin → Community photographs → Add photographs**, choose a company, upload one or more images and save with publication enabled. Titles/descriptions are optional. Community uses the existing gallery collection/rules; company IDs are encoded in stable `community--{companyId}--{uniqueId}` document IDs. See section 25 of the user/admin guide. Team titles: Bahudar — Manager – Service; Prikshit, Ashish and Surender — Senior Engineer; Virender — Service Engineer.
