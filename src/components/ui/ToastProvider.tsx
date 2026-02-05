'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { Toast, type ToastType } from './Toast'

interface ToastItem {
  id: string
  type: ToastType
  message: string
  duration?: number
  retryLabel?: string
  onRetry?: () => void
  dismissLabel?: string
}

interface ToastContextValue {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

interface ToastProviderProps {
  children: ReactNode
  defaultRetryLabel?: string
  defaultDismissLabel?: string
}

export function ToastProvider({
  children,
  defaultRetryLabel = 'Thử lại',
  defaultDismissLabel = 'Đóng thông báo',
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast container - fixed top-right, stacked vertically */}
      <div
        role="region"
        className="fixed top-4 right-4 z-50 flex flex-col gap-3"
        aria-label="Notifications"
      >
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            retryLabel={toast.retryLabel || defaultRetryLabel}
            dismissLabel={toast.dismissLabel || defaultDismissLabel}
            onDismiss={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

/**
 * Convenience hook with typed helper functions for common toast types
 */
export function useToastHelpers() {
  const { addToast } = useToast()

  return {
    /**
     * Show a success toast (auto-dismisses after 5 seconds)
     */
    showSuccess: (message: string, options?: { duration?: number }) => {
      addToast({
        type: 'success',
        message,
        duration: options?.duration ?? 5000,
      })
    },

    /**
     * Show an error toast (does NOT auto-dismiss, can have retry button)
     */
    showError: (message: string, options?: { onRetry?: () => void; retryLabel?: string }) => {
      addToast({
        type: 'error',
        message,
        duration: 0, // Error toasts don't auto-dismiss
        onRetry: options?.onRetry,
        retryLabel: options?.retryLabel,
      })
    },

    /**
     * Show an info toast (auto-dismisses after 5 seconds)
     */
    showInfo: (message: string, options?: { duration?: number }) => {
      addToast({
        type: 'info',
        message,
        duration: options?.duration ?? 5000,
      })
    },

    /**
     * Show a warning toast (auto-dismisses after 5 seconds)
     */
    showWarning: (message: string, options?: { duration?: number }) => {
      addToast({
        type: 'warning',
        message,
        duration: options?.duration ?? 5000,
      })
    },
  }
}
