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
export function sortCatalogue(products, sort = 'featured') {
  return [...products].sort((a, b) => {
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
