import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { businessStructuredData, pageMetadata, publicPages, siteImage, siteName } from '../src/lib/seo.js'

const output = resolve('dist')
const template = await readFile(resolve(output, 'index.html'), 'utf8')
const marker = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/
if (!marker.test(template)) throw new Error('Missing SEO template markers')

function escape(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character])
}

// Static page-specific head tags support crawlers and social previews before JS.
// The existing React application continues to render the page content.
function htmlFor(path) {
  const page = pageMetadata(path)
  const tags = [
    `<title>${escape(page.title)}</title>`,
    `<meta name="description" content="${escape(page.description)}" />`,
    `<meta name="robots" content="${page.noindex ? 'noindex, nofollow' : 'index, follow'}" />`,
    `<meta property="og:title" content="${escape(page.title)}" />`,
    `<meta property="og:description" content="${escape(page.description)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${siteName}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:image" content="${siteImage}" />`,
    `<meta property="og:image:alt" content="${siteName} logo" />`,
    '<meta name="twitter:card" content="summary" />',
    `<meta name="twitter:title" content="${escape(page.title)}" />`,
    `<meta name="twitter:description" content="${escape(page.description)}" />`,
    `<meta name="twitter:image" content="${siteImage}" />`,
  ]
  if (page.canonical) {
    tags.push(`<link rel="canonical" href="${page.canonical}" />`)
    tags.push(`<meta property="og:url" content="${page.canonical}" />`)
    tags.push(`<script id="medelec-business-schema" type="application/ld+json">${JSON.stringify(businessStructuredData).replace(/</g, '\\u003c')}</script>`)
  }
  return template.replace(marker, `<!-- seo:start -->\n${tags.join('\n')}\n<!-- seo:end -->`)
}

for (const path of [...Object.keys(publicPages), '/admin', '/admin/login']) {
  const directory = path === '/' ? output : resolve(output, path.slice(1))
  await mkdir(directory, { recursive: true })
  await writeFile(resolve(directory, 'index.html'), htmlFor(path))
}
await writeFile(resolve(output, '404.html'), htmlFor('/404'))
const urls = Object.keys(publicPages).map((path) => `  <url><loc>${pageMetadata(path).canonical}</loc></url>`)
await writeFile(resolve(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`)
console.log(`Generated SEO metadata and sitemap for ${urls.length} public pages.`)
