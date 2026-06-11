export default function ProductCard({ product, onSelect, onAddToCart }) {
  const stars = Math.round(product.rating.rate)

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #e8e3dc',
        cursor: 'pointer',
        transition: '200ms cubic-bezier(0.4,0,0.2,1)',
        animation: 'fadeIn 0.4s ease both',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.12)'
        e.currentTarget.style.borderColor = '#c8541a'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
        e.currentTarget.style.borderColor = '#e8e3dc'
      }}
      onClick={() => onSelect(product)}
    >
      {/* Image */}
      <div style={{
        padding: '28px',
        background: '#f7f5f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px',
      }}>
        <img
          src={product.image}
          alt={product.title}
          style={{
            maxHeight: '140px',
            maxWidth: '100%',
            objectFit: 'contain',
          }}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 1,
      }}>
        <p style={{
          fontSize: '11px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#c8541a',
        }}>
          {product.category}
        </p>

        <h3 style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#1a1714',
          lineHeight: '1.45',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {product.title}
        </h3>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {[1,2,3,4,5].map(i => (
            <span key={i} style={{
              color: i <= stars ? '#c8541a' : '#d4cdc6',
              fontSize: '13px',
            }}>★</span>
          ))}
          <span style={{ fontSize: '12px', color: '#a09b96', marginLeft: '2px' }}>
            ({product.rating.count})
          </span>
        </div>

        {/* Price + Cart */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '4px',
          paddingTop: '12px',
          borderTop: '1px solid #f0ece6',
        }}>
          <span style={{
            fontSize: '18px',
            fontFamily: 'Syne, sans-serif',
            fontWeight: '700',
            color: '#1a1714',
          }}>
            {(product.price * 10000).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
          </span>

          <button
            onClick={e => {
              e.stopPropagation()
              onAddToCart(product)
            }}
            style={{
              padding: '8px 14px',
              background: '#c8541a',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: '200ms',
            }}
            onMouseEnter={e => e.target.style.background = '#9b3f12'}
            onMouseLeave={e => e.target.style.background = '#c8541a'}
          >
            + Keranjang
          </button>
        </div>
      </div>
    </div>
  )
}
