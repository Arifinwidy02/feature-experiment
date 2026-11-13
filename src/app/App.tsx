import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { CartProvider } from '@/features/cart/context/CartContext'

const HomePage = lazy(() => import('@/features/home/pages/HomePage'))
const ProductListingPage = lazy(() => import('@/features/products/pages/ProductListingPage'))
const CartPage = lazy(() => import('@/features/cart/pages/CartPage'))
const CheckoutPage = lazy(() => import('@/features/checkout/pages/CheckoutPage'))
const NotFoundPage = lazy(() => import('./NotFoundPage'))

const router = createBrowserRouter([
  {
    element: (
      <CartProvider>
        <MainLayout />
      </CartProvider>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductListingPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
