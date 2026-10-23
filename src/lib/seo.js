export const siteUrl = 'https://www.medelec.in'
export const siteName = 'Medelec Healthcare Solutions'
export const siteImage = `${siteUrl}/images/brand/mhs-logo.jpeg`

export const publicPages = {
  '/': {
    title: 'Medelec Healthcare Solutions | Medical Equipment in Mohali',
    description: 'Medical equipment supply, installation and service support in Mohali and across North India. Explore manufacturer ranges and contact the Medelec team.',
  },
  '/about': {
    title: 'About Medelec Healthcare Solutions | Mohali, Punjab',
    description: 'Meet Medelec Healthcare Solutions, our founder, administration and service engineers supporting medical equipment installations and ongoing care across North India.',
  },
  '/solutions': {
    title: 'Medical Equipment Catalogue | Medelec Healthcare Solutions',
    description: 'Explore medical equipment from Hamilton Medical, KARL STORZ, Spacelabs, Kiran, Samsung, LINET, Helmier and Nihon Kohden, with official product information.',
  },
  '/service': {
    title: 'Medical Equipment Service & Support | Medelec, Mohali',
    description: 'Contact Medelec for medical equipment installation, preventive maintenance, fault assessment and service coordination in Mohali and across North India.',
  },
  '/events': {
    title: 'Installations, Training & Events | Medelec Healthcare Solutions',
    description: 'See photographs from Medelec medical equipment installations, hands-on training, manufacturer meetings and healthcare events.',
  },
  '/community': {
    title: 'Our Community & Photographs | Medelec Healthcare Solutions',
    description: 'Explore the people and partnerships behind Medelec: real equipment installations, training, team photographs and shared moments with healthcare teams.',
  },
  '/contact': {
    title: 'Contact Medelec Healthcare Solutions | Mohali, Punjab',
    description: 'Contact Medelec in Mohali for medical equipment quotations, installations and service support. Email info@medelec.in or send an inquiry through our website.',
  },
}

export function pageMetadata(pathname, fallback = {}) {
  const path = pathname.split(/[?#]/)[0].replace(/\/+$/, '') || '/'
  const page = publicPages[path === '/home' ? '/' : path]
  const noindex = Boolean(fallback.noindex || !page)
  return {
    title: page?.title || fallback.title || siteName,
    description: page?.description || fallback.description || publicPages['/'].description,
    noindex,
    canonical: noindex ? null : `${siteUrl}${path === '/home' || path === '/' ? '/' : path}`,
  }
}

// Only facts already published in the site's contact and company sections.
export const businessStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': `${siteUrl}/#business`,
      name: siteName,
      url: `${siteUrl}/`,
      logo: siteImage,
      image: siteImage,
      description: 'Medical equipment supply, installation and service engineering support across North India.',
      email: 'info@medelec.in',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'F-382, Asha Towers, Phase 8B, Sector 74',
        addressLocality: 'Mohali',
        addressRegion: 'Punjab',
        postalCode: '160055',
        addressCountry: 'IN',
      },
      areaServed: 'North India',
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: siteName,
      publisher: { '@id': `${siteUrl}/#business` },
      inLanguage: 'en-IN',
    },
  ],
}
