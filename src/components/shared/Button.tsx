import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  fullWidth?: boolean
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className = '',
  fullWidth = false,
}: ButtonProps) {
  const baseClasses =
    'font-medium rounded transition-all focus:outline-none focus:ring-2 focus:ring-pf-accent'

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'bg-red-700 hover:bg-red-600 text-white',
    ghost: 'bg-transparent hover:bg-gray-700 text-pf-text border border-gray-600',
  }

  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg',
  }

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer'

  const widthClasses = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClasses} ${className}`}
    >
      {children}
    </button>
  )
}
