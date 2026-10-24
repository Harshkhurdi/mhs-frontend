import { beforeEach, expect, test, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ getDocs: vi.fn(), getDoc: vi.fn(), set: vi.fn(), commit: vi.fn() }))
vi.mock('../src/config/firebaseDatabase', () => ({ db: {} }))
vi.mock('firebase/firestore/lite', () => ({
  arrayRemove: vi.fn(), collection: (_db, ...path) => path.join('/'),
  doc: (_db, ...path) => ({ path: path.join('/'), id: path.at(-1) }),
  getDocs: mocks.getDocs, getDoc: mocks.getDoc, query: value => value, where: vi.fn(), setDoc: vi.fn(),
  writeBatch: () => ({ set: mocks.set, commit: mocks.commit }),
}))
import { loadAlbumPhotos, loadPhotoImage, saveAlbum } from '../src/services/gallery'
import { clearPublicCache } from '../src/lib/publicCache'
const data = 'data:image/webp;base64,AAAA'
const thumb = 'data:image/webp;base64,BBBB'
const form = { id: 'new-album', title: 'Clinical training', location: 'Hospital', summary: 'A practical session.', category: 'Training', event_date: '', is_published: true }
beforeEach(() => { clearPublicCache(); vi.clearAllMocks(); vi.stubEnv('VITE_GALLERY_SPLIT_ASSETS_ENABLED', 'false'); mocks.commit.mockResolvedValue() })

test('opening remote metadata does not fetch full assets until selected; repeated requests reuse public content', async () => {
  mocks.getDocs.mockResolvedValue({ docs: [{ id: 'p1', data: () => ({ src: thumb, thumbnail: thumb, asset_id: 'p1', is_published: true, position: 0 }) }] })
  mocks.getDoc.mockResolvedValue({ exists: () => true, data: () => ({ src: data }) })
  const event = { id: 'a1', remote: true, updated_at: 3 }
  const photos = await loadAlbumPhotos(event)
  expect(mocks.getDoc).not.toHaveBeenCalled()
  expect(await loadPhotoImage(event, photos[0])).toBe(data)
  expect(await loadPhotoImage(event, photos[0])).toBe(data)
  expect(mocks.getDoc).toHaveBeenCalledTimes(1)
  await loadAlbumPhotos(event)
  expect(mocks.getDocs).toHaveBeenCalledTimes(1)
})

test('uploads stay compatible before rules rollout; enabled split format separates full bytes from thumbnail metadata', async () => {
  const photo = { id: 'p1', src: data, thumbnail: thumb, alt: 'Training team' }
  await saveAlbum(form, [photo])
  expect(mocks.set.mock.calls.some(([ref]) => ref.path.includes('photoAssets'))).toBe(false)
  expect(mocks.set.mock.calls.find(([ref]) => ref.path.endsWith('photos/p1'))[1].src).toBe(data)
  mocks.set.mockClear(); vi.stubEnv('VITE_GALLERY_SPLIT_ASSETS_ENABLED', 'true')
  await saveAlbum(form, [photo])
  expect(mocks.set.mock.calls.find(([ref]) => ref.path.endsWith('photoAssets/p1'))[1].src).toBe(data)
  expect(mocks.set.mock.calls.find(([ref]) => ref.path.endsWith('photos/p1'))[1]).toMatchObject({ src: thumb, thumbnail: thumb, asset_id: 'p1' })
})

test('saving immutable bundled aliases persists canonical source paths across future deployments', async () => {
  await saveAlbum(form, [{ id: 'p1', src: '/media/0123456789abcdef-training.webp', thumbnail: '/media/0123456789abcdef-training-thumb.webp', alt: 'Training team' }])
  expect(mocks.set.mock.calls.find(([ref]) => ref.path.endsWith('photos/p1'))[1]).toMatchObject({ src: '/images/events/training.webp', thumbnail: '/images/events/training-thumb.webp' })
})

test('new uploads use the split format by default after the rules rollout', async () => {
  vi.stubEnv('VITE_GALLERY_SPLIT_ASSETS_ENABLED', undefined)
  await saveAlbum(form, [{ id: 'p1', src: data, thumbnail: thumb, alt: 'Training team' }])
  expect(mocks.set.mock.calls.find(([ref]) => ref.path.endsWith('photoAssets/p1'))[1].src).toBe(data)
  expect(mocks.set.mock.calls.find(([ref]) => ref.path.endsWith('photos/p1'))[1]).toMatchObject({ src: thumb, asset_id: 'p1' })
})
