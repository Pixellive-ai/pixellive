import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'fixed top-4 right-4 z-50 w-auto max-w-[calc(100%-2rem)] rounded-2xl transition-all duration-300',
          scrolled
            ? 'glass-panel shadow-lg shadow-black/20'
            : 'bg-transparent border border-transparent'
        )}
      >
        <nav className="flex items-center gap-4 px-6 py-3">
          {/* Mobile-only logo (left) */}
          <Link to="/" className="md:hidden flex items-center" aria-label="Pixellive home">
            <img
              src={theme === 'dark' ? '/pixellive-mark-white.png' : '/pixellive-mark-black.png'}
              alt="Pixellive"
              className="h-7 w-auto"
            />
          </Link>

          {/* Desktop: logo sits immediately to the left of the links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="flex items-center group mr-4" aria-label="Pixellive home">
              <img
                src={theme === 'dark' ? '/pixellive-mark-white.png' : '/pixellive-mark-black.png'}
                alt="Pixellive"
                className="h-8 w-auto -mt-0.5 group-hover:opacity-80 transition-opacity"
              />
            </Link>
            {navLinks.map(link => {
              const active = location.pathname === link.href
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative px-4 py-1.5 text-sm font-medium transition-colors hover:text-neon"
                  style={{ color: active ? 'var(--neon)' : 'var(--fg-muted)' }}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-white border border-[var(--neon)]/30"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center hover:border-neon/40 transition-colors"
              aria-label="Toggle theme"
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-neon" />
                ) : (
                  <Moon className="w-4 h-4 text-neon-dim" />
                )}
              </motion.div>
            </button>

            <Link
              to="/contact"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-neon/10 border border-neon/40 text-neon hover:bg-neon/20 transition-all hover:shadow-[0_0_16px_rgba(236,28,36,0.35)]"
            >
              Get Started
            </Link>

            <button
              className="md:hidden w-9 h-9 rounded-xl glass-panel flex items-center justify-center"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 left-4 right-4 z-40 glass-panel rounded-2xl p-4 flex flex-col gap-2"
          >
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  location.pathname === link.href
                    ? 'bg-neon/10 text-neon border border-neon/20'
                    : 'hover:bg-white/5 text-[var(--fg-muted)]'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="mt-1 px-4 py-3 rounded-xl text-sm font-semibold bg-neon/10 border border-neon/40 text-neon text-center"
            >
              Get Started
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
