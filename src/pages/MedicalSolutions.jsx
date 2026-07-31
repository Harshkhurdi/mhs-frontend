import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ScrollReveal from '../components/ScrollReveal'
import ProductCard from '../components/ProductCard'
import { useRFQ } from '../components/RFQContext'
import { clinicalSpecialties, manufacturerBrands } from '../data/products'
import { supabase } from '../config/supabaseClient'

export default function MedicalSolutions() {
  const [viewMode, setViewMode] = useState('specialty') // 'specialty' | 'brand'
  const [activeFilter, setActiveFilter] = useState('critical-care')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems } = useRFQ()

  useEffect(() => {
    let cancelled = false

    const fetchProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('is_published', true)

        if (cancelled) return

        if (fetchError) {
          throw new Error(fetchError.message)
        }

        // Map database fields to the component's expected shape
        const mapped = (data || []).map((item) => ({
          id: item.slug,
          name: item.name,
          specialty: item.specialty,
          brand: item.brand,
          description: item.description,
          image: item.image_url,
          pdfUrl: item.pdf_url,
        }))

        setProducts(mapped)
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load products')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      cancelled = true
    }
  }, [])

  const filters = viewMode === 'specialty' ? clinicalSpecialties : manufacturerBrands

  const filteredProducts = useMemo(() => {
    const key = viewMode === 'specialty' ? 'specialty' : 'brand'
    return products.filter((p) => p[key] === activeFilter)
  }, [viewMode, activeFilter, products])

  const activeFilterObj = filters.find((f) => f.id === activeFilter)

  const getBrandName = (brandId) =>
    manufacturerBrands.find((b) => b.id === brandId)?.name || ''
  const getSpecialtyName = (specialtyId) =>
    clinicalSpecialties.find((s) => s.id === specialtyId)?.name || ''

  return (
    <>
      <Helmet>
        <title>Medical Solutions | Medelec Healthcare Solutions</title>
      </Helmet>

      {/* Page Header */}
      <section className="pt-32 pb-12 bg-bg-platinum border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-surgical-teal">
              Dynamic Product Catalog
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-primary-blue mt-4 mb-4">
              Medical Solutions
            </h1>
            <p className="text-text-muted max-w-2xl text-lg">
              Browse our premium equipment portfolio by clinical specialty or manufacturer brand.
              Request technical specifications for any product — no e-commerce, just expert consultation.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Dual-Filter Tabs */}
      <section className="sticky top-16 lg:top-20 z-30 bg-white border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* View Mode Switch */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
            <div className="flex border border-border-light rounded-sm overflow-hidden">
              <button
                onClick={() => {
                  setViewMode('specialty')
                  setActiveFilter('critical-care')
                }}
                className={`px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  viewMode === 'specialty'
                    ? 'bg-primary-blue text-white'
                    : 'bg-white text-primary-blue hover:bg-bg-platinum'
                }`}
              >
                Browse by Clinical Specialty
              </button>
              <button
                onClick={() => {
                  setViewMode('brand')
                  setActiveFilter('hamilton')
                }}
                className={`px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  viewMode === 'brand'
                    ? 'bg-primary-blue text-white'
                    : 'bg-white text-primary-blue hover:bg-bg-platinum'
                }`}
              >
                Browse by Manufacturer Brand
              </button>
            </div>

            {totalItems > 0 && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-surgical-teal/10 text-surgical-teal text-sm font-medium rounded-sm hover:bg-surgical-teal/20 transition-all"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-surgical-teal opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-surgical-teal" />
                </span>
                RFQ List ({totalItems})
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 pb-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 text-sm font-medium rounded-sm transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-surgical-teal text-white'
                    : 'bg-bg-platinum text-primary-blue hover:bg-border-light'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Info */}
          <ScrollReveal>
            <div className="mb-8 flex items-center gap-3">
              <h2 className="text-xl font-bold text-primary-blue">{activeFilterObj?.name}</h2>
              <span className="text-text-muted">·</span>
              <p className="text-sm text-text-muted">{activeFilterObj?.description}</p>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-surgical-teal/30 border-t-surgical-teal rounded-full animate-spin" />
                <p className="text-sm text-text-muted">Loading products...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-4">
                <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-text-muted mb-2">Unable to load products</p>
              <p className="text-sm text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm font-medium text-surgical-teal border border-surgical-teal rounded-sm hover:bg-surgical-teal/10 transition-all"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {filteredProducts.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 80} className="h-full">
                  <ProductCard
                    product={product}
                    brandName={getBrandName(product.brand)}
                    specialtyName={getSpecialtyName(product.specialty)}
                  />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-text-muted">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Floating RFQ Panel */}
      {isOpen && totalItems > 0 && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-40 w-auto sm:w-96 bg-white rounded-sm shadow-2xl border border-border-light animate-fade-up max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-border-light">
            <div>
              <h3 className="font-bold text-primary-blue">Your RFQ List</h3>
              <p className="text-xs text-text-muted">{totalItems} item(s) selected</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-muted hover:text-primary-blue text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-5 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-bg-platinum rounded-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-blue truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center border border-border-light rounded-sm text-primary-blue hover:border-surgical-teal text-sm"
                    >
                      &minus;
                    </button>
                    <span className="text-sm text-primary-blue w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center border border-border-light rounded-sm text-primary-blue hover:border-surgical-teal text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-text-muted hover:text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="p-5 border-t border-border-light">
            <Link
              to="/contact"
              className="btn-teal w-full"
            >
              Submit RFQ Inquiry →
            </Link>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <section className="bg-bg-platinum py-12 border-t border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-14 h-14 bg-surgical-teal/10 rounded-sm flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 text-surgical-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary-blue mb-1">
                No Online Pricing — Direct Consultation Only
              </h3>
              <p className="text-sm text-text-muted">
                All medical equipment procurements are handled through personalized RFQ submissions.
                Our team provides detailed quotations including installation, training, and warranty terms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}