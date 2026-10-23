# Admin verification — 21 October 2026

The dashboard's product and enquiry flows passed the checks below. Successful authentication and database writes with a real production staff account still require a signed-in authorised staff session.

## Production checks

| Check | Result |
| --- | --- |
| Open `/admin` while signed out | Redirects to `/admin/login` |
| Submit synthetic invalid credentials | Shows “The email or password is incorrect.” and remains signed out |
| Firebase Authentication endpoint | Returns `INVALID_LOGIN_CREDENTIALS` for the synthetic invalid account |
| Read enquiries without authentication | Firestore returns HTTP 403 `PERMISSION_DENIED` |
| Successful staff sign-in, session persistence and authenticated production reads/writes | Pending authorised staff sign-in |

No production products or enquiries were created, edited or archived during these checks. No accounts or permissions were changed.

## Isolated browser workflow checks

The actual application pages ran against temporary, local Authentication and Firestore adapters. The adapters simulate sign-in, collection reads, writes and connection failures; they do not validate real passwords, deployed security rules or production database permissions. Test records stayed in that isolated browser session.

| Check | Result |
| --- | --- |
| Dashboard route after simulated sign-in | Pass |
| Manufacturer and specialty choices, including Kiran and radiation protection | Pass |
| Create a product with image and literature URLs | Pass |
| Failed save retains the form; retry saves one product | Pass |
| Edit an existing product | Pass |
| Archive a custom product and check it disappears from public search | Pass |
| Republish the product and check it returns to public search | Pass |
| Add that product to a quote and change quantity to two | Pass |
| Submit a synthetic enquiry through the contact form | Pass |
| Review the enquiry in Customer inquiries | Pass: facility, contact details, message, product and quantity two match |
| Date rendering | Pass: timestamp displayed in IST |
| Refresh enquiries | Pass: one enquiry remains, with no duplicate |
| Sign out | Pass: returns to protected sign-in screen |

The dashboard manages Firestore listings. The separate manufacturer reference catalogue remains visible independently, as described in the user guide.

## Build checks

All seven existing tests, ESLint and the production Vite build passed with Node 24. The team-section layout and footer email emphasis were checked at desktop, laptop and phone widths.


## Gallery and portrait release checks — 21 October 2026

- Eleven automated tests, ESLint and production build pass on Node 24.
- Isolated browser: create an album, optimize two uploaded files, change the cover, retain fields/photos after a simulated save failure, retry once with the same ID, open the public album, and navigate to the second image: pass.
- Isolated browser: archive a demo, verify it disappears from the public gallery, then republish: pass.
- Isolated browser: optimize a portrait, save it, verify it appears beside the correct engineer name, then restore the placeholder: pass. The portrait fixture was never sent to production.
- Public browser: laptop and phone gallery, sample labels, category controls, modal sizing, Escape-to-close and navigation: pass.
- Catalogue: 313 official-source entries across the eight supported brands, 198 with PDF literature; Helmier and Nihon Kohden filters verified. Nihon Kohden entries are defibrillators/AEDs only.
- Official KARL STORZ OR1 imagery replaces the competitor OT-light and generic equipment-service images. Owner-supplied MHS logo is used in the header, footer and favicon.
- Firebase owner console: the exact new `firebase/firestore.rules` source compiled and was published. Existing products/inquiries permissions were preserved. Rules Playground: public gallery-settings read allowed; anonymous portrait create denied; authenticated portrait create allowed.
- Public gallery metadata reads succeeded against the deployed Firebase configuration. Existing customer inquiries and products were not modified.

Successful real website staff sign-in and authenticated production album/portrait writes remain unverified without the existing staff credentials. The isolated adapters validate UI workflows, while Rules Playground validates the stated deployed-rule cases. No production demo album, test portrait or temporary account was created.


## Security and reliability audit — 23 October 2026

Astra led the review with a GPT-6.1 Sol security subagent. This section supersedes the older authorization description above.

- Firebase console confirmed exactly two existing email/password accounts. Rules and the frontend now restrict staff access to those immutable UIDs; arbitrary authenticated accounts have no staff privileges.
- The reviewed rules compiled and were published on 23 October 2026 at 11:59 AM IST. The original deployed rules were retained in the audit workspace for rollback.
- Firebase Rules Playground: unapproved authenticated inquiry read denied; anonymous inquiry read denied; each of the two existing staff UID reads allowed; valid anonymous legacy inquiry create allowed; malformed anonymous create denied. These are simulations, not live database mutations.
- All nine tested public, login and not-found routes had one H1, appropriate title/robots metadata, labelled controls, no horizontal overflow at 390px and no broken loaded images. All 426 referenced local image paths exist and all 433 raster assets decode.
- Public equipment search, product details, quantity changes, quote-to-inquiry handoff, required-field validation and signed-out admin redirect were checked in the live browser. The temporary quote was cleared afterward. No production inquiry was submitted.
- Catalogue normalization now handles malformed remote descriptions, application lists and publication flags without crashing rendering or search. New regression tests cover these inputs.
- Mobile navigation now dismisses on Escape and restores focus. Gallery retry clears a stale error. Quote controls explicitly use button types; saved team portraits are no longer falsely advertised as visible in the approved text roster.
- Thirty-two automated tests, ESLint, production build and whitespace checks pass. The build retains a non-blocking 611.6kB main-chunk warning.

Limits: successful real staff password sign-in and authenticated production mutations were not performed. Fresh `npm audit` advisory retrieval was blocked by registry DNS, so no current zero-vulnerability claim is made. Rules validate payload structure but do not rate-limit valid anonymous submissions; App Check and server-side abuse throttling remain unconfigured. The historical default-credential scan found no nonempty committed staff password in the inspected 28 frontend commits and accessible default-branch sources.
