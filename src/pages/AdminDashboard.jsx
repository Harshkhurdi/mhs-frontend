import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../config/supabaseClient'

// Mapping dictionaries for display name ↔ internal ID conversion
const brandDisplayToId = {
  'Hamilton Medical': 'hamilton',
  'Samsung Healthcare': 'samsung',
  'Linet': 'linet',
  'Spacelabs Healthcare': 'spacelabs',
}

const brandIdToDisplay = Object.fromEntries(
  Object.entries(brandDisplayToId).map(([k, v]) => [v, k])
)

const specialtyDisplayToId = {
  'Critical Care': 'critical-care',
  'Radiology': 'radiology',
  'Ward Infrastructure': 'ward-infrastructure',
  'Patient Monitoring': 'patient-monitoring',
}

const specialtyIdToDisplay = Object.fromEntries(
  Object.entries(specialtyDisplayToId).map(([k, v]) => [v, k])
)

// Generate a URL-safe slug from a product name
const generateSlug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const [existingImageUrl, setExistingImageUrl] = useState('')
  const [existingPdfUrl, setExistingPdfUrl] = useState('')
  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    imageUrls: [],
    pdfUrl: '',
    isPublished: true,
  })
  const [saveLoading, setSaveLoading] = useState(false)

  // Fetch all products from Supabase on mount
  const fetchProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw new Error(fetchError.message)

      // Map DB columns to React-friendly shape for the table
      const mapped = (data || []).map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        brand: brandIdToDisplay[item.brand] || item.brand,
        category: specialtyIdToDisplay[item.specialty] || item.specialty,
        description: item.description,
        imageUrls: item.image_url ? [item.image_url] : [],
        pdfUrl: item.pdf_url || '',
        isPublished: item.is_published ?? true,
      }))

      setProducts(mapped)
    } catch (err) {
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'file'
            ? Array.from(e.target.files)
            : value,
    }))
  }

  // Upload a file to Supabase Storage and return the public URL
  const uploadFile = async (file, folder) => {
    const filePath = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const { error: uploadError } = await supabase.storage
      .from('product-media')
      .upload(filePath, file)
    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)
    const { data: { publicUrl } } = supabase.storage
      .from('product-media')
      .getPublicUrl(filePath)
    return publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveLoading(true)
    setError('')

    try {
      // Map form fields to DB column names
      const dbBrand = brandDisplayToId[form.brand] || form.brand.toLowerCase()
      const dbSpecialty = specialtyDisplayToId[form.category] || form.category.toLowerCase().replace(/\s+/g, '-')
      const slug = generateSlug(form.name)

      // Upload new image if a file was selected; otherwise keep existing
      let imageUrl = existingImageUrl || null
      if (imageFile) {
        imageUrl = await uploadFile(imageFile, 'images')
      }

      // Upload new PDF if a file was selected; otherwise keep existing
      let pdfUrl = existingPdfUrl || null
      if (pdfFile) {
        pdfUrl = await uploadFile(pdfFile, 'pdfs')
      }

      if (editId) {
        // UPDATE existing product
        const { error: updateError } = await supabase
          .from('products')
          .update({
            slug,
            name: form.name,
            specialty: dbSpecialty,
            brand: dbBrand,
            description: form.description,
            image_url: imageUrl,
            pdf_url: pdfUrl,
            is_published: form.isPublished,
          })
          .eq('id', editId)

        if (updateError) throw new Error(updateError.message)
      } else {
        // INSERT new product
        const { error: insertError } = await supabase
          .from('products')
          .insert([
            {
              slug,
              name: form.name,
              specialty: dbSpecialty,
              brand: dbBrand,
              description: form.description,
              image_url: imageUrl,
              pdf_url: pdfUrl,
              is_published: form.isPublished,
            },
          ])

        if (insertError) throw new Error(insertError.message)
      }

      // Reset form and re-fetch to sync UI with DB
      setForm({
        name: '',
        brand: '',
        category: '',
        description: '',
        imageUrls: [],
        pdfUrl: '',
        isPublished: true,
      })
      setImageFile(null)
      setPdfFile(null)
      setExistingImageUrl('')
      setExistingPdfUrl('')
      setEditId(null)
      setShowAddForm(false)
      await fetchProducts()
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSaveLoading(false)
    }
  }

  const togglePublish = async (id, currentPublished) => {
    setError('')
    try {
      const { error: updateError } = await supabase
        .from('products')
        .update({ is_published: !currentPublished })
        .eq('id', id)

      if (updateError) throw new Error(updateError.message)

      await fetchProducts()
    } catch (err) {
      setError(err.message || 'Failed to update publish status')
    }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to archive this product?')) return
    setError('')
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (deleteError) throw new Error(deleteError.message)

      await fetchProducts()
    } catch (err) {
      setError(err.message || 'Failed to delete product')
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Medelec Healthcare Solutions</title>
      </Helmet>

      <div className="min-h-screen bg-bg-platinum">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-primary-blue">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-text-muted">
                  Welcome back, {user?.email || 'Admin'}!
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Alerts */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                {error}
              </div>
            )}

            {/* Add Product Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-teal"
              >
                {editId ? 'Edit Product' : 'Add New Product'}
              </button>
            </div>

            {/* Product Form */}
            {showAddForm && (
              <div className="mb-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-primary-blue mb-4">
                  {editId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-primary-blue mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="input-field w-full"
                        placeholder="Product name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-blue mb-1">
                        Brand
                      </label>
                      <select
                        name="brand"
                        value={form.brand}
                        onChange={handleChange}
                        className="input-field w-full"
                      >
                        <option value="">Select brand</option>
                        <option value="Hamilton Medical">Hamilton Medical</option>
                        <option value="Samsung Healthcare">Samsung Healthcare</option>
                        <option value="Linet">Linet</option>
                        <option value="Spacelabs Healthcare">Spacelabs Healthcare</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-blue mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="input-field w-full"
                      >
                        <option value="">Select category</option>
                        <option value="Critical Care">Critical Care</option>
                        <option value="Radiology">Radiology</option>
                        <option value="Ward Infrastructure">Ward Infrastructure</option>
                        <option value="Patient Monitoring">Patient Monitoring</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-blue mb-1">
                        Published
                      </label>
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={form.isPublished}
                        onChange={handleChange}
                        className="form-checkbox h-4 w-4 text-surgical-teal"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-blue mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="4"
                      className="input-field w-full"
                      placeholder="Product description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-blue mb-1">
                      Product Image
                    </label>
                    {existingImageUrl && (
                      <div className="mb-2 flex items-center gap-2">
                        <img
                          src={existingImageUrl}
                          alt="Current"
                          className="w-12 h-12 object-cover rounded-sm border border-border-light"
                        />
                        <a
                          href={existingImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-surgical-teal hover:underline truncate"
                        >
                          {existingImageUrl}
                        </a>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        setImageFile(file || null)
                      }}
                      className="input-field w-full file:mr-3 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-surgical-teal/10 file:text-surgical-teal hover:file:bg-surgical-teal/20"
                    />
                    {imageFile && (
                      <p className="text-xs text-text-muted mt-1">
                        Selected: {imageFile.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-blue mb-1">
                      Product PDF Brochure
                    </label>
                    {existingPdfUrl && (
                      <div className="mb-2">
                        <a
                          href={existingPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-surgical-teal hover:underline flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Current PDF: {existingPdfUrl.split('/').pop()}
                        </a>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        setPdfFile(file || null)
                      }}
                      className="input-field w-full file:mr-3 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-surgical-teal/10 file:text-surgical-teal hover:file:bg-surgical-teal/20"
                    />
                    {pdfFile && (
                      <p className="text-xs text-text-muted mt-1">
                        Selected: {pdfFile.name}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false)
                        setEditId(null)
                        setImageFile(null)
                        setPdfFile(null)
                        setExistingImageUrl('')
                        setExistingPdfUrl('')
                        setForm({
                          name: '',
                          brand: '',
                          category: '',
                          description: '',
                          imageUrls: [],
                          pdfUrl: '',
                          isPublished: true,
                        })
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saveLoading}
                      className="btn-teal"
                    >
                      {saveLoading ? 'Uploading Media...' : 'Save Product'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-surgical-teal/30 border-t-surgical-teal rounded-full animate-spin" />
                    <p className="text-sm text-text-muted">Loading products...</p>
                  </div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8 text-text-muted">
                  No products found. Add your first product above!
                </div>
              ) : (
                <table className="min-w-full divide-y divide-border-light">
                  <thead className="bg-bg-platinum">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-blue uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-blue uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-blue uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-blue uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-blue uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-bg-platinum/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-blue">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                          {product.brand}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.isPublished
                                ? 'bg-surgical-teal/10 text-surgical-teal'
                                : 'bg-red-500/10 text-red-500'
                            }`}
                          >
                            {product.isPublished ? 'Published' : 'Archived'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => {
                              setEditId(product.id)
                              setImageFile(null)
                              setPdfFile(null)
                              setExistingImageUrl(
                                product.imageUrls && product.imageUrls.length > 0
                                  ? product.imageUrls[0]
                                  : ''
                              )
                              setExistingPdfUrl(product.pdfUrl || '')
                              setForm({
                                name: product.name,
                                brand: product.brand,
                                category: product.category,
                                description: product.description,
                                imageUrls: product.imageUrls || [],
                                pdfUrl: product.pdfUrl || '',
                                isPublished: product.isPublished,
                              })
                              setShowAddForm(true)
                            }}
                            className="text-surgical-teal hover:text-surgical-teal/80"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => togglePublish(product.id, product.isPublished)}
                            className="text-amber-600 hover:text-amber-700"
                          >
                            {product.isPublished ? 'Archive' : 'Publish'}
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}