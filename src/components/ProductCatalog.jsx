import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import CartSidebar from './CartSidebar'
import { ToastContainer, useToast } from './Toast'

const ITEMS_PER_PAGE = 8

export default function ProductCatalog() {
  // Data states
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // UI states
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [minRating, setMinRating] = useState(0)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [maxPrice, setMaxPrice] = useState(1000)
  const [currentPage, setCurrentPage] = useState(1)

  // Modal & Cart
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  // Toast
  const { toasts, addToast, removeToast } = useToast()

  // Fetch all products + categories concurrently
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        setError(null)

        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('https://fakestoreapi.com/products'),
          axios.get('https://fakestoreapi.com/products/categories'),
        ])

        setProducts(productsRes.data)
        setCategories(categoriesRes.data)

        // Set dynamic max price
        const highest = Math.ceil(Math.max(...productsRes.data.map(p => p.price)))
        setMaxPrice(highest)
        setPriceRange([0, highest])
      } catch (err) {
        setError(err.message || 'Gagal mengambil data produk. Periksa koneksi internet Anda.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // Filter + sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory)
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter(p => p.title.toLowerCase().includes(term))
    }

    // Rating filter
    if (minRating > 0) {
      result = result.filter(p => p.rating.rate >= minRating)
    }

    // Price range filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Sort
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price)
    else if (sortBy === 'rating-desc') result.sort((a, b) => b.rating.rate - a.rating.rate)
    else if (sortBy === 'name-asc') result.sort((a, b) => a.title.localeCompare(b.title))

    return result
  }, [products, activeCategory, searchTerm, minRating, priceRange, sortBy])

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1) }, [activeCategory, searchTerm, sortBy, minRating, priceRange])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Cart logic
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        addToast(`${product.title.substring(0, 30)}... +1`, 'success')
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      addToast(`Ditambahkan ke keranjang!`, 'success')
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id)
      return
    }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  const totalCartItems = cart.reduce((sum, i) => sum + i.qty, 0)

  // Error state
  if (error) {
    return (
      <div style={css.errorPage}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h2 style={css.errorTitle}>Gagal Memuat Data</h2>
        <p style={css.errorText}>{error}</p>
        <button onClick={() => window.location.reload()} style={css.retryBtn}>
          Coba Lagi
        </button>
      </div>
    )
  }

  return (
    <div style={css.root}>
      {/* Header */}
      <header style={css.header}>
        <div style={css.headerInner}>
          <div>
            <h1 style={css.logo}>ShopCat</h1>
            <p style={css.tagline}>Product Catalog — Fake Store API</p>
          </div>
          <button onClick={() => setCartOpen(true)} style={css.cartBtn}>
            🛒
            {totalCartItems > 0 && (
              <span style={css.cartBadge}>{totalCartItems}</span>
            )}
          </button>
        </div>
      </header>

      <main style={css.main}>
        {/* Filters sidebar */}
        <aside style={css.sidebar}>
          {/* Search */}
          <div style={css.filterSection}>
            <label style={css.filterLabel}>Cari Produk</label>
            <input
              type="text"
              placeholder="Nama produk..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={css.input}
            />
          </div>

          {/* Category */}
          <div style={css.filterSection}>
            <label style={css.filterLabel}>Kategori</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {['all', ...categories].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    ...css.catBtn,
                    ...(activeCategory === cat ? css.catBtnActive : {}),
                  }}
                >
                  {cat === 'all' ? 'Semua Kategori' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div style={css.filterSection}>
            <label style={css.filterLabel}>Urutkan</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={css.select}>
              <option value="default">Default</option>
              <option value="price-asc">Harga: Termurah</option>
              <option value="price-desc">Harga: Termahal</option>
              <option value="rating-desc">Rating Tertinggi</option>
              <option value="name-asc">Nama A–Z</option>
            </select>
          </div>

          {/* Price Range */}
          <div style={css.filterSection}>
            <label style={css.filterLabel}>
               Harga Maksimal: <strong>{(priceRange[1] * 10000).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</strong>
            </label>
            <input
              type="range"
              min="0"
              max={maxPrice}
              step="1"
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              style={{ width: '100%', accentColor: '#c8541a' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#a09b96', marginTop: '4px' }}>
              <span>Rp 0</span>
              <span>{(maxPrice * 10000).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div style={css.filterSection}>
            <label style={css.filterLabel}>Rating Minimum</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[0, 1, 2, 3, 4].map(r => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: minRating === r ? '#c8541a' : '#e8e3dc',
                    background: minRating === r ? '#c8541a' : '#fff',
                    color: minRating === r ? '#fff' : '#6b6560',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  {r === 0 ? 'Semua' : `${r}★+`}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setSearchTerm('')
              setActiveCategory('all')
              setSortBy('default')
              setMinRating(0)
              setPriceRange([0, maxPrice])
            }}
            style={css.resetBtn}
          >
            Reset Filter
          </button>
        </aside>

        {/* Products area */}
        <section style={{ flex: 1, minWidth: 0 }}>
          {/* Stats bar */}
          <div style={css.statsBar}>
            <p style={{ color: '#6b6560', fontSize: '14px' }}>
              {loading ? 'Memuat...' : `${filteredProducts.length} produk ditemukan`}
            </p>
          </div>

          {/* Loading grid */}
          {loading ? (
            <div style={css.grid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{
                  ...css.skeleton,
                  animationDelay: `${i * 0.07}s`,
                }} />
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div style={css.empty}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', marginBottom: '8px' }}>
                Tidak ada produk
              </h3>
              <p style={{ color: '#a09b96', fontSize: '14px' }}>
                Coba ubah filter atau kata kunci pencarian.
              </p>
            </div>
          ) : (
            <>
              <div style={css.grid}>
                {paginatedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={setSelectedProduct}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={css.pagination}>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{ ...css.pageBtn, ...(currentPage === 1 ? css.pageBtnDisabled : {}) }}
                  >
                    ← Prev
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      style={{
                        ...css.pageBtn,
                        ...(currentPage === i + 1 ? css.pageBtnActive : {}),
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{ ...css.pageBtn, ...(currentPage === totalPages ? css.pageBtnDisabled : {}) }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p) => {
            addToCart(p)
            setSelectedProduct(null)
          }}
        />
      )}

      {/* Cart Sidebar */}
      {cartOpen && (
        <CartSidebar
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onUpdateQty={updateQty}
        />
      )}

      {/* Toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

const css = {
  root: {
    minHeight: '100vh',
    background: '#f7f5f0',
  },
  header: {
    background: '#1a1714',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
  },
  headerInner: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '24px',
    fontWeight: '700',
    color: '#f7f5f0',
    letterSpacing: '-0.02em',
  },
  tagline: {
    fontSize: '12px',
    color: '#6b6560',
    marginTop: '2px',
  },
  cartBtn: {
    position: 'relative',
    background: '#2c2825',
    border: '1px solid #3a3530',
    borderRadius: '12px',
    padding: '10px 16px',
    fontSize: '20px',
    cursor: 'pointer',
    transition: '200ms',
  },
  cartBadge: {
    position: 'absolute',
    top: '-6px', right: '-6px',
    background: '#c8541a',
    color: '#fff',
    borderRadius: '50%',
    width: '20px', height: '20px',
    fontSize: '11px',
    fontWeight: '700',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '32px 24px',
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
  },
  sidebar: {
    width: '240px',
    flexShrink: 0,
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #e8e3dc',
    padding: '20px',
    position: 'sticky',
    top: '80px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  filterSection: {
    paddingBottom: '20px',
    marginBottom: '20px',
    borderBottom: '1px solid #f0ece6',
  },
  filterLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#a09b96',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #e8e3dc',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1a1714',
    background: '#f7f5f0',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #e8e3dc',
    borderRadius: '8px',
    fontSize: '14px',
    background: '#f7f5f0',
    color: '#1a1714',
    cursor: 'pointer',
  },
  catBtn: {
    padding: '8px 12px',
    border: '1px solid #e8e3dc',
    borderRadius: '8px',
    background: '#f7f5f0',
    color: '#6b6560',
    fontSize: '13px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: '150ms',
    textTransform: 'capitalize',
  },
  catBtnActive: {
    background: '#c8541a',
    borderColor: '#c8541a',
    color: '#fff',
  },
  resetBtn: {
    width: '100%',
    padding: '10px',
    background: 'transparent',
    border: '1px solid #e8e3dc',
    borderRadius: '8px',
    color: '#6b6560',
    fontSize: '13px',
    cursor: 'pointer',
    marginTop: '4px',
  },
  statsBar: {
    marginBottom: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },
  skeleton: {
    height: '320px',
    borderRadius: '16px',
    background: 'linear-gradient(90deg, #ede9e2 25%, #e2ddd6 50%, #ede9e2 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite, fadeIn 0.3s ease',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#1a1714',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '36px',
    flexWrap: 'wrap',
  },
  pageBtn: {
    padding: '8px 14px',
    border: '1px solid #e8e3dc',
    borderRadius: '8px',
    background: '#fff',
    color: '#1a1714',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: '150ms',
  },
  pageBtnActive: {
    background: '#c8541a',
    borderColor: '#c8541a',
    color: '#fff',
  },
  pageBtnDisabled: {
    opacity: 0.35,
    cursor: 'not-allowed',
  },
  errorPage: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    fontFamily: 'DM Sans, sans-serif',
  },
  errorTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '10px',
    color: '#1a1714',
  },
  errorText: {
    color: '#6b6560',
    fontSize: '14px',
    marginBottom: '24px',
    textAlign: 'center',
    maxWidth: '400px',
  },
  retryBtn: {
    padding: '12px 28px',
    background: '#c8541a',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
}
