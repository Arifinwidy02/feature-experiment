import { ImageOff } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/cn'

interface ProductImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

/** Renders a product photo and falls back to a neutral placeholder if it fails to load. */
export function ProductImage({ src, alt, className, priority = false }: ProductImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn('flex items-center justify-center bg-slate-100 text-slate-500', className)}
      >
        <ImageOff aria-hidden className="size-6" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
      className={cn('bg-slate-100 object-cover', className)}
    />
  )
}
