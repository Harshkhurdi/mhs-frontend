import process from 'node:process'
import { isIP } from 'node:net'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { createInquiryService, InquiryError, MAX_PAYLOAD_BYTES } from '../server/inquiryService.js'
import { createInquiryStore } from '../server/inquiryStore.js'

let service, database
export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Use POST for inquiry delivery.' })
  }
  if (process.env.INQUIRY_API_ENABLED !== 'true') return response.status(503).json({ error: 'Please email our team while inquiry delivery is unavailable.' })
  try {
    if (Number(request.headers['content-length']) > MAX_PAYLOAD_BYTES) throw new InquiryError(413, 'Your inquiry is too large. Please email our team for help.')
    if (!request.headers['content-type']?.startsWith('application/json')) throw new InquiryError(415, 'Use JSON for inquiry delivery.')
    // Trust Vercel's sanitized edge address, never an arbitrary proxy header.
    const ip = process.env.VERCEL === '1' ? request.headers['x-vercel-forwarded-for']?.split(',')[0].trim() : null
    if (!ip || !isIP(ip)) throw new InquiryError(503, 'Inquiry service is temporarily unavailable. Please email our team.')
    if (!service) {
      const credential = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}')
      if (credential.project_id !== 'mhs-project-7235e') throw new Error('Wrong or missing inquiry project credential')
      const app = getApps().find(entry => entry.name === 'inquiry-server') || initializeApp({ credential: cert(credential) }, 'inquiry-server')
      database = getFirestore(app)
      service = createInquiryService({ store: createInquiryStore(database), signingKey: process.env.INQUIRY_SIGNING_KEY })
    }
    // Recheck each invocation; warm function instances must respect rollback.
    if ((await database.doc('siteSettings/inquiryIntake').get()).data()?.server_only !== true) throw new Error('Server intake rules cutover has not been activated')
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body
    return response.status(200).json(await service(body, ip))
  } catch (error) {
    return response.status(error instanceof InquiryError ? error.status : 503).json({ error: error instanceof InquiryError ? error.message : 'Inquiry service is temporarily unavailable. Please email our team.' })
  }
}
