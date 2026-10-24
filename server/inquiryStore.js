import { Timestamp } from 'firebase-admin/firestore'
import { InquiryError } from './inquiryService.js'

export function createInquiryStore(db) {
  const receipts = db.collection('_inquiryReceipts')
  return {
    async receipt(id) {
      const document = await receipts.doc(id).get()
      return document.exists ? document.data() : null
    },
    async commit({ id, tokenHash, digest, payload, now, buckets }) {
      return db.runTransaction(async transaction => {
        const reference = receipts.doc(id), receipt = await transaction.get(reference)
        if (receipt.exists) {
          const saved = receipt.data()
          if (saved.tokenHash !== tokenHash || saved.digest !== digest) throw new InquiryError(409, 'Inquiry reference cannot be reused for different details.')
          return
        }
        const references = buckets.map(bucket => db.collection('_inquiryLimits').doc(bucket.id))
        const counters = await transaction.getAll(...references)
        if (buckets.some((bucket, index) => (counters[index].data()?.count || 0) >= bucket.max)) throw new InquiryError(429, 'We have received several inquiries recently. Please try later or email our team.')
        transaction.create(db.collection('inquiries').doc(`web_${id}`), { ...payload, status: 'new', is_deleted: false, created_at: Timestamp.fromMillis(now) })
        // Private hashes only. Retain receipts so old retries cannot be recreated.
        transaction.create(reference, { tokenHash, digest })
        buckets.forEach((bucket, index) => transaction.set(references[index], { count: (counters[index].data()?.count || 0) + 1, expires_at: Timestamp.fromMillis(bucket.expiresAt) }))
      })
    },
  }
}
