import { useEffect } from 'react'

const defaultDescription =
  'Medical equipment, hospital installations and biomedical support across North India. Connect with Medelec Healthcare Solutions in Mohali.'

export default function PageMeta({
  title,
  description = defaultDescription,
  noindex = false,
}) {
  useEffect(() => {
    document.title = title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.content = description
    let robots = document.querySelector('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = noindex ? 'noindex, nofollow' : 'index, follow'
  }, [title, description, noindex])
  return null
}
