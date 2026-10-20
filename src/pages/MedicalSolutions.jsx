import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore/lite'
import { HiOutlineMagnifyingGlass, HiArrowUpRight } from 'react-icons/hi2'
import { db } from '../config/firebaseDatabase'
import { clinicalSpecialties, manufacturerBrands } from '../data/products'
import { withTimeout } from '../lib/quote'
import ProductCard from '../components/ProductCard'
import PageIntro from '../components/PageIntro'

export default function MedicalSolutions() {
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const specialty = params.get('specialty') || ''
  const brand = params.get('brand') || ''
  const search = params.get('q') || ''
  const setFilter = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        if (!db) throw new Error('Catalogue connection unavailable')
        const snapshot = await withTimeout(
          getDocs(
            query(
              collection(db, 'products'),
              where('is_published', '==', true),
            ),
          ),
        )
        if (cancelled) return
        setProducts(
          snapshot.docs
            .map((d) => ({
              ...d.data(),
              id: d.id,
              image: d.data().image_url,
              pdfUrl: d.data().pdf_url,
            }))
            .filter((p) => typeof p.name === 'string' && p.name.trim())
            .sort((a, b) => a.name.localeCompare(b.name)),
        )
      } catch {
        if (!cancelled)
          setError(
            'We couldn’t load the current catalogue. Try again, or contact our team for product availability.',
          )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [attempt])
  const filtered = products.filter(
    (p) =>
      (!specialty || p.specialty === specialty) &&
      (!brand || p.brand === brand) &&
      `${p.name} ${p.description} ${manufacturerBrands.find((b) => b.id === p.brand)?.name || p.brand}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
  )
  const hasFilters = specialty || brand || search
  return (
    <>
      <PageIntro
        eyebrow="Medical solutions"
        title={
          <>
            Technology for
            <br />
            <span>better clinical care.</span>
          </>
        }
        description="Find the right equipment for your facility. Explore our portfolio, build your quote list, and talk to our team about specifications and availability."
      />
      <section className="section catalogue-section">
        <div className="wrap catalogue-layout">
          <aside className="catalogue-sidebar">
            <p className="eyebrow">FIND YOUR SOLUTION</p>
            <label className="search-field">
              <HiOutlineMagnifyingGlass size={20} />
              <input
                type="search"
                aria-label="Search equipment"
                placeholder="Search equipment…"
                value={search}
                onChange={(e) => setFilter('q', e.target.value)}
              />
            </label>
            <h2>Clinical specialty</h2>
            <div className="category-filters">
              <button
                aria-pressed={!specialty}
                className={!specialty ? 'selected' : ''}
                onClick={() => setFilter('specialty', '')}
              >
                All specialties <span>{products.length}</span>
              </button>
              {clinicalSpecialties.map((s) => (
                <button
                  key={s.id}
                  aria-pressed={specialty === s.id}
                  className={specialty === s.id ? 'selected' : ''}
                  onClick={() => setFilter('specialty', s.id)}
                >
                  {s.name}
                  <HiArrowUpRight />
                </button>
              ))}
            </div>
            <label className="filter-label" htmlFor="manufacturer">
              Manufacturer
            </label>
            <select
              id="manufacturer"
              value={brand}
              onChange={(e) => setFilter('brand', e.target.value)}
            >
              <option value="">All manufacturers</option>
              {manufacturerBrands.map((b) => (
                <option value={b.id} key={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            {hasFilters && (
              <button
                className="text-link reset-filters"
                onClick={() => setParams({}, { replace: true })}
              >
                Clear all filters
              </button>
            )}
            <div className="sidebar-help">
              <h3>Not sure where to start?</h3>
              <p>
                We’ll help you match equipment to your clinical requirements.
              </p>
              <Link to="/contact" className="text-link">
                Ask our team <HiArrowUpRight />
              </Link>
            </div>
          </aside>
          <div>
            <div className="catalogue-results-heading">
              <h2>
                {clinicalSpecialties.find((s) => s.id === specialty)?.name ||
                  'Our equipment portfolio'}
              </h2>
              <p role="status" aria-live="polite">
                {loading
                  ? 'Loading catalogue…'
                  : `${filtered.length} ${filtered.length === 1 ? 'product' : 'products'}`}
              </p>
            </div>
            {loading ? (
              <div className="product-grid" aria-label="Loading equipment">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="product-skeleton">
                    <div />
                    <span />
                    <span />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="empty-state" role="alert">
                <h3>Let’s reconnect.</h3>
                <p>{error}</p>
                <button
                  className="button"
                  onClick={() => setAttempt((n) => n + 1)}
                >
                  Try again
                </button>
                <Link to="/contact" className="text-link">
                  Contact Medelec <HiArrowUpRight />
                </Link>
              </div>
            ) : filtered.length ? (
              <div className="product-grid">
                {filtered.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    brandName={
                      manufacturerBrands.find((b) => b.id === p.brand)?.name ||
                      p.brand
                    }
                    specialtyName={
                      clinicalSpecialties.find((s) => s.id === p.specialty)
                        ?.name || p.specialty
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <HiOutlineMagnifyingGlass size={40} />
                <h3>
                  {hasFilters
                    ? 'No equipment matches these filters.'
                    : 'Tell us what you’re looking for.'}
                </h3>
                <p>
                  {hasFilters
                    ? 'Try a different search or clear your filters to browse the full portfolio.'
                    : 'Our team can share current equipment options and help you plan your requirements.'}
                </p>
                {hasFilters && (
                  <button
                    className="button button-outline"
                    onClick={() => setParams({}, { replace: true })}
                  >
                    Clear filters
                  </button>
                )}
                <Link to="/contact" className="text-link">
                  Discuss your requirements <HiArrowUpRight />
                </Link>
              </div>
            )}
            <div className="catalogue-note">
              <strong>A quotation tailored to your facility.</strong>
              <p>
                Availability, specifications, installation, training and
                warranty terms are confirmed with your quotation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
