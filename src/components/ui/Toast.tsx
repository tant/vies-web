'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  CheckCircleIcon,
  XCircleIcon,
  XIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from '@/components/layout/icons'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastProps {
  id: string
  type: ToastType
  message: string
  duration?: number
  retryLabel?: string
  onRetry?: () => void
  onDismiss: (id: string) => void
  dismissLabel?: string
}

const iconMap = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon,
}

const bgColorMap = {
  success: 'bg-success',
  error: 'bg-error',
  info: 'bg-primary',
  warning: 'bg-accent',
}

const textColorMap = {
  success: 'text-white',
  error: 'text-white',
  info: 'text-white',
  warning: 'text-text',
}

export function Toast({
  id,
  type,
  message,
  duration,
  retryLabel = 'Thử lại',
  onRetry,
  onDismiss,
  dismissLabel = 'Đóng thông báo',
}: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)

  const handleDismiss = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      onDismiss(id)
    }, 200) // Match exit animation duration
  }, [id, onDismiss])

  // Auto-dismiss for success/info/warning (not error)
  useEffect(() => {
    if (type === 'error' || duration === 0) return

    const timeout = setTimeout(() => {
      handleDismiss()
    }, duration || 5000)

    return () => clearTimeout(timeout)
  }, [type, duration, handleDismiss])

  const Icon = iconMap[type]
  const bgColor = bgColorMap[type]
  const textColor = textColorMap[type]
  const role = type === 'error' ? 'alert' : 'status'
  const ariaLive = type === 'error' ? 'assertive' : 'polite'

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={`
        flex items-start gap-3 p-4 rounded-lg shadow-lg max-w-sm
        ${bgColor} ${textColor}
        ${isExiting ? 'animate-fade-out-right' : 'animate-fade-in-right'}
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{message}</p>
        {type === 'error' && onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
          >
            {retryLabel}
          </button>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 rounded hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label={dismissLabel}
      >
        <XIcon className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  )
}
