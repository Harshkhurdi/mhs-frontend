import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { webcrypto } from 'node:crypto'
import Contact from '../src/pages/Contact'
import { pendingInquiryKey } from '../src/lib/inquirySubmission'

const state = vi.hoisted(() => ({
  items: [{ id: 'monitor', name: 'Test Monitor', quantity: 2 }], clear: vi.fn(), setDoc: vi.fn(),
}))
vi.mock('../src/config/firebaseDatabase', () => ({ db: {} }))
vi.mock('firebase/firestore/lite', () => ({ doc: (_db, collection, id) => ({ collection, id }), serverTimestamp: () => 'server-time', setDoc: (...args) => state.setDoc(...args) }))
vi.mock('../src/components/RFQContext', () => ({ useRFQ: () => ({ items: state.items, totalItems: 2, clearSubmittedItems: state.clear }) }))
vi.mock('../src/components/QuoteDrawer', () => ({ QuoteItems: () => <div>Editable quote selection</div> }))
vi.mock('../src/components/PageIntro', () => ({ default: () => <div>Contact</div> }))

function mount() { return render(<MemoryRouter initialEntries={['/contact']}><Contact /></MemoryRouter>) }
function fill() {
  for (const [label, value] of [
    [/Full name/, 'Synthetic Visitor'], [/Hospital \/ organisation/, 'Test Hospital'], [/Work email/, 'synthetic@example.test'], [/Phone number/, '1234567'], [/Department \/ requirement/, 'ICU'],
  ]) fireEvent.change(screen.getByLabelText(label), { target: { value } })
}
async function send() { await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Send inquiry' })) }) }
beforeEach(() => {
  sessionStorage.clear(); state.clear.mockReset(); state.setDoc.mockReset()
  vi.stubEnv('VITE_INQUIRY_API_ENABLED', 'false'); vi.stubGlobal('crypto', webcrypto)
})
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllEnvs(); vi.unstubAllGlobals() })

describe('contact delivery identity across component lifetimes', () => {
  it('persists before the write, then blocks a fresh ID after timeout and remount', async () => {
    vi.useFakeTimers()
    let commit
    state.setDoc.mockImplementation(() => new Promise(resolve => { commit = resolve }))
    const page = mount(); fill(); await send()
    const first = JSON.parse(sessionStorage.getItem(pendingInquiryKey))
    expect(first.payload.name).toBe('Synthetic Visitor')
    expect(state.setDoc).toHaveBeenCalledTimes(1)
    expect(state.setDoc.mock.calls[0][0].id).toBe(first.id)
    await act(async () => { await vi.advanceTimersByTimeAsync(12001) })
    expect(screen.getByRole('button', { name: 'Check inquiry status' })).toBeTruthy()
    page.unmount(); mount()
    expect(screen.getByLabelText(/Full name/).value).toBe('Synthetic Visitor')
    expect(screen.getByLabelText(/Full name/).closest('fieldset').disabled).toBe(true)
    expect(screen.getByText('Submitted equipment selection')).toBeTruthy()
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Check inquiry status' })) })
    expect(state.setDoc).toHaveBeenCalledTimes(1)
    expect(JSON.parse(sessionStorage.getItem(pendingInquiryKey)).id).toBe(first.id)
    expect(screen.getByRole('alert').textContent).toContain('cannot safely check')
    expect(decodeURIComponent(screen.getByRole('link', { name: /Open an email/ }).href)).toContain(first.id)
    await act(async () => { commit() })
    expect(state.clear).not.toHaveBeenCalled()
  })
  it('clears the durable receipt and unchanged quote only after acknowledgement', async () => {
    state.setDoc.mockResolvedValue(undefined)
    mount(); fill(); await send()
    expect(screen.getByText('Your inquiry is with us.')).toBeTruthy()
    expect(sessionStorage.getItem(pendingInquiryKey)).toBeNull()
    expect(state.clear).toHaveBeenCalledExactlyOnceWith(state.items)
  })
  it('keeps the email fallback and makes no write if a delivery reference cannot be stored', async () => {
    mount(); fill()
    const original = Storage.prototype.setItem
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (key, value) {
      if (key === pendingInquiryKey) throw new Error('Storage unavailable')
      return original.call(this, key, value)
    })
    await send()
    expect(state.setDoc).not.toHaveBeenCalled()
    expect(screen.getByRole('link', { name: /Open an email/ }).href).toContain('mailto:info@medelec.in')
    expect(screen.getByLabelText(/Full name/).value).toBe('Synthetic Visitor')
  })
})
