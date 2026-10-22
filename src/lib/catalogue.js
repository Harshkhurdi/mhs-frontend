const brandOrder = ['hamilton', 'karl-storz', 'spacelabs', 'kiran', 'samsung', 'linet', 'helmier', 'nihon-kohden']
const supported = (p) => brandOrder.includes(p.brand) && (p.brand !== 'nihon-kohden' || p.specialty === 'defibrillation')

// Normalise model names so an existing MHS listing enriches its manufacturer entry.
export function productKey(product) {
  const model = String(product.name || '')
    .toLowerCase()
    .replace(/the new|karl storz|kiran medical|spacelabs|healthcare|hamilton|samsung|linet/g, '')
    .replace(
      /compact|bedside|patient|monitor|ventilator|icu|hospital|ultrasound|system|\bbed\b/g,
      '',
    )
    .replace(/[^a-z0-9]+/g, '')
  return `${product.brand}:${model}`
}

export function mergeCatalogue(reference, live) {
  const products = reference.filter(supported).map((p) => ({ ...p, manufacturerRecordId: p.id }))
  const modelIndices = new Map()
  products.forEach((p, i) => {
    const key = productKey(p)
    modelIndices.set(key, [...(modelIndices.get(key) || []), i])
  })
  for (const p of live) {
    if (!supported(p) || typeof p.name !== 'string' || !p.name.trim()) continue
    const candidates = modelIndices.get(productKey(p)) || []
    // Do not guess when different reference entries share the same model name.
    const index =
      candidates.length === 1
        ? candidates[0]
        : products.findIndex((source) => source.id === p.id)
    if (index < 0) {
      products.push(p)
      continue
    }
    const source = products[index]
    products[index] = {
      ...source,
      ...p,
      id: source.id,
      inventoryRecordId: p.id,
      image: source.image,
      imageUrl: source.imageUrl,
      sourceUrl: source.sourceUrl,
      pdfUrl: source.pdfUrl || p.pdfUrl,
      categoryLabel: source.categoryLabel,
      manufacturerRecordId: source.manufacturerRecordId,
    }
  }
  return products
}

export function filterCatalogue(
  products,
  { specialty = '', brand = '', search = '' },
) {
  const terms = search.toLowerCase().trim().split(/\s+/).filter(Boolean)
  return products.filter((p) => {
    if (specialty && p.specialty !== specialty) return false
    if (brand && p.brand !== brand) return false
    const text = [
      p.name,
      p.brand,
      p.description,
      p.categoryLabel,
      ...(p.applications || []),
    ]
      .join(' ')
      .toLowerCase()
    return terms.every((term) => text.includes(term))
  })
}

const featured = [
  'hamilton-c6',
  'karl-storz-th121',
  'spacelabs-qube',
  'kiran-flat-panel-based-digital-carm',
  'samsung-r20',
  'linet-multicare-x',
  'helmier-graseby-2000-2100',
  'nihon-kohden-tec-5600',
  'hamilton-hf90',
  'samsung-gm85-elite',
  'linet-eleganza-5',
  'spacelabs-ontrak',
]
// Requested KARL STORZ order: C-MAC monitor, former pages 3 and 4, then page 1.
const karlStorzOrder = [
  'karl-storz-8404zx',
  'karl-storz-8403xd',
  'karl-storz-8403xsi',
  'karl-storz-8403xsp',
  'karl-storz-051216-10',
  'karl-storz-051213-10',
  'karl-storz-051214-10',
  'karl-storz-051110-10',
  'karl-storz-051111-10',
  'karl-storz-8404hx',
  'karl-storz-8404hxp',
  'karl-storz-8404exc',
  'karl-storz-8404kxc',
  'karl-storz-8404ax',
  'karl-storz-8404axc',
  'karl-storz-8404bx',
  'karl-storz-8404bxc',
  'karl-storz-8404dxc',
  'karl-storz-8404gxc',
  'karl-storz-8404mxc',
  'karl-storz-10331bx',
  'karl-storz-091330-06',
  'karl-storz-11102cm',
  'karl-storz-tl300',
  'karl-storz-ui600',
  'karl-storz-ui400',
  'karl-storz-ui500',
  'karl-storz-up210',
  'karl-storz-up220',
  'karl-storz-ug230',
  'karl-storz-ug110',
  'karl-storz-ug120',
  'karl-storz-ug210',
  'karl-storz-ug220',
  'karl-storz-26120bha',
  'karl-storz-11272vh',
  'karl-storz-11272vhu',
  'karl-storz-th121',
  'karl-storz-wm100',
  'karl-storz-tm220',
  'karl-storz-tm351',
  'karl-storz-tm343',
  'karl-storz-tm441',
  'karl-storz-tm442',
  'karl-storz-tm451',
  'karl-storz-wd310',
  'karl-storz-28272tm',
  'karl-storz-ur502',
  'karl-storz-ur200',
  'karl-storz-uh300e',
  'karl-storz-uh300',
  'karl-storz-uh401',
  'karl-storz-uh400e',
  'karl-storz-uh400',
  'karl-storz-10318gl',
]
const karlStorzRanks = new Map(karlStorzOrder.map((id, index) => [id, index]))

export function sortCatalogue(products, sort = 'featured', brand = '') {
  return [...products].sort((a, b) => {
    if (sort === 'featured' && brand === 'karl-storz') {
      const aRank = karlStorzRanks.get(a.manufacturerRecordId || a.id) ?? Infinity
      const bRank = karlStorzRanks.get(b.manufacturerRecordId || b.id) ?? Infinity
      if (aRank !== bRank) return aRank < bRank ? -1 : 1
      return a.name.localeCompare(b.name, 'en', { numeric: true })
    }
    if (sort === 'featured') {
      const aRank = featured.indexOf(a.manufacturerRecordId || a.id)
      const bRank = featured.indexOf(b.manufacturerRecordId || b.id)
      if (aRank !== bRank)
        return (aRank < 0 ? 999 : aRank) - (bRank < 0 ? 999 : bRank)
    }
    if (sort === 'brand')
      return brandOrder.indexOf(a.brand) - brandOrder.indexOf(b.brand) || a.name.localeCompare(b.name)
    return a.name.localeCompare(b.name, 'en', { numeric: true })
  })
}
