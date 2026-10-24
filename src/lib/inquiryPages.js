import { normalizeInquiry } from './inquiries.js'

export const INQUIRY_PAGE_SIZE = 25
export const INQUIRY_VIEWS = ['inbox', 'trash', 'legacy']

export function inquiryPageResult(documents, view) {
  if (!INQUIRY_VIEWS.includes(view)) throw new Error('Choose an inquiry view.')
  // Legacy scanning advances through the raw records, including pages with no
  // matches. Advancing through only the visible matches would skip/repeat data.
  const rows = documents.filter((document) => {
    const deleted = document.data().is_deleted
    return view === 'legacy' ? typeof deleted !== 'boolean' : deleted === (view === 'trash')
  }).map((document) => normalizeInquiry(document.data(), document.id))
  return {
    rows,
    cursor: documents.at(-1) || null,
    hasMore: documents.length === INQUIRY_PAGE_SIZE,
    scanned: documents.length,
  }
}
