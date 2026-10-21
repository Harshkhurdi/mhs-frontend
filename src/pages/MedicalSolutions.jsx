import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore/lite'
import {
  HiOutlineMagnifyingGlass,
  HiArrowUpRight,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineXMark,
  HiArrowLeft,
  HiArrowRight,
} from 'react-icons/hi2'
import { db } from '../config/firebaseDatabase'
import { clinicalSpecialties, manufacturerBrands } from '../data/products'
import { partners } from '../data/partners'
import reference from '../data/manufacturerCatalogue.json'
import { withTimeout } from '../lib/quote'
import {
  mergeCatalogue,
  filterCatalogue,
  sortCatalogue,
} from '../lib/catalogue'
import ProductCard from '../components/ProductCard'
import ProductDetails from '../components/ProductDetails'
import PageMeta from '../components/PageMeta'

const pageSize = 18
const checkedDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(reference.verifiedAt))
export default function MedicalSolutions() {
  const [params, setParams] = useSearchParams()
  const [liveProducts, setLiveProducts] = useState([])
  const [selected, setSelected] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const specialty = params.get('specialty') || ''
  const brand = params.get('brand') || ''
  const search = params.get('q') || ''
  const sort = params.get('sort') || 'featured'
  function setFilter(key, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setParams(next, { replace: true })
  }
  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!db) return
      try {
        const snapshot = await withTimeout(
          getDocs(
            query(
              collection(db, 'products'),
              where('is_published', '==', true),
            ),
          ),
          8000,
        )
        if (!cancelled)
          setLiveProducts(
            snapshot.docs.map((d) => ({
              ...d.data(),
              id: d.id,
              image: d.data().image_url,
              pdfUrl: d.data().pdf_url,
            })),
          )
      } catch {
        /* The verified manufacturer catalogue remains available. */
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])
  const products = mergeCatalogue(reference.products, liveProducts)
  const filtered = sortCatalogue(
    filterCatalogue(products, { specialty, brand, search }),
    sort,
  )
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(
    pageCount,
    Math.max(1, Number.parseInt(params.get('page'), 10) || 1),
  )
  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )
  useEffect(() => {
    if (filtersOpen)
      document
        .getElementById('equipment-filters')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [filtersOpen])
  const filtersCount = Number(Boolean(specialty)) + Number(Boolean(brand))
  const hasFilters = specialty || brand || search
  const reset = () => {
    setParams({}, { replace: true })
    setFiltersOpen(false)
  }
  function goPage(page) {
    const next = new URLSearchParams(params)
    next.set('page', String(page))
    setParams(next)
    document
      .getElementById('equipment-results')
      ?.scrollIntoView({ behavior: 'instant' })
  }
  return (
    <>
      <PageMeta
        title="Medical Equipment Catalogue | Medelec Healthcare Solutions"
        description="Explore equipment from Hamilton Medical, Samsung Healthcare, LINET, Spacelabs, KARL STORZ and Kiran Medical, with real photographs and official product literature."
      />
      <section className="catalogue-intro">
        <div className="wrap">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Medical equipment</span>
          </div>
          <div className="catalogue-intro-heading">
            <div>
              <p className="eyebrow">THE MEDELEC EQUIPMENT LIBRARY</p>
              <h1>
                Find your next
                <br />
                <em>clinical advantage.</em>
              </h1>
            </div>
            <p>
              Real equipment. Official information.
              <br />
              Explore the manufacturer ranges and build a quote around your
              facility’s needs.
            </p>
          </div>
          <div className="catalogue-search">
            <HiOutlineMagnifyingGlass />
            <input
              type="search"
              aria-label="Search equipment"
              value={search}
              onChange={(e) => setFilter('q', e.target.value)}
              placeholder="Search equipment, model or application…"
            />
            {search && (
              <button
                aria-label="Clear search"
                onClick={() => setFilter('q', '')}
              >
                <HiOutlineXMark />
              </button>
            )}
            <span>{products.length} equipment & families</span>
          </div>
        </div>
      </section>
      <section className="catalogue-body">
        <div className="wrap">
          <div className="brand-filter-bar" aria-label="Filter by manufacturer">
            <button
              className={!brand ? 'active' : ''}
              aria-pressed={!brand}
              onClick={() => setFilter('brand', '')}
            >
              All manufacturers <span>{products.length}</span>
            </button>
            {manufacturerBrands.map((b) => (
              <button
                key={b.id}
                className={brand === b.id ? 'active' : ''}
                aria-pressed={brand === b.id}
                onClick={() => setFilter('brand', b.id)}
              >
                {b.name}
                <span>{products.filter((p) => p.brand === b.id).length}</span>
              </button>
            ))}
          </div>
          <div className="catalogue-layout">
            <aside
              className={`catalogue-sidebar ${filtersOpen ? 'filters-open' : ''}`}
              id="equipment-filters"
            >
              <div className="filter-heading">
                <p className="eyebrow">EXPLORE BY CLINICAL NEED</p>
                <button
                  aria-label="Close filters"
                  className="mobile-filter-close"
                  onClick={() => setFiltersOpen(false)}
                >
                  <HiOutlineXMark />
                </button>
              </div>
              <div className="category-filters">
                <button
                  aria-pressed={!specialty}
                  className={!specialty ? 'selected' : ''}
                  onClick={() => {
                    setFilter('specialty', '')
                    setFiltersOpen(false)
                  }}
                >
                  All equipment <span>{products.length}</span>
                </button>
                {clinicalSpecialties.map((s) => (
                  <button
                    key={s.id}
                    aria-pressed={specialty === s.id}
                    className={specialty === s.id ? 'selected' : ''}
                    onClick={() => {
                      setFilter('specialty', s.id)
                      setFiltersOpen(false)
                    }}
                  >
                    {s.name}
                    <span>
                      {
                        products.filter(
                          (p) =>
                            p.specialty === s.id &&
                            (!brand || p.brand === brand),
                        ).length
                      }
                    </span>
                  </button>
                ))}
              </div>
              <div className="sidebar-help">
                <HiOutlineAdjustmentsHorizontal />
                <h3>Let’s find the right fit.</h3>
                <p>
                  Talk to our team about configuration, local availability and
                  engineering support.
                </p>
                <Link to="/contact" className="text-link">
                  Ask Medelec <HiArrowUpRight />
                </Link>
              </div>
              <p className="catalogue-verification">
                Manufacturer range checked
                <br />
                <strong>{checkedDate}</strong>
              </p>
            </aside>
            <div className="catalogue-results" id="equipment-results">
              <div className="catalogue-results-heading">
                <div>
                  <h2>
                    {clinicalSpecialties.find((s) => s.id === specialty)
                      ?.name || 'Explore the equipment'}
                  </h2>
                  <p role="status" aria-live="polite">
                    {filtered.length}{' '}
                    {filtered.length === 1 ? 'result' : 'results'}
                    {filtered.length > pageSize
                      ? ` · Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)}`
                      : ''}
                  </p>
                </div>
                <div className="results-controls">
                  <button
                    className="mobile-filter-button"
                    aria-expanded={filtersOpen}
                    aria-controls="equipment-filters"
                    onClick={() => setFiltersOpen(!filtersOpen)}
                  >
                    <HiOutlineAdjustmentsHorizontal /> Filters
                    {filtersCount ? ` (${filtersCount})` : ''}
                  </button>
                  <label className="sort-label">
                    <span className="sr-only">Sort equipment</span>
                    <select
                      aria-label="Sort equipment"
                      value={sort}
                      onChange={(e) => setFilter('sort', e.target.value)}
                    >
                      <option value="featured">Featured first</option>
                      <option value="name">Name A–Z</option>
                      <option value="brand">By manufacturer</option>
                    </select>
                  </label>
                </div>
              </div>
              {hasFilters && (
                <div className="active-filter-summary">
                  {brand && (
                    <button onClick={() => setFilter('brand', '')}>
                      {manufacturerBrands.find((b) => b.id === brand)?.name ||
                        brand}
                      <HiOutlineXMark />
                    </button>
                  )}
                  {specialty && (
                    <button onClick={() => setFilter('specialty', '')}>
                      {clinicalSpecialties.find((s) => s.id === specialty)
                        ?.name || specialty}
                      <HiOutlineXMark />
                    </button>
                  )}
                  {search && (
                    <button onClick={() => setFilter('q', '')}>
                      “{search}”<HiOutlineXMark />
                    </button>
                  )}
                  <button className="clear-filters" onClick={reset}>
                    Clear all
                  </button>
                </div>
              )}
              {visible.length ? (
                <>
                  <div className="product-grid">
                    {visible.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        brandName={
                          manufacturerBrands.find((b) => b.id === p.brand)
                            ?.name || p.brand
                        }
                        onDetails={setSelected}
                      />
                    ))}
                  </div>
                  {pageCount > 1 && (
                    <nav
                      className="catalogue-pagination"
                      aria-label="Catalogue pages"
                    >
                      <button
                        disabled={currentPage <= 1}
                        onClick={() => goPage(currentPage - 1)}
                      >
                        <HiArrowLeft /> Previous
                      </button>
                      <span>
                        Page <strong>{currentPage}</strong> of {pageCount}
                      </span>
                      <button
                        disabled={currentPage >= pageCount}
                        onClick={() => goPage(currentPage + 1)}
                      >
                        Next <HiArrowRight />
                      </button>
                    </nav>
                  )}
                </>
              ) : (
                <div className="empty-state">
                  <HiOutlineMagnifyingGlass size={40} />
                  <h3>No equipment matches these filters.</h3>
                  <p>
                    Try a model name, a clinical application, or a different
                    manufacturer.
                  </p>
                  <button className="button button-outline" onClick={reset}>
                    Clear filters
                  </button>
                  <Link to="/contact" className="text-link">
                    Ask our team <HiArrowUpRight />
                  </Link>
                </div>
              )}
              <div className="catalogue-note">
                <strong>
                  Explore the range. Confirm the right configuration.
                </strong>
                <p>
                  This library includes manufacturer-listed equipment and
                  product families. Local availability, model variants,
                  accessories and service scope are confirmed with your
                  quotation. Images and literature belong to their respective
                  manufacturers.
                </p>
              </div>
              <div className="manufacturer-resources">
                <h3>Looking for another model or a specific document?</h3>
                <p>
                  Browse the manufacturers’ full directories for additional
                  variants and resources, or ask our service team to help
                  identify the right equipment and literature.
                </p>
                <div>
                  {partners.map((partner) => (
                    <a
                      key={partner.id}
                      href={partner.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {partner.name} <HiArrowUpRight />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {selected && (
        <ProductDetails product={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
