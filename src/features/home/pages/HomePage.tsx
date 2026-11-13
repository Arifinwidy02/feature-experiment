import { Link } from 'react-router-dom'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { ProductImage } from '@/components/ui/ProductImage'
import { formatCurrency } from '@/lib/format'
import { FREE_SHIPPING_THRESHOLD } from '@/features/cart/lib/totals'
import { products } from '@/features/products/data/products'

const FEATURED_IDS = ['studio-headphones', 'trail-runner', 'halo-watch'] as const

const featured = FEATURED_IDS.flatMap((id) => products.filter((product) => product.id === id))

export default function HomePage() {
  return (
    <div className="space-y-16 lg:space-y-24">
      <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Everyday tech and gear, priced plainly.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-slate-600">
            Headphones, laptops, shoes, and accessories in one small catalog. Free shipping on
            orders over {formatCurrency(FREE_SHIPPING_THRESHOLD)}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/products" size="lg">
              Shop all products
            </ButtonLink>
            <ButtonLink to="/cart" variant="secondary" size="lg">
              View cart
            </ButtonLink>
          </div>
        </div>

        <ul className="grid grid-cols-3 gap-3 sm:gap-4" aria-label="Featured products">
          {featured.map((product, index) => (
            <li key={product.id} className={index === 1 ? 'mt-8' : undefined}>
              <Link
                to="/products"
                className="block overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-slate-300"
                aria-label={`${product.name}, ${formatCurrency(product.price)}. Browse products`}
              >
                <ProductImage src={product.image} alt="" priority className="aspect-[3/4] w-full" />
                <span className="block px-3 py-2.5">
                  <span className="block truncate text-sm font-medium text-ink">{product.name}</span>
                  <span className="block text-sm text-slate-600">{formatCurrency(product.price)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
