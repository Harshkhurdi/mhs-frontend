# Medelec audit implementation — 24 October 2026

Source baseline: website `2011111efec318bab2936d1077dc761df1130868`; inventory `8e5a571acb24ae1c15f8c4b24e96d5f3b1802544`. The separate apps retain their existing databases, product catalogues and footer link. No live inquiry, album, stock, movement or member record was changed. DNS and email configuration are untouched; public personal phone links remain absent. Mr. Virender remains Senior Engineer, following the user's latest explicit instruction.

| Finding | Implementation / actual release boundary |
| --- | --- |
| MHS-SEC-01 | Signed challenge, honeypot, complete 500-item validation, atomic per-IP/global quotas and private idempotent receipts implemented and emulator-tested. **Activation pending server credential/flags/private gate**; legacy intake remains usable. See inquiry-intake-setup.md. |
| MHS-SEC-02 | Session-only staff authentication initializes before restore/sign-in; unapproved/failed migrations stay denied. |
| MHS-SEC-03 | New rules restrict future-use portrait documents to staff. Requires Firebase rules deployment. |
| MHS-SEC-04 | Admin archive copy and gallery rollout documentation distinguish hiding from actual image withdrawal. |
| MHS-SEC-05 | Full restrictive CSP staged in Report-Only; existing enforced object/base/frame protections retained. No telemetry collector or untested strict enforcement added. |
| MHS-DEP-01 | Vite development tooling patched to 8.3.5; transitive dependency audit reviewed. |
| MHS-FUN-01 | Pending identity/payload retained across reload; API receipt reconciliation retries the same ID. Legacy unknown acknowledgements remain blocked with reference/email recovery, preserving anonymous PII-read denial. |
| MHS-FUN-02 | Nihon Kohden editor forces defibrillation and publishing validates it. |
| MHS-FUN-03 | Superseded by later user instruction: retain Virender as Senior Engineer. |
| MHS-PER-01 | Lazy staff SDK/About/Service routes and compact generated homepage catalogue. Full 310-entry catalogue stays on Solutions. |
| MHS-PER-02 | Compatible selected/adjacent original reader + split metadata/asset writes implemented behind rollout flag. **Existing live albums not migrated; flag pending rules deployment**. HTTP object-storage migration remains separate; see gallery-asset-rollout.md. |
| MHS-PER-03 | Bounded 15-second public metadata cache deduplicates in-flight reads; write/cross-tab invalidation and visible-page refresh. Client pagination retained to preserve complete filter counts. |
| MHS-PER-04 | Separate server-filtered Inbox/Trash 25-record cursor pages; explicit 25-record legacy scans preserve missing flags. Counts show loaded/scanned records, not collection totals. Uses stable ID order, avoiding mixed date types and new composite indexes. |
| MHS-PER-05 | Seven actual legacy thumbnails generated; full originals preserved. |
| MHS-PER-06 | Content-addressed image aliases with immutable headers; stable original URLs retained and canonicalized before persistence. |
| MHS-UX-01 | Mobile filter reveal focuses selected filter; close, selection and Escape restore trigger focus. |
| MHS-UX-02 | Admin edit/save/cancel focus handoff and restoration. |
| MHS-UX-03 | Explicit mobile grid resolves flex/grid conflict and restores category counts. |
| MHS-SEO-01 | Removed broad SPA rewrite; known deep links retained, unknown paths use generated 404 document. Verify HTTP404 after Vercel deployment. |
| MHS-SEO-02 | Removed admin robots Disallow; admin noindex meta and X-Robots-Tag remain observable to crawlers. |
| MHS-SEO-03 | **Deferred operational change.** Canonicals remain www.medelec.in. No unconditional alias redirect introduced before saved-quote/auth-origin migration checks; aliases belong to existing Vercel projects and need owner access. |
| MHS-ARC-01 | Added UI lifecycle, query/cache/session/intake tests plus actual isolated security-rule and Admin Firestore transaction emulator tests. |

Inventory's 13 findings, tests and upstream development-dependency limits are recorded separately in its `docs/audit-remediation-2026-10-24.md`.

## Validation and deployment

Website lint, helper/UI tests and static production build are run on the final source. Security validation uses only local demo projects; live inquiry/stock tests are not performed. Inventory has 58 unit/UI tests and 27 real emulator rule tests passing. Website has 9 real emulator rule/transaction cases passing. Final website checks: 50 helper/unit tests pass (two emulator-only groups skip outside the emulator), 13 UI tests pass, and the separate actual emulator run passes 9 rule/transaction cases. Lint, production build and diff checks pass. Website full npm audit reports zero vulnerabilities; inventory has zero production findings and five upstream CLI development nodes. Initial homepage entry shrank from 758,428 to 233,789 raw bytes; it contains 21 compact product summaries while Solutions preserves all 310 entries. Publication status is recorded in the delivery message.

The replacement execution environment has no authenticated Firebase CLI account. GitHub publication can trigger the existing Vercel deployment, but it does not deploy Firestore rules or Firebase Hosting. Do not mark those cloud changes complete until an owner signs into Firebase and deploys the respective project configuration. No service-account credential was created.

CSP remains report-only until observed against production auth/database/image behavior. Cross-origin alias redirects, existing-album migration and inquiry activation require their documented operational checks. This checklist does not claim all 35 findings are already remediated in production.

## Published release verification

Website implementation `9aff99b714e261cb462ab1772aa8e2512a73d188` was published to main and Vercel reported success. Live `https://www.medelec.in` checks confirmed all seven public pages and both admin shell routes return 200, unknown routes return 404, `/home` redirects308 to `/`, robots allows fetching admin noindex, and the hashed thumbnail returns200 with one-year immutable caching. Browser verification loaded all21 community stories, displayed the redesigned full-resolution viewer, advanced/returned photographs, and restored focus to the gallery trigger on close. The saved screenshot is `photo-viewer-live-2026-10-24.jpg`.

Inventory implementation is published in its independent repository as `e44ccd130c01b6ee6752231aa02a46525500151a`. The supporting backend rules mirror is published as `3cf3e1b5861a8ca6c36e7700c4224b7db1a29ce8`. These GitHub releases do not change the pending Firebase authentication/Hosting/rules or server-credential requirements above. No production data was written during verification.
