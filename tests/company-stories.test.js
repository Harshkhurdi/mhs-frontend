import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { companyStories, additionalVisitPhotos } from '../src/data/companyStories.js'
import { defaultEvents } from '../src/data/events.js'
import { communityCompany } from '../src/lib/community.js'
const manifest = JSON.parse(readFileSync(new URL('../docs/company-photo-manifest.json', import.meta.url)))

test('all 51 supplied photos retain the owner’s exact event boundaries and upload order', () => {
  const groups = [
    ['homi-bhabha-sangrur-c3', 1, 2], ['aiims-mohali-c6', 3, 3], ['exhibition-booth-outdoor', 4, 11],
    ['gmch-patiala-application', 12, 16], ['homi-bhabha-new-chandigarh-c3', 17, 19],
    ['exhibition-booth-indoor', 20, 25], ['gmch-patiala-intubation', 26, 26], ['team-pool', 27, 32],
    ['homi-bhabha-clinical-session', 33, 35], ['pilbs-mohali-ot-light', 36, 37], ['gmch-patiala-paediatrics', 38, 38],
    ['partner-meeting-dubai-2025', 39, 42], ['our-team', 43, 44], ['punjab-cm-equipment-visit', 45, 45],
    ['aaj-tak-coverage', 46, 46], ['founder-ultisys', 47, 47], ['booth-team-meeting', 48, 48],
    ['equipment-dispatch', 49, 49], ['founder-leadership', 50, 51],
  ]
  assert.equal(manifest.length, 51)
  assert.deepEqual(manifest.map((row) => row.index), Array.from({ length: 51 }, (_, i) => i + 1))
  for (const [suffix, start, end] of groups) {
    const rows = manifest.filter((row) => row.album.endsWith(suffix))
    assert.deepEqual(rows.map((row) => row.index), Array.from({ length: end - start + 1 }, (_, i) => start + i))
    const story = defaultEvents.find((event) => event.id.endsWith(suffix))
    assert.ok(story, suffix)
    assert.deepEqual(story.photos.filter((photo) => photo.id.startsWith('medelec-story-')).map((photo) => Number(photo.id.split('-').at(-1))), rows.map((row) => row.index))
  }
  assert.equal(companyStories.length, 18)
  assert.equal(additionalVisitPhotos.length, 1)
})

test('photo assets and lightweight covers exist; confirmed facts and company labels are preserved', () => {
  for (const row of manifest) assert.ok(existsSync(new URL('../public' + row.asset, import.meta.url)), row.asset)
  for (const event of companyStories) {
    assert.ok(event.photos.length >= 1 && event.photos.length <= 10)
    for (const photo of event.photos) {
      assert.ok(existsSync(new URL('../public' + photo.thumbnail, import.meta.url)))
      assert.notEqual(photo.src, photo.thumbnail)
      assert.ok(photo.alt.trim())
    }
  }
  const awards = companyStories.find((event) => event.id.endsWith('partner-meeting-dubai-2025'))
  assert.match(awards.summary, /2024 performance/)
  assert.match(awards.location, /Dubai.*24–26 September 2025/)
  assert.equal(communityCompany(companyStories.find((event) => event.id.endsWith('founder-ultisys'))), 'kiran')
  assert.equal(communityCompany(companyStories.find((event) => event.id.endsWith('gmch-patiala-intubation'))), 'karl-storz')
  assert.equal(communityCompany(companyStories.find((event) => event.id.endsWith('pilbs-mohali-ot-light'))), '')
})
