import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { pageMetadata, publicPages, siteUrl } from '../src/lib/seo.js'

test('canonical URLs consolidate aliases, trailing slashes and catalogue filter URLs on the public domain', () => {
  assert.equal(pageMetadata('/home').canonical, `${siteUrl}/`)
  assert.equal(pageMetadata('/solutions/?brand=helmier&q=pump#equipment-results').canonical, `${siteUrl}/solutions`)
  assert.equal(pageMetadata('/contact?type=service').canonical, `${siteUrl}/contact`)
  const titles = Object.keys(publicPages).map((path) => pageMetadata(path).title)
  assert.equal(new Set(titles).size, titles.length)
})

test('staff and missing pages stay excluded from indexing and never inherit a public canonical URL', () => {
  for (const path of ['/admin', '/admin/login', '/admin/inquiries', '/missing-page']) {
    const page = pageMetadata(path, { title: 'Private page' })
    assert.equal(page.noindex, true)
    assert.equal(page.canonical, null)
  }
  assert.equal(pageMetadata('/', { noindex: true }).canonical, null)
})

test('every public subpage is routed to its own static metadata document on Vercel', () => {
  const { rewrites } = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url)))
  for (const path of Object.keys(publicPages).filter((path) => path !== '/')) {
    assert.ok(rewrites.some((rule) => rule.source === path && rule.destination === `${path}/index.html`), path)
  }
})
