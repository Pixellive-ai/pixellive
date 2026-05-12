import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import { PageTransition } from '@/components/ui/page-transition'
import { useSEO } from '@/lib/seo'

export default function NotFound() {
  useSEO('404 — Page Not Found')

  return (
    <PageTransition>
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[var(--bg)] relative overflow-hidden">
        <div className="bg-grid-pattern absolute inset-0 opacity-30" />
        <div className="relative z-10">
          <motion.div
            animate={{ filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
          >
            <h1 className="text-[12rem] font-black leading-none text-gradient-neon opacity-20 select-none">
              404
            </h1>
          </motion.div>
          <h2 className="text-4xl font-black -mt-8 mb-4">Page not found.</h2>
          <p className="text-[var(--fg-muted)] mb-8 max-w-sm">
            The page you're looking for has been moved, deleted, or never existed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-neon/10 border border-neon/40 text-neon hover:bg-neon/20 transition-all"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </section>
    </PageTransition>
  )
}
