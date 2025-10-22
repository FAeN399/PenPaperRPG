import { useEffect, useRef } from 'react'
import Button from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'primary'
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'primary',
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      dialogRef.current?.focus()
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        ref={dialogRef}
        className="bg-pf-bg-card border border-pf-border rounded-lg shadow-glow max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <h2
          id="confirm-dialog-title"
          className="text-xl font-bold text-pf-accent mb-3"
        >
          {title}
        </h2>
        <p className="text-pf-text mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} variant="secondary">
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            variant={variant === 'danger' ? 'secondary' : 'primary'}
            className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
