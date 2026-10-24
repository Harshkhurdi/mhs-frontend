import { collection, doc, documentId, getDocs, limit, orderBy, query, setDoc, startAfter, where } from 'firebase/firestore/lite'
import { db } from '../config/firebaseDatabase'
import { withTimeout } from '../lib/quote'
import { INQUIRY_PAGE_SIZE, INQUIRY_VIEWS, inquiryPageResult } from '../lib/inquiryPages'

export async function loadInquiryPage(view = 'inbox', cursor = null) {
  if (!INQUIRY_VIEWS.includes(view)) throw new Error('Choose an inquiry view.')
  // ID ordering works with old numeric, Timestamp and missing created_at fields
  // and requires no new composite index. Never fetch the entire collection.
  const filters = view === 'legacy' ? [] : [where('is_deleted', '==', view === 'trash')]
  const snapshot = await withTimeout(getDocs(query(
    collection(db, 'inquiries'), ...filters, orderBy(documentId()),
    ...(cursor ? [startAfter(cursor)] : []), limit(INQUIRY_PAGE_SIZE),
  )))
  return inquiryPageResult(snapshot.docs, view)
}

export async function setInquiryDeleted(id, deleted) {
  await withTimeout(setDoc(doc(db, 'inquiries', id), {
    is_deleted: deleted,
    deleted_at: deleted ? Date.now() : null,
  }, { merge: true }))
}
