'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Scale } from 'lucide-react'
import { cn } from '@/utils'
import { FIRM } from '@/lib/data'

const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export default function PublicNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const dark = isHome && !scrolled

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled || !isHome
        ? 'bg-white/95 backdrop-blur border-b shadow-sm'
        : 'bg-transparent'
    )} style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center gradient-brand shadow-md group-hover:shadow-lg transition-shadow">
            <Scale size={15} className="text-white" />
          </div>
          <span className={cn('font-bold text-lg tracking-tight transition-colors', dark ? 'text-white' : 'text-gray-900')}>
            {FIRM.name}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === link.href
                  ? dark ? 'text-white bg-white/10' : 'text-blue-600 bg-blue-50'
                  : dark ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              )}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login"
            className={cn('text-sm font-medium px-4 py-2 rounded-lg transition-colors',
              dark ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-gray-900')}>
            Sign in
          </Link>
          <Link href="/contact"
            className="btn-primary text-sm">
            Book Consultation
          </Link>
        </div>

        <button className="md:hidden p-2 rounded-lg" onClick={() => setOpen(!open)}
          aria-label="Toggle menu">
          {open
            ? <X size={20} className={dark ? 'text-white' : ''} />
            : <Menu size={20} className={dark ? 'text-white' : ''} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t px-6 py-4 flex flex-col gap-1" style={{ borderColor: 'var(--border)' }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}
              className="sidebar-link" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="border-t pt-3 mt-2 flex flex-col gap-2" style={{ borderColor: 'var(--border)' }}>
            <Link href="/auth/login" className="btn-secondary text-center text-sm">Sign in</Link>
            <Link href="/contact" className="btn-primary text-center text-sm">Book Consultation</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
