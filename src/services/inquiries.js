import { doc, setDoc } from 'firebase/firestore/lite'
import { db } from '../config/firebaseDatabase'
import { withTimeout } from '../lib/quote'

export async function setInquiryDeleted(id, deleted) {
  await withTimeout(setDoc(doc(db, 'inquiries', id), {
    is_deleted: deleted,
    deleted_at: deleted ? Date.now() : null,
  }, { merge: true }))
}
