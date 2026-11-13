import { Menu, ShoppingCart, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCartState } from '@/features/cart/hooks/useCart'
import { cn } from '@/lib/cn'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products', end: false },
] as const

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return cn(
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100',
  )
}

export function Header() {
  const { itemCount } = useCartState()
  const { pathname } = useLocation()
  // Remember which route the menu was opened on, so navigating closes it without an effect.
  const [openedOnPath, setOpenedOnPath] = useState<string | null>(null)
  const menuOpen = openedOnPath === pathname
  const setMenuOpen = (open: boolean) => setOpenedOnPath(open ? pathname : null)

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenedOnPath(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 rounded-lg" aria-label="Experiment Lab home">
            <span
              aria-hidden
              className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white"
            >
              E
            </span>
            <span className="text-lg font-semibold tracking-tight text-ink">Experiment Lab</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <Link
            to="/cart"
            className="relative flex size-11 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100"
            aria-label={`Shopping cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
          >
            <ShoppingCart aria-hidden className="size-5" />
            {itemCount > 0 && (
              <span
                aria-hidden
                className="absolute right-0.5 top-0.5 flex min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-semibold leading-5 text-white"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-slate-200 bg-white px-4 py-3 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={(state) => cn(navLinkClass(state), 'flex min-h-11 items-center')}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
