# Anonymous inquiry intake: staged activation

## Current deployment status

The endpoint, quota transaction, signed receipt capability and reload-safe client are implemented. **MHS-SEC-01 remains staged until server credentials, deployment flags and the private gate are configured.** No runtime service credential was available during implementation; no privileged identity, secret, paid provider or production inquiry was created. An absent or false gate preserves the existing visitor form. Its legacy direct-create path still lacks server-enforced frequency and complete item validation.

Both paths persist a pending reference before any delivery request. A remounted legacy submission with an unknown acknowledgement blocks a fresh ID and directs the visitor to email staff with its reference. The API path reconciles a private receipt and reuses the same ID. Anonymous Firestore inquiry and receipt reads remain forbidden. The 500-product quote limit and email fallback remain available.

## Configuration

Use the existing Vercel project and Firebase project `mhs-project-7235e`.

| Variable | Scope | Required value |
| --- | --- | --- |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Server secret only | JSON credential for a dedicated inquiry runtime account in that Firebase project |
| `INQUIRY_SIGNING_KEY` | Server secret only | Stable cryptographically random secret of at least 32 characters; use 32 random bytes encoded as hex |
| `INQUIRY_API_ENABLED` | Server only | `true` after setup |
| `VITE_INQUIRY_API_ENABLED` | Frontend build | `true` to send new inquiries through `/api/inquiries` |

Never prefix secrets with `VITE_`, commit them, print them in logs, or use a developer Firebase CLI refresh token as a service credential. A project owner must explicitly approve provisioning the runtime identity and its permissions. This implementation accepts a JSON service-account credential; workload federation requires adapting the credential initialization first. No paid CAPTCHA, mail, storage or rate-limit service is assumed.

Grant a narrowly scoped custom Firestore runtime IAM role with `datastore.entities.get`, `datastore.entities.create`, `datastore.entities.update` and `datastore.databases.get` for point reads and transactions. Verify against the project's IAM policy and [Firebase IAM documentation](https://firebase.google.com/docs/firestore/security/iam). Do not grant Owner, Editor, Firebase Admin, authentication administration, credential administration or storage permissions. Server IAM bypasses client rules and applies at database scope: the credential is trusted and must remain server-only. Consider a separate database/project if stronger isolation is needed.

The endpoint relies on Vercel's sanitized `x-vercel-forwarded-for` header and refuses requests outside the Vercel runtime. If hosting changes, implement that provider's trusted client-address boundary instead of accepting arbitrary forwarded headers. See [Vercel headers](https://vercel.com/docs/headers/request-headers#x-vercel-forwarded-for).

## Activation and verification

1. Run `npm test`, lint, build, and the isolated emulator command below. Deploy the reviewed Firestore rules first. Leave `siteSettings/inquiryIntake` absent or exactly `{ "server_only": false }` so legacy inquiries keep working.
2. Provision the approved dedicated runtime identity and store the server-only credentials/signing key in the Vercel project. Ensure `/api/inquiries` reaches its function before the SPA catchall. Keep preview deployments from writing production data.
3. Set both enable flags to `true` and deploy the frontend and function together. The endpoint safely refuses delivery until the private gate is enabled; the email fallback remains available during this short transition.
4. Through the Firebase console or an approved staff identity, set private document `siteSettings/inquiryIntake` to exactly `{ "server_only": true }`. This simultaneously permits server intake and disables every direct client inquiry create. The endpoint checks the gate on every invocation, including warm instances.
5. With explicit authorization, submit one synthetic inquiry and check one inbox record, a private hash-only receipt, quota counters, and a status-only retry with no duplicate. Do not run production burst tests. Verify anonymous inquiry/receipt reads are denied. Record credentials/flags/gate deployment status before marking MHS-SEC-01 complete.

## Controls and limits

- Server validation checks every field and every element of up to 500 distinct selected products. IDs/names have bounds; quantities are integers from 1 to 999. Maximum encoded request size is 450,000 bytes. Creation uses a server timestamp and `is_deleted: false`.
- A signed challenge expires for new submissions after 30 minutes, requires a minimum age of two seconds, and includes a honeypot. This is a basic bot filter, not proof of humanity or a CAPTCHA.
- One Firestore transaction creates the inquiry/receipt and consumes quotas: 5/IP/hour, 30/IP/day, 100 globally/hour and 500 globally/day. Quotas use UTC fixed windows; adjacent windows can permit both allowances near their boundary. A valid retry of an already accepted ID does not consume another quota.
- IP addresses become HMAC hashes before being used in counter IDs. Shared hospital networks share limits and can use email fallback. A distributed attacker can exhaust the global limit. Function request floods and status reads remain infrastructure risks: review existing hosting firewall and budget controls without assuming a paid add-on has been configured.
- Receipts hold only token/payload hashes. Endpoint access requires a random 256-bit token and a server signature; no public collection reads are added. Keep the signing key stable: rotation invalidates outstanding signatures, which staff must reconcile using the visible inquiry ID.
- Counter records have `expires_at`; no paid TTL feature is enabled. An approved administrator may purge expired `_inquiryLimits` records after their window ends. Retain `_inquiryReceipts` so old requests cannot be treated as new. Do not delete receipts as a recovery shortcut.
- If session storage is unavailable, the client does not send an untraceable online submission; the visitor can use email. Pending submission details remain unchanged until confirmation. A successful submission clears only a basket that still matches the submitted selection.

## Rollback

Deploy `VITE_INQUIRY_API_ENABLED=false` first, then set the private gate to `{ "server_only": false }` and disable `INQUIRY_API_ENABLED`. This restores legacy intake and its original abuse limitation. Preserve the staff-only portrait and compatible gallery rules. Existing pending API references stay unresolved rather than becoming fresh legacy inquiries; staff must reconcile them before clearing anything. Do not expose inquiry reads or remove receipts.

## Tests

Unit tests cover all 500 elements, malformed/oversized requests, challenge/honeypot, atomic burst/global/day quotas, retries, lost acknowledgement followed by reload, corrupt storage and selection preservation. Auth lifecycle tests verify the session-persistence barrier before restored sessions/sign-in, denied accounts, failure to clear storage and unmount timing. Full browser closure/cross-tab persistence remains a separate isolated browser check.

With Java 21+ and Firebase CLI available:

```sh
firebase emulators:exec --only firestore --project demo-mhs-audit "node --test tests/firestore-rules.test.js tests/inquiry-store-emulator.test.js"
```

The rules suite only permits a local emulator and uses `demo-mhs-audit`; the server transaction integration uses a separate fixed `demo-mhs-inquiry-store` project on the same emulator. No production record is used. On hosts whose Java WebChannel IPv6 listener is rejected, set `JAVA_TOOL_OPTIONS=-Djava.net.preferIPv4Stack=true`. Optional temporary `FIREBASE_EMULATORS_PATH` and `XDG_CONFIG_HOME` paths avoid modifying a user's cache/auth configuration.

Without an emulator these two tests explicitly skip; a skip is not a pass. The rules suite covers both staff UIDs, draft portraits, public catalogue versus drafts, anonymous PII/receipt denials, gate activation, staff trash/restore, legacy/split gallery assets and hashed local media. The real transaction test covers concurrent same-ID submission, accepted-record counts, quota rejection and private receipt contents.

## Verification evidence (2026-10-24)

Recovered Linux checkout: 14 targeted inquiry/session unit tests and 3 Contact DOM lifecycle tests passed; targeted ESLint passed. The actual local Firestore emulator suite passed all 9 tests (8 rules assertions/subtests plus one real Admin SDK transaction integration), with zero skips. No production inquiry or gate document was written. Full browser closure/cross-tab checks and production runtime credential activation remain outstanding.
