import { useEffect } from 'react'

function StarRating({ rate, count }) {
  const stars = Math.round(rate)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{
            color: i <= stars ? '#c8541a' : '#d4cdc6',
            fontSize: '18px'
          }}>★</span>
        ))}
      </div>
      <span style={{ fontSize: '13px', color: '#6b6560' }}>
        {rate.toFixed(1)} ({count} ulasan)
      </span>
    </div>
  )
}

export default function ProductModal({ product, onClose, onAddToCart }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!product) return null

  const categoryLabel = product.category.replace(/'/g, '').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15, 12, 8, 0.6)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '760px',
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '36px', height: '36px',
            borderRadius: '50%',
            border: '1px solid #e8e3dc',
            background: '#f7f5f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', color: '#6b6560',
            cursor: 'pointer', zIndex: 10,
          }}
          aria-label="Tutup modal"
        >×</button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0',
        }}>
          {/* Image section */}
          <div style={{
            padding: '40px',
            background: '#f7f5f0',
            borderRadius: '24px 0 0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '360px',
          }}>
            <img
              src={product.image}
              alt={product.title}
              style={{
                maxHeight: '280px',
                maxWidth: '100%',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Info section */}
          <div style={{ padding: '40px' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              background: '#f5e6dc',
              color: '#9b3f12',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '14px',
            }}>
              {categoryLabel}
            </span>

            <h2 style={{
              fontFamily: 'var(--font-display, Syne)',
              fontSize: '20px',
              fontWeight: '600',
              lineHeight: '1.4',
              color: '#1a1714',
              marginBottom: '16px',
            }}>
              {product.title}
            </h2>

            <StarRating rate={product.rating.rate} count={product.rating.count} />

            <div style={{
              fontSize: '32px',
              fontFamily: 'var(--font-display, Syne)',
              fontWeight: '700',
              color: '#c8541a',
              margin: '20px 0',
            }}>
              {(product.price * 10000).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
            </div>

            <p style={{
              fontSize: '14px',
              color: '#6b6560',
              lineHeight: '1.7',
              marginBottom: '28px',
            }}>
              {product.description}
            </p>

            <button
              onClick={() => {
                onAddToCart(product)
                onClose()
              }}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: '#c8541a',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: '200ms',
              }}
              onMouseEnter={e => e.target.style.background = '#9b3f12'}
              onMouseLeave={e => e.target.style.background = '#c8541a'}
            >
              + Tambah ke Keranjang
            </button>
          </div>
        </div>

        {/* Mobile layout: stack vertically on small screens via media query workaround */}
        <style>{`
          @media (max-width: 560px) {
            .modal-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </div>
  )
}
