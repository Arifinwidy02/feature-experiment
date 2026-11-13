import type { Product, ProductCategory } from '../types/product'

const img = (photoId: string) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=800&q=75`

export const PRODUCT_CATEGORIES: readonly ProductCategory[] = [
  'Audio',
  'Computing',
  'Footwear',
  'Wearables',
  'Accessories',
]

export const products: readonly Product[] = [
  {
    id: 'studio-headphones',
    name: 'Studio Over-Ear Headphones',
    description: 'Closed-back wireless headphones with soft ear cushions for long listening sessions.',
    price: 14900,
    category: 'Audio',
    image: img('1505740420928-5e560c06d30e'),
    imageAlt: 'Black over-ear headphones on a yellow background',
  },
  {
    id: 'slate-14-laptop',
    name: 'Slate 14 Laptop',
    description: 'Thin 14-inch aluminium laptop built for writing, browsing, and everyday development.',
    price: 129900,
    category: 'Computing',
    image: img('1496181133206-80ce9b88a853'),
    imageAlt: 'Silver laptop on a wooden desk',
  },
  {
    id: 'trail-runner',
    name: 'Flyknit Trail Runner',
    description: 'Breathable knit upper with a cushioned sole for road and light trail runs.',
    price: 12900,
    category: 'Footwear',
    image: img('1542291026-7eec264c27ff'),
    imageAlt: 'Red knit running shoe on a red background',
  },
  {
    id: 'halo-watch',
    name: 'Halo Smartwatch',
    description: 'Minimal round-face smartwatch with a soft silicone strap and all-day wear comfort.',
    price: 19900,
    category: 'Wearables',
    image: img('1523275335684-37898b6baf30'),
    imageAlt: 'White smartwatch with a round black display',
  },
  {
    id: 'wayfarer-sunglasses',
    name: 'Polarized Wayfarer Sunglasses',
    description: 'Classic acetate frame with polarized lenses that cut glare on bright days.',
    price: 8900,
    category: 'Accessories',
    image: img('1572635196237-14b3f281503f'),
    imageAlt: 'Black wayfarer sunglasses on a white surface',
  },
  {
    id: 'canvas-tablet',
    name: 'Canvas Pro Tablet',
    description: 'Large high-resolution tablet with stylus support for sketching and note-taking.',
    price: 79900,
    category: 'Computing',
    image: img('1544244015-0df4b3ffc6b0'),
    imageAlt: 'Tablet and stylus resting on a grey surface',
  },
  {
    id: 'reference-wired',
    name: 'Reference Wired Headphones',
    description: 'Padded wired headphones with a detachable cable, made for desk and studio use.',
    price: 9900,
    category: 'Audio',
    image: img('1583394838336-acd977736f90'),
    imageAlt: 'Grey wired over-ear headphones on a white background',
  },
  {
    id: 'night-run-sneaker',
    name: 'Night Run Sneaker',
    description: 'Low-profile black sneaker with a lightweight foam midsole for daily wear.',
    price: 11900,
    category: 'Footwear',
    image: img('1491553895911-0055eca6402d'),
    imageAlt: 'Black running sneaker floating against a white background',
  },
  {
    id: 'glide-mouse',
    name: 'Glide Wireless Mouse',
    description: 'Compact wireless mouse with a scroll wheel and a comfortable ambidextrous shape.',
    price: 3900,
    category: 'Computing',
    image: img('1527864550417-7fd91fc51a46'),
    imageAlt: 'Grey and black wireless computer mouse',
  },
  {
    id: 'steel-bottle',
    name: 'Insulated Steel Bottle',
    description: 'Matte-finish double-wall bottle that keeps drinks cold or hot for hours.',
    price: 2900,
    category: 'Accessories',
    image: img('1602143407151-7111542de6e8'),
    imageAlt: 'Green matte insulated bottle',
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}
