import { Check, ShoppingCart } from 'lucide-react'
import { memo, useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ProductImage } from '@/components/ui/ProductImage'
import { formatCurrency } from '@/lib/format'
import type { Product } from '../types/product'

interface ProductCardProps {
  product: Product
  /** Single entry point for "add" so tracking can later wrap it in one place. */
  onAddToCart: (product: Product) => void
}

function ProductCardComponent({ product, onAddToCart }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    if (!justAdded) return
    const timer = window.setTimeout(() => setJustAdded(false), 1500)
    return () => window.clearTimeout(timer)
  }, [justAdded])

  const handleAdd = () => {
    onAddToCart(product)
    setJustAdded(true)
  }

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <ProductImage src={product.image} alt={product.imageAlt} className="aspect-[4/3] w-full" />
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-blue-700">{product.category}</p>
        <h3 className="mt-1 text-base font-semibold text-ink">{product.name}</h3>
        <p className="mt-1.5 flex-1 text-sm text-slate-600">{product.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-lg font-semibold text-ink">{formatCurrency(product.price)}</p>
          <Button
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className="shrink-0"
          >
            {justAdded ? (
              <>
                <Check aria-hidden className="size-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart aria-hidden className="size-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
        <p role="status" className="sr-only">
          {justAdded ? `${product.name} added to cart` : ''}
        </p>
      </div>
    </article>
  )
}

export const ProductCard = memo(ProductCardComponent)
