import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from 'sonner'
import ChatWidget from '@/components/ChatWidget'

// Home is the landing route — import it eagerly (not lazy) so the hero paints as
// soon as the main bundle executes, instead of waiting on a second chunk fetch +
// the PageLoader spinner. That extra round-trip was inflating LCP. All other
// routes stay lazy so they don't bloat the critical bundle.
import Home from '@/pages/Home'
const About = lazy(() => import('@/pages/About'))
const Services = lazy(() => import('@/pages/Services'))
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'))
// Pre-launch: Blog hidden until we publish real posts (empty for now).
// Re-enable these imports + the /blog routes below (HIDE/REVERSIBLE).
// const Blog = lazy(() => import('@/pages/Blog'))
// const BlogPost = lazy(() => import('@/pages/BlogPost'))
const Contact = lazy(() => import('@/pages/Contact'))
// Pre-launch: /admin route unregistered (no real auth yet). Page code kept in
// src/pages/Admin + src/admin. Re-enable by uncommenting this import and the
// matching <Route path="/admin" ...> below (HIDE/REVERSIBLE).
// const Admin = lazy(() => import('@/pages/Admin'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <div className="w-8 h-8 border-2 border-neon/20 border-t-neon rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  // Reset scroll to top on every route change (SPA navigation keeps the old
  // scroll position otherwise — landing mid/bottom of the new page).
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {!isAdminRoute && <Navbar />}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--fg)',
          },
        }}
      />
      <main>
        <AnimatePresence mode="wait" initial={false}>
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              {/* <Route path="/blog" element={<Blog />} /> */}
              {/* <Route path="/blog/:id" element={<BlogPost />} /> */}
              <Route path="/contact" element={<Contact />} />
              {/* <Route path="/admin" element={<Admin />} /> */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <ChatWidget />}
    </div>
  )
}
