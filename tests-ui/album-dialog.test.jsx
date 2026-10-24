import { afterEach, beforeAll, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import AlbumDialog from '../src/components/AlbumDialog'

const photos = [1, 2].map(number => ({ id: String(number), src: `/images/events/photo-${number}.webp`, thumbnail: `/images/events/photo-${number}-thumb.webp`, alt: `Photograph ${number}` }))
const mocks = vi.hoisted(() => ({ load: vi.fn(), image: vi.fn() }))
vi.mock('../src/services/gallery', () => ({ loadAlbumPhotos: mocks.load, loadPhotoImage: mocks.image }))
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); this.querySelector('button').focus() }
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
})
afterEach(() => { cleanup(); vi.clearAllMocks(); document.body.style.overflow = ''; document.body.replaceChildren() })
const event = { id: 'album', title: 'Equipment in use', location: 'Hospital', category: 'Training', summary: 'A practical learning session.' }

test('viewer keyboard navigation requests selected assets and closing restores original focus', async () => {
  mocks.load.mockResolvedValue(photos)
  mocks.image.mockImplementation((album, photo) => Promise.resolve(photo.src))
  const trigger = document.createElement('button'); document.body.append(trigger); trigger.focus()
  const view = render(<AlbumDialog event={event} onClose={vi.fn()} />)
  await screen.findByAltText('Photograph 1')
  expect(document.body.style.overflow).toBe('hidden')
  expect(mocks.image).toHaveBeenCalledTimes(1)
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'ArrowRight' })
  await screen.findByAltText('Photograph 2')
  expect(mocks.image).toHaveBeenCalledTimes(2)
  view.unmount()
  await waitFor(() => expect(document.activeElement).toBe(trigger))
  expect(document.body.style.overflow).toBe('')
})

test('retrying a failed second image keeps its selection without fetching metadata again', async () => {
  mocks.load.mockResolvedValue(photos)
  mocks.image.mockImplementation((album, photo) => Promise.resolve(photo.src))
  render(<AlbumDialog event={event} initialIndex={1} onClose={vi.fn()} />)
  fireEvent.error(await screen.findByAltText('Photograph 2'))
  fireEvent.click(await screen.findByRole('button', { name: 'Try again' }))
  await screen.findByAltText('Photograph 2')
  expect(mocks.load).toHaveBeenCalledTimes(1)
})
