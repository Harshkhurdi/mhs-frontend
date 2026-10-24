import { readdir, readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve, relative } from 'node:path'

// Original URLs remain available. Only content-addressed aliases are immutable.
export function versionedMedia() {
  let assets = []
  const replace = text => assets.reduce((result, asset) => result.replaceAll(asset.original, `/${asset.fileName}`), text)
  return {
    name: 'medelec-versioned-media', apply: 'build', enforce: 'pre',
    async buildStart() {
      const root = resolve('public')
      const emit = this.emitFile.bind(this)
      async function walk(directory) {
        for (const entry of await readdir(directory, { withFileTypes: true })) {
          const path = resolve(directory, entry.name)
          if (entry.isDirectory()) await walk(path)
          else if (/\.(webp|png|jpe?g|svg)$/i.test(entry.name)) {
            const source = await readFile(path)
            const hash = createHash('sha256').update(source).digest('hex').slice(0, 16)
            const fileName = `media/${hash}-${entry.name}`
            assets.push({ original: '/' + relative(root, path), fileName })
            emit({ type: 'asset', fileName, source })
          }
        }
      }
      assets = []
      await walk(resolve(root, 'images'))
    },
    transform(code, id) {
      if (id.includes('/src/') && /\.(jsx?|json|css)$/.test(id)) return { code: replace(code), map: null }
    },
    transformIndexHtml(html) { return replace(html) },
  }
}
