import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import AdminDashboard from '../src/pages/AdminDashboard'

const state = vi.hoisted(() => ({ products: [], inquiries: [], reads: [], fail: false }))
const invalidate = vi.hoisted(() => vi.fn())
const writes = vi.hoisted(() => vi.fn())
vi.mock('../src/components/AdminEvents', () => ({ default: () => null }))
vi.mock('../src/components/AdminTeamPhotos', () => ({ default: () => null }))
vi.mock('../src/components/PageMeta', () => ({ default: () => null }))
vi.mock('../src/context/AuthContext', () => ({ useAuth: () => ({ user: { email: 'staff@example.test' }, logout: vi.fn() }) }))
vi.mock('../src/config/firebaseDatabase', () => ({ db: {} }))
vi.mock('../src/lib/publicCache', () => ({ invalidatePublicContent: invalidate }))
vi.mock('firebase/firestore/lite', () => ({
  collection: (_db, name) => ({ name }),
  doc: (source, name, id) => id ? { name, id } : { name: source.name, id: 'created-product' },
  documentId: () => '__name__',
  where: (field, op, value) => ({ kind: 'where', field, op, value }),
  orderBy: (field) => ({ kind: 'order', field }),
  limit: (count) => ({ kind: 'limit', count }),
  startAfter: (cursor) => ({ kind: 'cursor', id: cursor.id }),
  query: (source, ...constraints) => ({ ...source, constraints }),
  getDocs: vi.fn(async (request) => {
    state.reads.push(request)
    if (state.fail && request.name === 'inquiries') throw new Error('offline')
    let records = [...state[request.name]]
    for (const constraint of request.constraints || []) {
      if (constraint.kind === 'where') records = records.filter((row) => row[constraint.field] === constraint.value)
      if (constraint.kind === 'order') records.sort((a, b) => a.id.localeCompare(b.id))
      if (constraint.kind === 'cursor') records = records.filter((row) => row.id > constraint.id)
      if (constraint.kind === 'limit') records = records.slice(0, constraint.count)
    }
    return { docs: records.map((row) => ({ id: row.id, data: () => ({ ...row }) })) }
  }),
  setDoc: async (reference, payload) => {
    writes(reference, payload)
    const existing = state[reference.name].find((row) => row.id === reference.id)
    if (existing) Object.assign(existing, payload)
    else state[reference.name].push({ id: reference.id, ...payload })
  },
}))

beforeEach(() => {
  state.products = [{ id: 'nk-existing', name: 'NK defibrillator', description: 'Emergency equipment', brand: 'nihon-kohden', specialty: 'critical-care', is_published: false }]
  state.inquiries = []
  state.reads = []
  state.fail = false
  invalidate.mockClear()
  writes.mockClear()
  HTMLElement.prototype.scrollIntoView = vi.fn()
})
afterEach(cleanup)

async function openDashboard() {
  render(<AdminDashboard />)
  await screen.findByText('NK defibrillator')
}

describe('equipment editor constraints and focus', () => {
  it('blocks invalid NK publishing, corrects the editor, saves visibly and restores its row focus', async () => {
    await openDashboard()
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))
    expect(screen.getByRole('alert').textContent).toContain('Defibrillators & AEDs')
    expect(writes).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(document.activeElement).toBe(screen.getByLabelText('Product name *'))
    expect(screen.getByLabelText('Clinical specialty *').value).toBe('defibrillation')
    expect(within(screen.getByLabelText('Clinical specialty *')).getAllByRole('option')).toHaveLength(1)
    expect(screen.getByText(/unsupported specialty/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Save product' }))
    await waitFor(() => expect(screen.queryByLabelText('Product name *')).toBeNull())
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Edit' })))
    expect(writes.mock.calls[0][1].specialty).toBe('defibrillation')
    expect(state.products[0].id).toBe('nk-existing')
    expect(invalidate).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))
    await screen.findByText('Product published.')
    expect(state.products[0].is_published).toBe(true)
    expect(invalidate).toHaveBeenCalledTimes(2)
  })

  it('forces defibrillation when selecting NK and restores the Add product action on cancel', async () => {
    await openDashboard()
    const add = screen.getByRole('button', { name: 'Add product' })
    fireEvent.click(add)
    expect(document.activeElement).toBe(screen.getByLabelText('Product name *'))
    fireEvent.change(screen.getByLabelText('Manufacturer *'), { target: { value: 'nihon-kohden' } })
    expect(screen.getByLabelText('Clinical specialty *').value).toBe('defibrillation')
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(document.activeElement).toBe(add)
    expect(writes).not.toHaveBeenCalled()
  })
})

describe('bounded inquiry pages and legacy access', () => {
  beforeEach(() => {
    state.inquiries = Array.from({ length: 76 }, (_, n) => ({
      id: String(n).padStart(4, '0'), name: `Person ${n}`, hospital: `Hospital ${n}`,
      email: 'contact@example.test', phone: '1234567', created_at: n % 2 ? n : undefined,
      ...(n < 66 ? { is_deleted: false } : n < 69 ? { is_deleted: true } : {}),
    }))
  })

  it('pages inbox and Trash separately, restores records, and scans empty legacy pages without losing older inquiries', async () => {
    await openDashboard()
    fireEvent.click(screen.getByRole('button', { name: 'Customer inquiries' }))
    await screen.findByText('Hospital 0')
    expect(screen.getAllByRole('article')).toHaveLength(25)
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    await screen.findByText('Hospital 25')
    expect(screen.queryByText('Hospital 0')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    await screen.findByText('Hospital 50')
    expect(screen.getAllByRole('article')).toHaveLength(16)
    expect(screen.getByRole('button', { name: 'Next page' }).disabled).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }))
    await screen.findByText('Hospital 25')
    fireEvent.change(screen.getByLabelText('Inquiry view'), { target: { value: 'trash' } })
    await screen.findByText('Hospital 66')
    expect(screen.getAllByRole('article')).toHaveLength(3)
    fireEvent.click(screen.getAllByRole('button', { name: 'Restore inquiry' })[0])
    await waitFor(() => expect(screen.queryByText('Hospital 66')).toBeNull())
    expect(state.inquiries[66].is_deleted).toBe(false)
    fireEvent.change(screen.getByLabelText('Inquiry view'), { target: { value: 'legacy' } })
    await screen.findByText('No legacy inquiries in this scan.')
    expect(screen.getByRole('button', { name: 'Next scan' }).disabled).toBe(false)
    for (let scan = 2; scan <= 4; scan++) {
      fireEvent.click(screen.getByRole('button', { name: 'Next scan' }))
      await waitFor(() => expect(screen.getByRole('navigation', { name: 'Inquiry pages' }).textContent).toContain(`Scan ${scan} ·`))
    }
    expect(screen.getByText('Hospital 75')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Next scan' }).disabled).toBe(true)
    for (const read of state.reads.filter((request) => request.name === 'inquiries')) {
      expect(read.constraints.find((constraint) => constraint.kind === 'limit')?.count).toBe(25)
      expect(read.constraints.find((constraint) => constraint.kind === 'order')?.field).toBe('__name__')
    }
    expect(state.reads.some((request) => request.constraints?.some((constraint) => constraint.kind === 'where' && constraint.value === true))).toBe(true)
    expect(state.reads.some((request) => request.constraints?.some((constraint) => constraint.kind === 'where' && constraint.value === false))).toBe(true)
  })

  it('retains the failed page for explicit retry instead of advancing a stale cursor', async () => {
    await openDashboard()
    fireEvent.click(screen.getByRole('button', { name: 'Customer inquiries' }))
    await screen.findByText('Hospital 0')
    state.fail = true
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    await screen.findByRole('alert')
    expect(screen.getByRole('button', { name: 'Next page' }).disabled).toBe(true)
    state.fail = false
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
    await screen.findByText('Hospital 25')
    expect(screen.getByRole('navigation', { name: 'Inquiry pages' }).textContent).toContain('Page 2')
  })
})
