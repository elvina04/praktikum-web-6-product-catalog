import { useEffect } from 'react'

export default function CartSidebar({ cart, onClose, onRemove, onUpdateQty }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(15,12,8,0.5)',
          zIndex: 900,
          backdropFilter: 'blur(3px)',
        }}
      />
      <div style={{
        position: 'fixed',
        top: 0, right: 0, bottom: 0,
        width: '380px',
        maxWidth: '95vw',
        background: '#fff',
        zIndex: 901,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUp 0.3s ease',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e8e3dc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '20px',
              fontWeight: '700',
              color: '#1a1714',
            }}>
              Keranjang Belanja
            </h2>
            <p style={{ fontSize: '13px', color: '#a09b96', marginTop: '2px' }}>
              {totalItems} item
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px', height: '36px',
              borderRadius: '50%',
              border: '1px solid #e8e3dc',
              background: '#f7f5f0',
              fontSize: '18px', color: '#6b6560',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#a09b96' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
              <p>Keranjang kosong</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '12px',
                  background: '#f7f5f0',
                  borderRadius: '12px',
                }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '56px', height: '56px', objectFit: 'contain', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#1a1714',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#c8541a', marginTop: '4px' }}>
                      {(item.price * item.qty * 10000).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
                    </p>

                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty - 1)}
                        style={{
                          width: '26px', height: '26px',
                          borderRadius: '6px',
                          border: '1px solid #e8e3dc',
                          background: '#fff',
                          fontSize: '16px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >−</button>
                      <span style={{ fontSize: '14px', fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>
                        {item.qty}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                        style={{
                          width: '26px', height: '26px',
                          borderRadius: '6px',
                          border: '1px solid #e8e3dc',
                          background: '#fff',
                          fontSize: '16px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >+</button>
                      <button
                        onClick={() => onRemove(item.id)}
                        style={{
                          marginLeft: 'auto',
                          background: 'none',
                          border: 'none',
                          color: '#a09b96',
                          cursor: 'pointer',
                          fontSize: '13px',
                          padding: '2px',
                        }}
                      >Hapus</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid #e8e3dc',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <span style={{ fontWeight: '600', fontSize: '16px' }}>Total</span>
              <span style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: '700',
                fontSize: '20px',
                color: '#c8541a',
              }}>
                {(total * 10000).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
              </span>
            </div>
            <button style={{
              width: '100%',
              padding: '14px',
              background: '#1a1714',
              color: '#f7f5f0',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
              Checkout (Simulasi)
            </button>
          </div>
        )}
      </div>
    </>
  )
}
