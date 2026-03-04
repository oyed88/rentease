import { useState } from 'react'

// Reusable toast hook
// Usage: const { toast, showToast, clearToast } = useToast()
// Then: showToast('Saved!', 'success')
// In JSX: {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

export function useToast() {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const clearToast = () => setToast(null)

  return { toast, showToast, clearToast }
}
