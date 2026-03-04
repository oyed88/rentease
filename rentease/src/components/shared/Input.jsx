// Reusable Input component
// Usage: <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} error="Required" />

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  name,
  id,
}) {
  const inputId = id || name || label?.toLowerCase().replace(/\s/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="font-body text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          input-field
          ${error ? 'border-red-400 focus:ring-red-400' : ''}
          ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}
        `}
      />

      {error && (
        <p className="font-body text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
