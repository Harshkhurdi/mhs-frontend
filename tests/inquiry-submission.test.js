import test from 'node:test'
import assert from 'node:assert/strict'
import { inquiryContactError } from '../src/lib/inquirySubmission.js'

const contact = { name: 'Test Contact', hospital: 'Test Hospital', department: 'ICU', email: 'contact+equipment@hospital.example', phone: '+91 (172) 123-4567', message: '' }

test('ordinary contact details and supported email address forms remain valid', () => {
  for (const email of [contact.email, "o'connor@hospital.example", 'staff@intranet', 'a@b.c'])
    assert.equal(inquiryContactError({ ...contact, email }), '')
  for (const phone of ['1234567', '+44 20 7123 4567', '(172) 123.4567'])
    assert.equal(inquiryContactError({ ...contact, phone }), '')
})

test('invalid contact email and phone shapes are rejected before a write', () => {
  for (const email of ['not-an-email', 'a@@example.org', 'a b@example.org', 'a@-example.org', 'a@example..org', 'a@example.org\n'])
    assert.match(inquiryContactError({ ...contact, email }), /valid email/)
  for (const phone of ['+1 (234)', '-------', '123\t4567', '1234567 ext 8', '++1234567'])
    assert.match(inquiryContactError({ ...contact, phone }), /valid phone/)
})

test('restored drafts cannot bypass required fields and stored size limits', () => {
  for (const key of ['name', 'hospital', 'department', 'email', 'phone'])
    assert.match(inquiryContactError({ ...contact, [key]: ' ' }), /required field/)
  for (const [key, size] of Object.entries({ name: 121, hospital: 181, department: 201, email: 255, phone: 26, message: 5001 }))
    assert.match(inquiryContactError({ ...contact, [key]: 'x'.repeat(size) }), /field limits/)
  assert.match(inquiryContactError({ ...contact, name: {} }), /required field/)
})
