import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
  hoverable?: boolean
}

export default function Card({
  children,
  className = '',
  onClick,
  selected = false,
  hoverable = false,
}: CardProps) {
  const baseClasses = 'card'
  const interactiveClasses = onClick || hoverable ? 'cursor-pointer transition-all' : ''
  const hoverClasses = hoverable ? 'hover:border-pf-accent hover:shadow-lg' : ''
  const selectedClasses = selected ? 'border-pf-accent border-2 shadow-lg' : ''

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${hoverClasses} ${selectedClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  )
}
