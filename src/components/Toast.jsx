import { useEffect, useState } from 'react'

const styles = {
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    pointerEvents: 'none',
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 18px',
    background: '#1a1714',
    color: '#f7f5f0',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
    animation: 'toastIn 0.3s ease',
    minWidth: '220px',
    maxWidth: '320px',
    pointerEvents: 'auto',
  },
  icon: {
    fontSize: '18px',
    flexShrink: 0,
  }
}

function Toast({ message, type = 'success', onRemove }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(onRemove, 300)
    }, 2500)
    return () => clearTimeout(timer)
  }, [onRemove])

  return (
    <div style={{
      ...styles.toast,
      animation: exiting ? 'toastOut 0.3s ease forwards' : 'toastIn 0.3s ease',
      background: type === 'success' ? '#1a1714' : type === 'error' ? '#9b3f12' : '#1a1714'
    }}>
      <span style={styles.icon}>
        {type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
      </span>
      {message}
    </div>
  )
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div style={styles.container}>
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return { toasts, addToast, removeToast }
}
