import { useEffect } from 'react'

// Usage: <Toast message="Saved!" type="success" onClose={() => setToast(null)} />
export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const styles = {
    success: 'bg-primary-500 text-white',
    error:   'bg-red-500 text-white',
    info:    'bg-blue-500 text-white',
    warning: 'bg-earth-500 text-white',
  }

  const icons = {
    success: '✓',
    error:   '✕',
    info:    'ℹ',
    warning: '⚠',
  }

  return (
    <div className={`
      fixed bottom-6 right-6 z-50
      flex items-center gap-3
      px-5 py-3 rounded-xl shadow-lg
      font-body text-sm font-medium
      animate-fade-in
      ${styles[type]}
    `}>
      <span className="text-base">{icons[type]}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-base leading-none">
        ×
      </button>
    </div>
  )
}
