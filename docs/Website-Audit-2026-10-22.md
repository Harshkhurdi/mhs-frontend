# Medelec website audit — 22 October 2026

Astra coordinated the code audit, with separate reviews of enquiries/catalogue and gallery/media. Browser checks covered the public site at laptop (1024 px) and narrow mobile (360 px) widths before browser access became unavailable. This report distinguishes completed application fixes from deployment and authorization work that still needs project-owner access.

## Confirmed defects and changes

| Finding | Change | Validation |
| --- | --- | --- |
| A slow enquiry write could succeed after a timeout; retrying the same document became a forbidden public update. | Keep the original pending write and offer **Check inquiry status**. Freeze the submitted form while delivery is unresolved; retry only a definitively failed write. | Unit tests cover late success, repeat status checks with exactly one write, and definitive rejection. |
| Public enquiry documents with object-valued contact fields or invalid timestamps could crash the admin inbox. | Normalize untrusted contact fields, quote rows and supported legacy timestamps before rendering. | Malformed data, extreme timestamps and valid Trash-state regression tests pass. |
| Archived built-in stories could return because the public query excludes archived records and the local starting content filled the gap. | Atomically maintain a public hidden-story list when saving, archiving or publishing; it also overrides a stale published query snapshot. Public reads check it before showing bundled stories. | Tests cover published-only query results; an isolated service integration archived, hid, restored and reopened the two-photo CM story. |
| Gallery errors could show built-in stories whose visibility could not be checked. | Fail with a clear loading error instead of silently displaying unchecked starting content. | Source review and gallery merge tests. |
| Corrupt saved quote rows accepted blank or excessively long product identifiers/names. | Reject invalid stored rows and keep enquiry field limits aligned with the proposed database bounds. | Quote validation regressions pass. |
| Homepage category numbers displayed 010–012. | Use consistent two-digit numbering. | Source correction. |
| Quote button announced “1 items.” | Use singular “1 item.” | Source correction. |

The hidden-story list retains the deployed `siteSettings/gallery.hidden_demo_ids` field for compatibility with existing Firebase permissions. Only the three current bundled story IDs are used by the app. The historical field name does not make these real albums demos.

## Completed checks

- 19 automated tests pass; ESLint and production build pass.
- `npm audit --omit=dev` reports zero known production dependency vulnerabilities.
- All 327 local JPG, PNG and WebP files decode successfully.
- Catalogue tests preserve 313 product families, supported manufacturer ordering, the requested KARL STORZ ordering, images and manufacturer/literature references.
- Homepage, About, Service, Events, Contact, Solutions, staff sign-in and the not-found route were checked at laptop width. All six public pages were also checked at 360 px; no page-level horizontal overflow was found. The catalogue manufacturer strip intentionally scrolls horizontally.
- Mobile navigation opens, routes and closes correctly. Product details, quotation quantities, persisted selection after reload, Escape dismissal and the contact-form handoff were checked in the browser.
- Earlier isolated admin checks confirmed Trash/restore and write-failure handling without changing production customer data.

## Rules and authorization follow-up

The repository now contains typed, bounded public enquiry-create rules. **That new validation has not been deployed to Firebase.** Publish the reviewed `firebase/firestore.rules` in project `mhs-project-7235e` through the project-owner account before describing it as enforced. Existing staff Trash permissions remain unchanged; no public reads or updates were added.

The existing privileged rule remains `request.auth != null`. This does not establish that an authenticated account is an approved staff member. A missing signup page is insufficient protection against Firebase Auth API account creation. The attempted read-only check of provisioned users was interrupted when browser access became unavailable; no test account was created and no credentials were changed. Verify the intended staff UIDs and enforce an explicit allowlist or trusted staff claims before treating the admin authorization audit as closed. Do not guess UIDs or lock out existing staff.

Authenticated production writes and a real staff password login were not retested. The integration tests use isolated data. The retained pending receipt is page-local; closing the page before confirmation still requires staff to check the inbox before the visitor starts another submission.

The current app is a static Vite build, with Firebase data access in the browser. The existing bundle-size warning is a performance follow-up, not a failed build or a newly introduced server requirement.

## Manufacturer-link checks

491 unique manufacturer/product/literature URLs were requested with bounded concurrent HTTP checks. 212 completed successfully with HTTP 200. The remaining 279 checks timed out (one returned an intermediate HTTP 200 before timing out). No completed request returned a confirmed HTTP 404/410. Timed-out endpoints are **unverified**, not confirmed broken; even a separate request to the live website timed out from this execution environment. No manufacturer URLs were changed on the basis of a timeout. External availability still needs a normal-browser spot check when browser access returns.
