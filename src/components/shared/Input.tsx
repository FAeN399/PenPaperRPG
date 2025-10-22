import { ChangeEvent } from 'react'

interface InputProps {
  value: string | number
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  type?: 'text' | 'number' | 'email' | 'password'
  disabled?: boolean
  required?: boolean
  min?: number
  max?: number
  className?: string
  error?: string
}

export default function Input({
  value,
  onChange,
  label,
  placeholder,
  type = 'text',
  disabled = false,
  required = false,
  min,
  max,
  className = '',
  error,
}: InputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-pf-text">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        className={`input-field ${error ? 'border-red-500' : ''} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  )
}
