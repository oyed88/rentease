// Reusable Button component
// Usage: <Button variant="primary" loading={isLoading}>Save</Button>

export default function Button({
  children,
  variant = 'primary',   // 'primary' | 'secondary' | 'ghost'
  type = 'button',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  fullWidth = false,
}) {
  const base = 'font-body font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2'

  const variants = {
    primary:   'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus:ring-primary-400 px-6 py-3',
    secondary: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-400 px-6 py-3',
    ghost:     'text-gray-600 hover:bg-gray-100 focus:ring-gray-300 px-4 py-2',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${base} ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
