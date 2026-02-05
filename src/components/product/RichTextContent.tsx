'use client'

import { Component, type ReactNode } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface RichTextContentProps {
  data: any
  className?: string
}

interface ErrorBoundaryState {
  hasError: boolean
}

class RichTextErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <p className="text-gray-500 italic">Không thể hiển thị nội dung</p>
      )
    }

    return this.props.children
  }
}

export function RichTextContent({ data, className }: RichTextContentProps) {
  if (!data) return null

  return (
    <div className={className}>
      <RichTextErrorBoundary>
        <RichText data={data} />
      </RichTextErrorBoundary>
    </div>
  )
}
