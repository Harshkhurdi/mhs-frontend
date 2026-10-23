// Existing project accounts verified in the Firebase console during the audit.
// Keep this list aligned with staff() in firebase/firestore.rules. Email alone
// never grants access; the database rules are the authoritative boundary.
const staffUids = new Set([
  'rE1K7ZYGZicgsqgVyOBCCm5zvTp1',
  'jULRArueS7gig2T92FlxXHBYERn1',
])

export function isApprovedStaff(user) {
  return typeof user?.uid === 'string' && staffUids.has(user.uid)
}
