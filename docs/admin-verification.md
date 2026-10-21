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
