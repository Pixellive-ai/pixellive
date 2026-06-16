import { Link } from 'react-router-dom'
import { Twitter, Linkedin, Instagram, Youtube } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  // { href: '/blog', label: 'Blog' }, // hidden pre-launch — re-enable when blog has posts
  { href: '/about', label: 'About' },
]

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

// Pre-launch flag: hide dead social links (no real handles yet). Flip to true
// once real social profiles exist (HIDE/REVERSIBLE).
const SHOW_SOCIALS = false

export function Footer() {
  const { theme } = useTheme()
  return (
    <footer className="relative border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/50 to-transparent" />
      <div className="bg-grid-pattern absolute inset-0 opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link to="/" className="flex items-center mb-4 group" aria-label="Pixellive home">
              <img
                src={theme === 'dark' ? '/pixellive-mark-white.png' : '/pixellive-mark-black.png'}
                alt="Pixellive"
                className="h-8 w-auto group-hover:opacity-80 transition-opacity"
              />
            </Link>
            <p className="text-sm text-[var(--fg-muted)] leading-relaxed max-w-xs">
              A new generation of digital agency. Humans for craft. AI for the engine. We handle your entire online presence so you don&apos;t have to think about it.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4 font-semibold">Navigation</p>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-[var(--fg-muted)] hover:text-neon transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--muted)] mb-4 font-semibold">Connect</p>
            {SHOW_SOCIALS && (
            <div className="flex gap-3 mb-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center hover:border-neon/40 hover:text-neon transition-colors text-[var(--fg-muted)]"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            )}
            <p className="text-xs text-[var(--muted)]">hello@pixelliveproduction.com</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} Pixellive Production. All rights reserved.
          </p>
          <p className="text-xs text-[var(--muted)]">
            Crafted with precision. Built for impact.
          </p>
        </div>
      </div>
    </footer>
  )
}
