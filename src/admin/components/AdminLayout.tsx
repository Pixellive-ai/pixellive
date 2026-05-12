import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, FileText, Search, LogOut, Zap, ExternalLink,
  ChevronRight,
} from 'lucide-react'
import { useAdminAuth } from '../AdminAuth'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/blogs', icon: FileText, label: 'Blog Posts' },
  { to: '/admin/seo', icon: Search, label: 'SEO & Robots' },
]

export function AdminLayout() {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--fg)]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-[var(--border-color)] flex flex-col bg-[var(--bg-secondary)]">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-neon/10 border border-neon/40 flex items-center justify-center">
              <Zap className="w-4 h-4 text-neon" />
            </div>
            <div>
              <p className="font-bold text-sm leading-none">PIXEL<span className="text-neon">LIVE</span></p>
              <p className="text-[10px] text-[var(--muted)] mt-0.5 uppercase tracking-widest">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-neon/10 text-neon border border-neon/20'
                    : 'text-[var(--fg-muted)] hover:bg-[var(--glass)] hover:text-[var(--fg)]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-neon' : '')} />
                  {label}
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto text-neon" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border-color)] space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--fg-muted)] hover:bg-[var(--glass)] hover:text-[var(--fg)] transition-all"
          >
            <ExternalLink className="w-4 h-4" /> View Site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--fg-muted)] hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <motion.div
          key="admin-content"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="min-h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
