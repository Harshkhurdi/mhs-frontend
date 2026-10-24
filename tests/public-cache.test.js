import test from 'node:test'
import assert from 'node:assert/strict'
import { clearPublicCache, publicResource } from '../src/lib/publicCache.js'

test('public metadata deduplicates in-flight reads and cannot cache a result after invalidation', async () => {
  clearPublicCache()
  let finish
  let reads = 0
  const read = () => { reads++; return new Promise(resolve => { finish = resolve }) }
  const first = publicResource('test', read)
  assert.equal(publicResource('test', read), first)
  await Promise.resolve()
  assert.equal(reads, 1)
  clearPublicCache()
  finish('old')
  assert.equal(await first, 'old')
  assert.equal(await publicResource('test', () => 'new'), 'new')
  assert.equal(await publicResource('test', () => 'wrong'), 'new')
})
