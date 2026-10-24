import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MedicalSolutions from '../src/pages/MedicalSolutions'

vi.mock('../src/config/firebaseDatabase', () => ({ db: null }))
vi.mock('../src/components/ProductCard', () => ({ default: () => null }))
vi.mock('../src/components/ProductDetails', () => ({ default: () => null }))
afterEach(cleanup)

test('revealing filters focuses the selected category and both Escape and selection restore the trigger', () => {
  Element.prototype.scrollIntoView = vi.fn()
  render(<MemoryRouter><MedicalSolutions /></MemoryRouter>)
  const trigger = screen.getByRole('button', { name: /^Filters/ })
  const panel = document.getElementById('equipment-filters')
  fireEvent.click(trigger)
  expect(document.activeElement).toBe(panel.querySelector('[aria-pressed="true"]'))
  fireEvent.keyDown(document.activeElement, { key: 'Escape' })
  expect(document.activeElement).toBe(trigger)
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  fireEvent.click(trigger)
  fireEvent.click(within(panel).getByRole('button', { name: /Patient Monitoring/ }))
  expect(document.activeElement).toBe(trigger)
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
})
