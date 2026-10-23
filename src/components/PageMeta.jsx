import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { businessStructuredData, pageMetadata, siteImage, siteName } from '../lib/seo'

const defaultDescription =
  'Medical equipment, hospital installations and biomedical support across North India. Connect with Medelec Healthcare Solutions in Mohali.'

export default function PageMeta({
  title,
  description = defaultDescription,
  noindex = false,
}) {
  const { pathname } = useLocation()
  useEffect(() => {
    const metadata = pageMetadata(pathname, { title, description, noindex })
    document.title = metadata.title
    function setMeta(attribute, key, content) {
      let meta = document.querySelector(`meta[${attribute}="${key}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, key)
        document.head.appendChild(meta)
      }
      meta.content = content
    }
    setMeta('name', 'description', metadata.description)
    setMeta('name', 'robots', metadata.noindex ? 'noindex, nofollow' : 'index, follow')
    setMeta('property', 'og:title', metadata.title)
    setMeta('property', 'og:description', metadata.description)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', siteName)
    setMeta('property', 'og:image', siteImage)
    setMeta('property', 'og:image:alt', `${siteName} logo`)
    setMeta('name', 'twitter:card', 'summary')
    setMeta('name', 'twitter:title', metadata.title)
    setMeta('name', 'twitter:description', metadata.description)
    setMeta('name', 'twitter:image', siteImage)
    let canonical = document.querySelector('link[rel="canonical"]')
    let schema = document.getElementById('medelec-business-schema')
    if (metadata.canonical) {
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = metadata.canonical
      setMeta('property', 'og:url', metadata.canonical)
      if (!schema) {
        schema = document.createElement('script')
        schema.id = 'medelec-business-schema'
        schema.type = 'application/ld+json'
        document.head.appendChild(schema)
      }
      schema.textContent = JSON.stringify(businessStructuredData)
    } else {
      canonical?.remove()
      schema?.remove()
      document.querySelector('meta[property="og:url"]')?.remove()
    }
  }, [pathname, title, description, noindex])
  return null
}
